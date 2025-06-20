import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

const ChatInputBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Paperclip className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors"
          >
            <Smile className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <button
          type="submit"
          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInputBox;