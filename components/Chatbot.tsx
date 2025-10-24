import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import Message from './Message';
import LoadingSpinner from './LoadingSpinner';
import { getChatResponse } from '../services/geminiService';
import useGeolocation from '../hooks/useGeolocation';
import { useLiveChat, ConnectionState } from '../hooks/useLiveChat';
import LiveTranscription from './LiveTranscription';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { author: MessageAuthor.BOT, text: "Hi there! I'm VitalFlow's AI assistant. How can I help you today? You can ask me about finding donation centers, eligibility, or the donation process." },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'text' | 'voice'>('text');

  const { location } = useGeolocation();
  const { 
    connectionState, 
    inputTranscription, 
    outputTranscription, 
    isMuted, 
    startSession, 
    closeSession, 
    toggleMute 
  } = useLiveChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botResponse = await getChatResponse(input, location);
    setMessages(prev => [...prev, botResponse]);
    setIsLoading(false);
  };
  
  const handleVoiceToggle = () => {
      if (chatMode === 'text') {
        setChatMode('voice');
        startSession();
      } else {
        setChatMode('text');
        closeSession();
      }
  };
  
  useEffect(() => {
    // Cleanup live session if chatbot is closed
    if (!isOpen && connectionState !== ConnectionState.IDLE && connectionState !== ConnectionState.DISCONNECTED) {
      closeSession();
      setChatMode('text');
    }
  }, [isOpen, closeSession, connectionState]);

  const renderMicButton = () => {
    let content, colorClass, pulseClass = '';

    switch (connectionState) {
        case ConnectionState.CONNECTING:
            content = <div className="w-10 h-10 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>;
            colorClass = 'bg-yellow-500';
            break;
        case ConnectionState.CONNECTED:
            content = <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMuted ? "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3zM1 11h2m18 0h-2" : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"} /></svg>;
            colorClass = isMuted ? 'bg-gray-500' : 'bg-red-600';
            pulseClass = !isMuted ? 'animate-pulse' : '';
            break;
        case ConnectionState.ERROR:
            content = <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
            colorClass = 'bg-gray-700';
            break;
        default: // IDLE, DISCONNECTED
            content = <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
            colorClass = 'bg-red-600 hover:bg-red-700';
            break;
    }

    const handleClick = () => {
        if (connectionState === ConnectionState.CONNECTED) {
            toggleMute();
        } else if (connectionState === ConnectionState.IDLE || connectionState === ConnectionState.DISCONNECTED || connectionState === ConnectionState.ERROR) {
            startSession();
        }
    };

    return (
        <button 
            onClick={handleClick}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${colorClass} ${pulseClass}`}
        >
            {content}
        </button>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-red-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-all transform hover:scale-110 z-30"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>

      <div className={`fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-gray-50 rounded-lg shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-20 ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <header className="bg-red-600 text-white p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="font-bold text-lg">VitalFlow Assistant</h3>
          <button onClick={handleVoiceToggle} className="p-1 rounded-full hover:bg-red-700" title={chatMode === 'text' ? "Switch to Voice Chat" : "Switch to Text Chat"}>
            {chatMode === 'text' ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            }
          </button>
        </header>

        {chatMode === 'text' ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
              {messages.map((msg, index) => <Message key={index} message={msg} />)}
              {isLoading && <div className="flex justify-start"><LoadingSpinner /></div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-800 text-white relative rounded-b-lg">
             <LiveTranscription inputTranscription={inputTranscription} outputTranscription={outputTranscription} />
             {renderMicButton()}
             <p className="mt-4 text-sm text-gray-400 text-center">
                 {connectionState === ConnectionState.CONNECTED && !isMuted && "I'm listening..."}
                 {connectionState === ConnectionState.CONNECTED && isMuted && "Tap to talk"}
                 {connectionState === ConnectionState.CONNECTING && "Connecting..."}
                 {(connectionState === ConnectionState.IDLE || connectionState === ConnectionState.DISCONNECTED) && "Tap mic to start"}
                 {connectionState === ConnectionState.ERROR && "Connection error. Tap to retry."}
             </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
