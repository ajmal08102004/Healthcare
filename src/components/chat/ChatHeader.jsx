import React from 'react';
import { Phone, Video, MoreHorizontal } from 'lucide-react';

const ChatHeader = ({ userName = "User Name", isOnline = false }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          👤
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{userName}</h3>
          {isOnline && (
            <span className="text-sm text-green-600">Online</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Phone className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Video className="h-5 w-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;