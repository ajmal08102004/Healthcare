import React from 'react';

const MessageBubble = ({ message, isSent, timestamp }) => {
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isSent 
          ? 'bg-green-100 text-green-900' 
          : 'bg-blue-100 text-blue-900'
      }`}>
        <p className="text-sm">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-70 mt-1">{timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;