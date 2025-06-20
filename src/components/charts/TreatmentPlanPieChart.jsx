import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const TreatmentPlanPieChart = () => {
  const data = [
    { name: 'Exercise Completed', value: 70, color: '#10B981' },
    { name: 'Yoga Sessions', value: 20, color: '#3B82F6' },
    { name: 'Rest Days', value: 10, color: '#F59E0B' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Treatment Plan Progress</h3>
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          📊
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TreatmentPlanPieChart;