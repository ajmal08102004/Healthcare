import React from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const AIInsights = ({ insights = [], isPatient = true }) => {
  const defaultInsights = [
    {
      type: 'positive',
      icon: CheckCircle,
      title: 'Great Progress!',
      message: 'Your exercise consistency has improved by 23% this week.',
      color: 'green'
    },
    {
      type: 'suggestion',
      icon: TrendingUp,
      title: 'Optimization Tip',
      message: 'Consider doing stretching exercises in the morning for better results.',
      color: 'blue'
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'Attention Needed',
      message: 'Your pain levels seem elevated. Consider discussing with your therapist.',
      color: 'yellow'
    }
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Brain className="h-4 w-4 text-purple-600" />
        </div>
      </div>
      
      <div className="space-y-4">
        {displayInsights.map((insight, index) => {
          const Icon = insight.icon;
          const colorClasses = {
            green: 'bg-green-50 border-green-200 text-green-800',
            blue: 'bg-blue-50 border-blue-200 text-blue-800',
            yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            purple: 'bg-purple-50 border-purple-200 text-purple-800'
          };
          
          const iconColors = {
            green: 'text-green-600',
            blue: 'text-blue-600',
            yellow: 'text-yellow-600',
            purple: 'text-purple-600'
          };
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${colorClasses[insight.color]} transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${iconColors[insight.color]}`} />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{insight.title}</h4>
                  <p className="text-sm opacity-90">{insight.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        
        {insights.length === 0 && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              {isPatient 
                ? "AI-generated insights about your performance will appear here."
                : "AI insights about patient progress will appear here."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;