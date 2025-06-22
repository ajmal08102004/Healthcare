import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';

const AdherenceRate = ({ rate = 85, trend = 5 }) => {
  const [animatedRate, setAnimatedRate] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedRate(rate);
      
      // Show achievement for high adherence rates
      if (rate >= 90) {
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 3000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [rate]);

  const getAdherenceLevel = (rate) => {
    if (rate >= 90) return { level: 'Excellent', color: 'green', icon: Award };
    if (rate >= 80) return { level: 'Great', color: 'blue', icon: TrendingUp };
    if (rate >= 70) return { level: 'Good', color: 'yellow', icon: Target };
    return { level: 'Needs Improvement', color: 'red', icon: Zap };
  };

  const adherenceInfo = getAdherenceLevel(animatedRate);
  const Icon = adherenceInfo.icon;

  const getColorClasses = (color) => {
    switch (color) {
      case 'green': return {
        bg: 'from-green-400 to-green-600',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-800 border-green-200'
      };
      case 'blue': return {
        bg: 'from-blue-400 to-blue-600',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800 border-blue-200'
      };
      case 'yellow': return {
        bg: 'from-yellow-400 to-yellow-600',
        text: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
      case 'red': return {
        bg: 'from-red-400 to-red-600',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-800 border-red-200'
      };
      default: return {
        bg: 'from-gray-400 to-gray-600',
        text: 'text-gray-600',
        badge: 'bg-gray-100 text-gray-800 border-gray-200'
      };
    }
  };

  const colors = getColorClasses(adherenceInfo.color);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-50 to-blue-50 rounded-full -translate-y-12 translate-x-12 opacity-40"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Adherence Rate</h3>
        <div className="flex items-center gap-2">
          {trend > 0 && (
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+{trend}%</span>
            </div>
          )}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative ${
            adherenceInfo.color === 'green' ? 'bg-green-100' : 
            adherenceInfo.color === 'blue' ? 'bg-blue-100' :
            adherenceInfo.color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <Icon className={`h-4 w-4 ${colors.text}`} />
            {showAchievement && (
              <div className="absolute inset-0 bg-yellow-200 rounded-lg animate-ping opacity-75"></div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center relative">
          <div className={`text-3xl font-bold transition-all duration-1000 ${colors.text} ${
            showAchievement ? 'animate-pulse' : ''
          }`}>
            {Math.round(animatedRate)}%
          </div>
          <div className="text-sm text-gray-600">Exercise Accuracy</div>
          
          {/* Achievement notification */}
          {showAchievement && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <div className="bg-yellow-100 border border-yellow-200 rounded-lg px-3 py-1 animate-bounce">
                <span className="text-xs font-medium text-yellow-800 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Outstanding!
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative">
          <div 
            className={`h-4 rounded-full transition-all duration-2000 ease-out bg-gradient-to-r ${colors.bg} relative`}
            style={{ width: `${animatedRate}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            
            {/* Glow effect for excellent performance */}
            {animatedRate >= 90 && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-500 opacity-50 animate-pulse"></div>
            )}
          </div>
          
          {/* Progress markers */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full flex justify-between px-1">
              {[25, 50, 75].map((marker) => (
                <div 
                  key={marker}
                  className={`w-0.5 h-2 bg-white rounded-full transition-opacity duration-500 ${
                    animatedRate > marker ? 'opacity-60' : 'opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Performance breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">Form</div>
            <div className={`text-xs px-2 py-1 rounded-full border ${
              animatedRate >= 90 ? 'bg-green-100 text-green-700 border-green-200' :
              animatedRate >= 80 ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-yellow-100 text-yellow-700 border-yellow-200'
            }`}>
              {animatedRate >= 90 ? 'Excellent' : animatedRate >= 80 ? 'Great' : 'Good'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">Timing</div>
            <div className={`text-xs px-2 py-1 rounded-full border ${
              animatedRate >= 85 ? 'bg-green-100 text-green-700 border-green-200' :
              animatedRate >= 75 ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-yellow-100 text-yellow-700 border-yellow-200'
            }`}>
              {animatedRate >= 85 ? 'Perfect' : animatedRate >= 75 ? 'Good' : 'Fair'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-gray-900">Consistency</div>
            <div className={`text-xs px-2 py-1 rounded-full border ${
              animatedRate >= 88 ? 'bg-green-100 text-green-700 border-green-200' :
              animatedRate >= 78 ? 'bg-blue-100 text-blue-700 border-blue-200' :
              'bg-yellow-100 text-yellow-700 border-yellow-200'
            }`}>
              {animatedRate >= 88 ? 'Excellent' : animatedRate >= 78 ? 'Great' : 'Good'}
            </div>
          </div>
        </div>
        
        {/* Achievement badge */}
        <div className="flex justify-center">
          <div className={`px-3 py-2 rounded-lg border transition-all duration-500 ${colors.badge} ${
            showAchievement ? 'animate-pulse scale-105' : ''
          }`}>
            <span className="text-sm font-medium flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {adherenceInfo.level} Performance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdherenceRate;