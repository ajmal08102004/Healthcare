import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const ExerciseProgress = () => {
  const data = [
    { day: 'M', exercises: 8 },
    { day: 'T', exercises: 12 },
    { day: 'W', exercises: 6 },
    { day: 'T', exercises: 15 },
    { day: 'F', exercises: 10 },
    { day: 'S', exercises: 8 },
    { day: 'S', exercises: 14 }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Exercise Completion Progress</h3>
        <span className="text-sm text-gray-500">Daily Goals</span>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              fontSize={12}
            />
            <YAxis hide />
            <Bar 
              dataKey="exercises" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExerciseProgress;