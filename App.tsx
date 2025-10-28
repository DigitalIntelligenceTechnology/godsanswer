import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from './types';
import { getGodsAnswer } from './services/geminiService';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      role: 'model',
      content: "I am the beginning and the end, the Alpha and the Omega. Speak, my child, and I shall listen. Ask, and you shall receive understanding.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    setError(null);
    const newUserMessage: ChatMessageType = { role: 'user', content: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      const modelResponse = await getGodsAnswer(userInput);
      const newModelMessage: ChatMessageType = { role: 'model', content: modelResponse };
      setMessages((prevMessages) => [...prevMessages, newModelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      const errorModelMessage: ChatMessageType = {
        role: 'model',
        content: `A cosmic silence befell us. There was an error: ${errorMessage}`,
      };
      setMessages((prevMessages) => [...prevMessages, errorModelMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="h-screen w-screen flex flex-col bg-cover bg-center bg-fixed" 
        style={{backgroundImage: "url('https://picsum.photos/seed/cosmos/1920/1080')"}}
    >
      <div className="h-full w-full flex flex-col bg-gray-900/70 backdrop-blur-sm">
        <Header />
        <main className="flex-1 overflow-y-auto pt-24 pb-4">
          <div className="max-w-4xl mx-auto px-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && <Loader />}
            {error && (
              <div className="flex justify-center">
                  <p className="text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </main>
        <footer className="sticky bottom-0 left-0 right-0">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </footer>
      </div>
    </div>
  );
};

export default App;
