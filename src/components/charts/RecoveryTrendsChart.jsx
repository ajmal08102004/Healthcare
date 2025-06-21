import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const RecoveryTrendsChart = ({ selectedPatient = "All Patients" }) => {
  const [timeUnit, setTimeUnit] = useState('weekly');
  const [chartType, setChartType] = useState('progress');
  
  const progressData = {
    daily: [
      { period: 'Mon', progress: 20, pain: 7 },
      { period: 'Tue', progress: 35, pain: 6 },
      { period: 'Wed', progress: 45, pain: 5 },
      { period: 'Thu', progress: 60, pain: 4 },
      { period: 'Fri', progress: 70, pain: 3 },
      { period: 'Sat', progress: 75, pain: 3 },
      { period: 'Sun', progress: 85, pain: 2 }
    ],
    weekly: [
      { period: 'Week 1', progress: 25, pain: 6 },
      { period: 'Week 2', progress: 45, pain: 5 },
      { period: 'Week 3', progress: 65, pain: 4 },
      { period: 'Week 4', progress: 85, pain: 2 }
    ],
    monthly: [
      { period: 'Jan', progress: 30, pain: 6 },
      { period: 'Feb', progress: 55, pain: 4 },
      { period: 'Mar', progress: 75, pain: 3 },
      { period: 'Apr', progress: 90, pain: 2 }
    ]
  };

  const exerciseData = {
    daily: [
      { period: 'Mon', completed: 8, target: 10 },
      { period: 'Tue', completed: 12, target: 12 },
      { period: 'Wed', completed: 6, target: 10 },
      { period: 'Thu', completed: 15, target: 15 },
      { period: 'Fri', completed: 10, target: 12 },
      { period: 'Sat', completed: 8, target: 10 },
      { period: 'Sun', completed: 14, target: 15 }
    ],
    weekly: [
      { period: 'Week 1', completed: 45, target: 50 },
      { period: 'Week 2', completed: 52, target: 55 },
      { period: 'Week 3', completed: 48, target: 50 },
      { period: 'Week 4', completed: 58, target: 60 }
    ],
    monthly: [
      { period: 'Jan', completed: 180, target: 200 },
      { period: 'Feb', completed: 195, target: 210 },
      { period: 'Mar', completed: 220, target: 230 },
      { period: 'Apr', completed: 240, target: 250 }
    ]
  };

  const currentData = chartType === 'progress' ? progressData[timeUnit] : exerciseData[timeUnit];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recovery Trends</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['progress', 'exercises'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  chartType === type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type === 'progress' ? 'Progress' : 'Exercises'}
              </button>
            ))}
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['daily', 'weekly', 'monthly'].map((unit) => (
              <button
                key={unit}
                onClick={() => setTimeUnit(unit)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeUnit === unit
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {unit.charAt(0).toUpperCase() + unit.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'progress' ? (
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
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
                name="Progress %"
              />
              <Line 
                type="monotone" 
                dataKey="pain" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#EF4444', strokeWidth: 2 }}
                name="Pain Level"
              />
            </LineChart>
          ) : (
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="period" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <Bar 
                dataKey="completed" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                name="Completed"
              />
              <Bar 
                dataKey="target" 
                fill="#E5E7EB" 
                radius={[4, 4, 0, 0]}
                name="Target"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        {chartType === 'progress' ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Recovery Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Pain Level</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Target</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecoveryTrendsChart;