import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const RecoveryProgressChart = () => {
  const data = [
    { day: 'Mon', progress: 20 },
    { day: 'Tue', progress: 35 },
    { day: 'Wed', progress: 45 },
    { day: 'Thu', progress: 60 },
    { day: 'Fri', progress: 70 },
    { day: 'Sat', progress: 75 },
    { day: 'Sun', progress: 85 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recovery Progress</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>This Week</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              fill="#6B7280"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              fontSize={12}
              fill="#6B7280"
            />
            <Line 
              type="monotone" 
              dataKey="progress" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecoveryProgressChart;