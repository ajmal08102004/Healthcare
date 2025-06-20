import React from 'react';
import { Search, Clock } from 'lucide-react';

const UpcomingSessions = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Session Link</h3>
      
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Dr Afnan</h4>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <Clock className="h-4 w-4" />
                10:00 - 10:30 am
              </div>
            </div>
          </div>
          
          <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Click to Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingSessions;