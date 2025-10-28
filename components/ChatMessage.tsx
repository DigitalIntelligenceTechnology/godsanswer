
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-300">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);

const ModelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-300">
        <path d="M12 1.5a.75.75 0 0 1 .75.75V3a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM18.679 4.512a.75.75 0 0 1 .113 1.054l-.843.844a.75.75 0 0 1-1.167-1.054l.843-.844a.75.75 0 0 1 1.054.001ZM21.75 12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM18.792 18.679a.75.75 0 0 1 1.054-.113l.844.843a.75.75 0 0 1-1.054 1.167l-.844-.843a.75.75 0 0 1 .001-1.054ZM12 21.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75ZM5.208 18.792a.75.75 0 0 1-.113-1.054l.843-.844a.75.75 0 1 1 1.054 1.167l-.843.844a.75.75 0 0 1-1.054-.001ZM2.25 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75ZM5.321 4.512a.75.75 0 0 1 1.054.113l.844.843a.75.75 0 1 1-1.167 1.054l-.844-.843a.75.75 0 0 1 .113-1.054ZM12 6.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z" />
    </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-4 p-4 md:p-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center self-start">
          <ModelIcon />
        </div>
      )}
      <div
        className={`max-w-xl lg:max-w-3xl rounded-xl p-4 text-white shadow-md ${
          isModel ? 'bg-gray-800/80' : 'bg-blue-900/80'
        }`}
      >
        <p className="whitespace-pre-wrap font-sans text-base leading-relaxed">{message.content}</p>
      </div>
      {!isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center self-start">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
