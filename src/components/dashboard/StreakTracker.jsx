import React from 'react';
import { Calendar, Flame } from 'lucide-react';

const StreakTracker = ({ streakDays = 7, currentStreak = 5 }) => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Daily Streak</h3>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-2xl font-bold text-orange-500">{currentStreak}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{currentStreak}</div>
          <div className="text-sm text-gray-600">Days in a row</div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const isCompleted = index <= today && index < currentStreak;
            const isToday = index === today;
            
            return (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                  isCompleted
                    ? 'bg-orange-500 text-white shadow-lg'
                    : isToday
                    ? 'bg-orange-100 text-orange-600 border-2 border-orange-300'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Keep it up! 🔥</span>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;