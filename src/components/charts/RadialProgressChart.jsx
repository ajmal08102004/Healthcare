import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Award } from 'lucide-react';

const RadialProgressChart = ({ percentage, title, subtitle, color = "#10B981" }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const radius = 45;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
      
      // Show celebration for high completion rates
      if (percentage >= 90) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [percentage]);

  const getProgressColor = (percent) => {
    if (percent >= 90) return "#10B981"; // Green
    if (percent >= 70) return "#3B82F6"; // Blue
    if (percent >= 50) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getProgressGradient = (percent) => {
    if (percent >= 90) return "from-green-400 to-green-600";
    if (percent >= 70) return "from-blue-400 to-blue-600";
    if (percent >= 50) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const currentColor = getProgressColor(animatedPercentage);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center relative">
          <Target className="h-4 w-4 text-purple-600" />
          {showCelebration && (
            <div className="absolute inset-0 bg-yellow-200 rounded-lg animate-ping opacity-75"></div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-center relative">
        <div className="relative">
          {/* Background circle */}
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            <circle
              stroke="#E5E7EB"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke={currentColor}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ 
                strokeDashoffset,
                transition: 'stroke-dashoffset 2s ease-out, stroke 0.5s ease-out'
              }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="drop-shadow-sm"
            />
            {/* Glow effect for high percentages */}
            {animatedPercentage >= 90 && (
              <circle
                stroke={currentColor}
                fill="transparent"
                strokeWidth={strokeWidth + 2}
                strokeDasharray={strokeDasharray}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="opacity-30 animate-pulse"
              />
            )}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold transition-all duration-500 ${
                animatedPercentage >= 90 ? 'text-green-600 animate-pulse' :
                animatedPercentage >= 70 ? 'text-blue-600' :
                animatedPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Math.round(animatedPercentage)}%
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                {animatedPercentage >= 90 && <Award className="h-3 w-3 text-yellow-500" />}
                Complete
              </div>
            </div>
          </div>
          
          {/* Celebration particles */}
          {showCelebration && (
            <>
              <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </>
          )}
        </div>
      </div>
      
      {subtitle && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            {animatedPercentage >= 90 && <TrendingUp className="h-4 w-4 text-green-500" />}
            {subtitle}
          </p>
        </div>
      )}
      
      {/* Progress indicator bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-2000 ease-out bg-gradient-to-r ${getProgressGradient(animatedPercentage)} relative`}
          style={{ width: `${animatedPercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Achievement badges */}
      {animatedPercentage >= 90 && (
        <div className="mt-3 flex justify-center">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full border border-yellow-200">
            <span className="text-xs font-medium text-yellow-800 flex items-center gap-1">
              <Award className="h-3 w-3" />
              Excellent Progress!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadialProgressChart;