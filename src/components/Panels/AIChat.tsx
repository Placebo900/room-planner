import React, { useState } from 'react';
import type { ChatMessage } from '../../types/editor';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export const AIChat: React.FC<AIChatProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-4 bg-white border-b">
        <h3 className="font-bold text-lg text-gray-900">Designer Agent</h3>
        <p className="text-xs text-gray-500 mt-1">AI помощник для планирования</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <p className="text-sm text-gray-800">
            Распредели двери по квартире оптимальным способом и подбери лучшие по цветовой гамме
          </p>
        </div>
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg shadow-sm ${
              msg.isUser 
                ? 'bg-blue-100 ml-auto max-w-[85%]' 
                : 'bg-white max-w-[85%]'
            }`}
          >
            <p className="text-sm text-gray-800">{msg.text}</p>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-white border-t">
        <div className="bg-orange-100 p-3 rounded-lg mb-3">
          <p className="text-sm font-medium text-gray-800">Лютая дверка дерево + золото</p>
          <p className="text-lg font-bold text-green-600">90 000 руб</p>
          <button className="text-xs text-blue-600 mt-2 hover:underline">
            Посмотреть &gt;&gt;
          </button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Спросите что-нибудь..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Отправить"
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
};
