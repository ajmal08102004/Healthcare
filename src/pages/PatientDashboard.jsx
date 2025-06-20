import React from 'react';
import Navbar from '../components/dashboard/Navbar';
import StatCard from '../components/dashboard/StatCard';
import ExerciseProgress from '../components/dashboard/ExerciseProgress';
import RecoveryProgressChart from '../components/charts/RecoveryProgressChart';
import TreatmentPlanPieChart from '../components/charts/TreatmentPlanPieChart';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import RecentMessages from '../components/dashboard/RecentMessages';
import AIInsightsPlaceholder from '../components/dashboard/AIInsightsPlaceholder';

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Dashboard</h1>
          <p className="text-gray-600">Track your recovery and manage your health journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Sessions Completed"
            value="40"
            icon="📅"
            subtitle="This month"
            trend={12}
          />
          <StatCard
            title="Daily Streak"
            value="74"
            icon="🔥"
            subtitle="Days in a row"
            trend={8}
          />
          <StatCard
            title="Next Session"
            value="Tomorrow"
            icon="⏰"
            subtitle="10:00 AM with Dr. Afnan"
          />
          <StatCard
            title="Adherence Rate"
            value="70%"
            icon="📈"
            subtitle="This week"
            trend={5}
          />
        </div>

        {/* Charts and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExerciseProgress />
          <RecoveryProgressChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TreatmentPlanPieChart />
          <UpcomingSessions />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentMessages />
          <AIInsightsPlaceholder />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;