import React from 'react';
import { CheckCircle, Lightbulb, Calendar, Flame, Clock, Smile } from 'lucide-react';
import Navbar from '../components/dashboard/Navbar';
import StatCard from '../components/dashboard/StatCard';
import RadialProgressChart from '../components/charts/RadialProgressChart';
import StreakTracker from '../components/dashboard/StreakTracker';
import AdherenceRate from '../components/dashboard/AdherenceRate';
import NextMeeting from '../components/dashboard/NextMeeting';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import EnhancedRecentMessages from '../components/dashboard/EnhancedRecentMessages';
import AIInsights from '../components/dashboard/AIInsights';
import RecoveryTrendsChart from '../components/charts/RecoveryTrendsChart';
import PatientExerciseView from '../components/exercises/PatientExerciseView';

const PatientDashboard = () => {
  const patientInsights = [
    {
      type: 'positive',
      icon: CheckCircle,
      title: 'Excellent Progress!',
      message: 'Your exercise consistency has improved by 23% this week. Keep up the great work!',
      color: 'green'
    },
    {
      type: 'suggestion',
      icon: Lightbulb,
      title: 'Optimization Tip',
      message: 'Consider doing your stretching exercises in the morning for better flexibility gains.',
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
          <p className="text-gray-600">Track your recovery and manage your health journey</p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Sessions Completed"
            value="40"
            icon={<Calendar className="h-6 w-6 text-blue-600" />}
            subtitle="This month"
            trend={12}
          />
          <StatCard
            title="Daily Streak"
            value="74"
            icon={<Flame className="h-6 w-6 text-orange-500" />}
            subtitle="Days in a row"
            trend={8}
          />
          <StatCard
            title="Next Session"
            value="Tomorrow"
            icon={<Clock className="h-6 w-6 text-green-600" />}
            subtitle="10:00 AM with Dr. Afnan"
          />
          <StatCard
            title="Pain Level"
            value="2/10"
            icon={<Smile className="h-6 w-6 text-green-600" />}
            subtitle="Much improved"
            trend={-40}
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RadialProgressChart 
            percentage={74} 
            title="Exercise Completion" 
            subtitle="Great progress this week!"
          />
          <StreakTracker streakDays={7} currentStreak={5} />
          <AdherenceRate rate={85} trend={5} />
        </div>

        {/* Exercise Manager Section - Full Width */}
        <div className="mb-8">
          <PatientExerciseView />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NextMeeting 
            doctorName="Dr. Sarah Johnson"
            date="Tomorrow"
            time="10:00 AM"
            canJoin={false}
          />
          <UpcomingSessions />
        </div>

        {/* Recovery Trends - Full Width */}
        <div className="mb-8">
          <RecoveryTrendsChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedRecentMessages isPhysio={false} />
          <AIInsights insights={patientInsights} isPatient={true} />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;