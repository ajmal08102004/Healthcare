import React from 'react';

const StatCard = ({ title, value, icon, subtitle, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="text-2xl">{icon}</div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {subtitle && (
            <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
          )}
        </div>
        
        {trend && (
          <div className={`flex items-center text-sm ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{trend > 0 ? '↗' : '↘'}</span>
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;