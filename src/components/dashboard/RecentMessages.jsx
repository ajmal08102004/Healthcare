import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const RecentMessages = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Recent'];
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
      
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="w-24 h-2 bg-gray-200 rounded mb-1"></div>
              <div className="w-16 h-2 bg-gray-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;