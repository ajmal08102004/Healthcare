import React from 'react';
import { TrendingUp } from 'lucide-react';

const AdherenceRate = ({ rate = 85, trend = 5 }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Adherence Rate</h3>
        <div className="flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">+{trend}%</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{rate}%</div>
          <div className="text-sm text-gray-600">Exercise Accuracy</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${rate}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm font-semibold text-gray-900">Form</div>
            <div className="text-xs text-green-600">Excellent</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Timing</div>
            <div className="text-xs text-blue-600">Good</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Consistency</div>
            <div className="text-xs text-green-600">Great</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdherenceRate;