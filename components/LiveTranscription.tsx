import React from 'react';

interface LiveTranscriptionProps {
  inputTranscription: string;
  outputTranscription: string;
}

const LiveTranscription: React.FC<LiveTranscriptionProps> = ({ inputTranscription, outputTranscription }) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-70 rounded-t-lg">
      <p className="text-sm text-gray-300 truncate">
        <span className="font-semibold text-gray-100">You: </span>
        <span>{inputTranscription}</span>
      </p>
      <p className="text-sm text-white truncate mt-1">
        <span className="font-semibold">Bot: </span>
        <span>{outputTranscription}</span>
      </p>
    </div>
  );
};

export default LiveTranscription;
