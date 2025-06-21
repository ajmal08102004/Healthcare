import React, { useState } from 'react';
import { MessageCircle, Search, Clock, User } from 'lucide-react';

const EnhancedRecentMessages = ({ isPhysio = false, selectedPatient = "All Patients" }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const tabs = ['All', 'Unread', 'Recent'];
  
  const messages = [
    {
      id: 1,
      sender: isPhysio ? 'John Doe' : 'Dr. Sarah Johnson',
      message: 'How are you feeling after yesterday\'s session?',
      time: '2 min ago',
      unread: true,
      avatar: isPhysio ? '👤' : '👩‍⚕️',
      type: 'question'
    },
    {
      id: 2,
      sender: isPhysio ? 'Jane Smith' : 'Dr. Michael Chen',
      message: 'Thank you for the exercise modifications!',
      time: '15 min ago',
      unread: false,
      avatar: isPhysio ? '👤' : '👨‍⚕️',
      type: 'thanks'
    },
    {
      id: 3,
      sender: isPhysio ? 'Mike Johnson' : 'Dr. Emily Rodriguez',
      message: 'I completed all exercises today 💪',
      time: '1 hour ago',
      unread: true,
      avatar: isPhysio ? '👤' : '👩‍⚕️',
      type: 'update'
    },
    {
      id: 4,
      sender: isPhysio ? 'Sarah Wilson' : 'Dr. James Wilson',
      message: 'Can we reschedule tomorrow\'s appointment?',
      time: '2 hours ago',
      unread: false,
      avatar: isPhysio ? '👤' : '👨‍⚕️',
      type: 'request'
    }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || 
                      (activeTab === 'Unread' && message.unread) ||
                      (activeTab === 'Recent' && message.time.includes('min'));
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
        <MessageCircle className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {tab === 'Unread' && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {messages.filter(m => m.unread).length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Messages List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer ${
                message.unread ? 'bg-blue-50 border border-blue-100' : 'border border-transparent'
              }`}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                {message.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm truncate ${message.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {message.sender}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {message.time}
                  </div>
                </div>
                <p className={`text-sm truncate ${message.unread ? 'text-gray-800' : 'text-gray-600'}`}>
                  {message.message}
                </p>
              </div>
              {message.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
              )}
            </div>
          ))}
          
          {filteredMessages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No messages found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedRecentMessages;