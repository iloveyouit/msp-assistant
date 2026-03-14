import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Message from './Message';

export default function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {messages.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-slate-800/70 rounded-lg px-4 py-3 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-slate-300">Analyzing...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
