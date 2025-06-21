import React from 'react';
import { Calendar, Clock, Video, User } from 'lucide-react';

const NextMeeting = ({ 
  doctorName = "Dr. Sarah Johnson", 
  date = "Tomorrow", 
  time = "10:00 AM", 
  type = "video",
  canJoin = false 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Next Session</h3>
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Calendar className="h-4 w-4 text-blue-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{doctorName}</div>
            <div className="text-sm text-gray-600">Physiotherapist</div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800">{time}</span>
          </div>
        </div>
        
        {canJoin ? (
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Video className="h-4 w-4" />
            Join Session
          </button>
        ) : (
          <div className="text-center py-2">
            <div className="text-sm text-gray-500">Session starts in</div>
            <div className="text-lg font-bold text-gray-900">14 hours</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextMeeting;