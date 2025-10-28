import React, { useState, useEffect, useRef } from 'react';

// TypeScript definitions for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}
declare global {
    interface Window {
        SpeechRecognition: { new(): SpeechRecognition };
        webkitSpeechRecognition: { new(): SpeechRecognition };
    }
}


interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSpeechSupported = useRef(false);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
        isSpeechSupported.current = true;
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (event.error === 'not-allowed') {
                setSpeechError("Microphone access denied. Please allow microphone access in your browser's settings to use this feature.");
            } else {
                setSpeechError(`An error occurred during speech recognition: ${event.error}. Please try again.`);
            }
            console.error('Speech recognition error:', event.error, event.message);
            setIsListening(false);
        };
        recognition.onend = () => {
            setIsListening(false);
        };
        recognitionRef.current = recognition;
    } else {
        console.warn("Speech recognition not supported by this browser.");
    }
  }, []);

  const handleListen = () => {
    setSpeechError(null);
    if (isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setSpeechError("Could not start speech recognition. Please check microphone permissions.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto flex items-center gap-2 p-2 rounded-xl bg-gray-800 border border-gray-700 focus-within:border-yellow-400 transition-colors">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (speechError) setSpeechError(null);
          }}
          placeholder={isListening ? "Listening..." : "Ask a question..."}
          disabled={isLoading}
          className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none px-2"
          autoFocus
        />
        {isSpeechSupported.current && (
            <button
              type="button"
              onClick={handleListen}
              disabled={isLoading}
              className={`flex-shrink-0 text-white rounded-lg p-2 disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 ${isListening ? 'bg-red-600 animate-pulse' : 'bg-transparent'}`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
              style={{ animationIterationCount: isListening ? 'infinite' : '0' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
                <path d="M5.5 4.75a.75.75 0 0 0-1.5 0v5.5a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4v-5.5a.75.75 0 0 0-1.5 0V10a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 1 5.5 10V4.75Z" />
              </svg>
            </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-shrink-0 bg-yellow-400 text-gray-900 rounded-lg p-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
          aria-label="Send message"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          )}
        </button>
      </div>
       {speechError && (
        <div className="max-w-4xl mx-auto">
            <p className="text-red-400 text-sm text-center mt-2 px-2">{speechError}</p>
        </div>
      )}
    </form>
  );
};

export default ChatInput;