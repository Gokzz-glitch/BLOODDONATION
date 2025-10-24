import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenAI_Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';

// Constants from Gemini docs
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const BUFFER_SIZE = 4096;

export enum ConnectionState {
  IDLE,
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
  ERROR,
}

export const useLiveChat = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.IDLE);
  const [inputTranscription, setInputTranscription] = useState('');
  const [outputTranscription, setOutputTranscription] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  const sessionRef = useRef<LiveSession | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // For smooth audio playback
  const nextStartTimeRef = useRef(0);
  const audioQueueRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Mutable refs for transcription to avoid stale closures
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  // Ref to deal with stale isMuted state in audio processor callback
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const aiRef = useRef<GoogleGenAI | null>(null);

  // Fix: Moved closeSession function declaration before its usage to resolve block-scoped variable error.
  const closeSession = useCallback(() => {
    if (!sessionRef.current && !mediaStreamRef.current) return;

    sessionRef.current?.close();
    sessionRef.current = null;

    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    
    mediaStreamSourceRef.current?.disconnect();
    mediaStreamSourceRef.current = null;

    processorRef.current?.disconnect();
    processorRef.current = null;
    
    inputAudioContextRef.current?.close().catch(console.error);
    outputAudioContextRef.current?.close().catch(console.error);
    
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    
    for(const source of audioQueueRef.current.values()) {
        try { source.stop(); } catch (e) { /* ignore */ }
    }
    audioQueueRef.current.clear();
    nextStartTimeRef.current = 0;

    if (connectionState !== ConnectionState.IDLE) {
      setConnectionState(ConnectionState.DISCONNECTED);
    }
    setIsMuted(true);
  }, [connectionState]);

  useEffect(() => {
    // Initialize AI client-side
    if (process.env.API_KEY) {
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
        console.error("API_KEY environment variable not set");
        setConnectionState(ConnectionState.ERROR);
    }
    return () => {
      // Cleanup on unmount
      closeSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createBlob = (data: Float32Array): GenAI_Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
    };
  };
  
  const startSession = useCallback(async () => {
    if (connectionState === ConnectionState.CONNECTING || connectionState === ConnectionState.CONNECTED) {
      return;
    }
    
    if (!aiRef.current) {
        setConnectionState(ConnectionState.ERROR);
        return;
    }

    setConnectionState(ConnectionState.CONNECTING);
    setInputTranscription('');
    setOutputTranscription('');
    currentInputTranscriptionRef.current = '';
    currentOutputTranscriptionRef.current = '';

    try {
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });

      const sessionPromise = aiRef.current.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a helpful AI assistant for VitalFlow, a blood donation application. Keep your answers concise and friendly. You can help users find donation centers, check eligibility, and understand the donation process.'
        },
        callbacks: {
          onopen: () => {
            setConnectionState(ConnectionState.CONNECTED);
            setIsMuted(false); // Start unmuted
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle transcriptions
            if (message.serverContent?.inputTranscription) {
              currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
              setInputTranscription(currentInputTranscriptionRef.current);
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
              setOutputTranscription(currentOutputTranscriptionRef.current);
            }
            if (message.serverContent?.turnComplete) {
              currentInputTranscriptionRef.current = '';
              currentOutputTranscriptionRef.current = '';
            }

            // Handle audio output
            const audioDataB64 = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
            if (audioDataB64 && outputAudioContextRef.current) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioDataB64), outputAudioContextRef.current, OUTPUT_SAMPLE_RATE, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              
              source.addEventListener('ended', () => {
                  audioQueueRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              audioQueueRef.current.add(source);
            }
            
            // Handle interruptions
            if (message.serverContent?.interrupted) {
                for(const source of audioQueueRef.current.values()) {
                    source.stop();
                    audioQueueRef.current.delete(source);
                }
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setConnectionState(ConnectionState.DISCONNECTED);
          },
          onerror: (e) => {
            console.error('Live session error:', e);
            setConnectionState(ConnectionState.ERROR);
            closeSession();
          },
        },
      });

      // Setup microphone streaming
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      if (!inputAudioContextRef.current) return;
      
      mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(stream);
      const processor = inputAudioContextRef.current.createScriptProcessor(BUFFER_SIZE, 1, 1);
      
      processor.onaudioprocess = (audioProcessingEvent) => {
        if (isMutedRef.current) return;
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        const pcmBlob = createBlob(inputData);
        sessionPromise.then((session) => {
          session.sendRealtimeInput({ media: pcmBlob });
        });
      };

      mediaStreamSourceRef.current.connect(processor);
      processor.connect(inputAudioContextRef.current.destination); // Connect to destination to keep it alive
      processorRef.current = processor;

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error('Failed to start live session:', err);
      setConnectionState(ConnectionState.ERROR);
    }
  }, [connectionState, closeSession]);

  return {
    connectionState,
    inputTranscription,
    outputTranscription,
    isMuted,
    startSession,
    closeSession,
    toggleMute: () => setIsMuted(prev => !prev),
  };
};