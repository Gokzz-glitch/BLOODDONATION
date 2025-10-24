import React from 'react';
import { ChatMessage, MessageAuthor, GroundingChunk } from '../types';

const GroundingInfo: React.FC<{ chunks: GroundingChunk[] }> = ({ chunks }) => {
  const sources = chunks.flatMap(chunk => {
    const webSources = chunk.web ? [{ uri: chunk.web.uri, title: chunk.web.title }] : [];
    const mapSources = chunk.maps ? [{ uri: chunk.maps.uri, title: chunk.maps.title }] : [];
    const reviewSources = chunk.maps?.placeAnswerSources?.reviewSnippets?.map(r => ({ uri: r.uri, title: "Review Snippet" })) || [];
    return [...webSources, ...mapSources, ...reviewSources];
  }).filter(source => source.uri);

  if (sources.length === 0) return null;

  return (
    <div className="mt-2 text-xs text-gray-500">
      <p className="font-semibold mb-1">Sources:</p>
      <ul className="list-disc list-inside space-y-1">
        {sources.map((source, index) => (
          <li key={index}>
            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {source.title || source.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.author === MessageAuthor.USER;
  const wrapperClasses = isUser ? 'flex justify-end' : 'flex justify-start';
  const bubbleClasses = isUser
    ? 'bg-red-600 text-white rounded-br-none'
    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none';

  return (
    <div className={wrapperClasses}>
      <div className={`max-w-sm md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.author === MessageAuthor.BOT && message.groundingChunks && <GroundingInfo chunks={message.groundingChunks} />}
      </div>
    </div>
  );
};

export default Message;
