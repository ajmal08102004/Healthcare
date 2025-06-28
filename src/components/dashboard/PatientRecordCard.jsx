import React from 'react';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  TrendingUp, 
  Clock, 
  Target, 
  AlertCircle,
  CheckCircle,
  Activity,
  Heart,
  Zap,
  Award,
  Flame
} from 'lucide-react';

const PatientRecordCard = ({ patient }) => {
  if (!patient || patient.isOverview) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
          <p className="text-gray-600">Search and select a patient to view their detailed record</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'attention': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPainLevelColor = (level) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'from-green-400 to-green-600';
    if (progress >= 60) return 'from-blue-400 to-blue-600';
    if (progress >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl text-white shadow-lg">
              {patient.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
              <p className="text-blue-600 font-medium">{patient.condition}</p>
              <p className="text-sm text-gray-600">Age: {patient.age} • Started: {patient.startDate}</p>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${getStatusColor(patient.status)}`}>
            {getStatusIcon(patient.status)}
            <span className="font-medium capitalize">{patient.status}</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{patient.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{patient.progress}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{patient.adherence}%</div>
            <div className="text-sm text-gray-600">Adherence</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{patient.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <Heart className={`h-6 w-6 mx-auto mb-2 ${getPainLevelColor(patient.painLevel)}`} />
            <div className={`text-2xl font-bold ${getPainLevelColor(patient.painLevel)}`}>{patient.painLevel}/10</div>
            <div className="text-sm text-gray-600">Pain Level</div>
          </div>
        </div>
      </div>

      {/* Session Information */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="font-medium text-gray-900">{patient.completedSessions}/{patient.totalSessions}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Session</p>
              <p className="font-medium text-gray-900">{patient.lastSession}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Session</p>
              <p className="font-medium text-gray-900">{patient.nextSession}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
        
        {/* Overall Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Recovery</span>
            <span className="text-sm font-bold text-gray-900">{patient.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressColor(patient.progress)} relative`}
              style={{ width: `${patient.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Exercise Completion */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Exercise Completion</span>
            <span className="text-sm font-bold text-gray-900">{patient.exerciseCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressColor(patient.exerciseCompletion)}`}
              style={{ width: `${patient.exerciseCompletion}%` }}
            />
          </div>
        </div>

        {/* Adherence Rate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Adherence Rate</span>
            <span className="text-sm font-bold text-gray-900">{patient.adherence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getProgressColor(patient.adherence)}`}
              style={{ width: `${patient.adherence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Notes</h3>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
          <p className="text-gray-700">{patient.notes}</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3 mt-4">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Session
          </button>
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            Assign Exercise
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientRecordCard;