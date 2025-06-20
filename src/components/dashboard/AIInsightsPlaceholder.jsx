import React from 'react';

const AIInsightsPlaceholder = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
      
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="w-full h-3 bg-gray-200 rounded"></div>
          <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
          <div className="w-3/5 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPlaceholder;