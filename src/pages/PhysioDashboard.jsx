import React, { useState } from 'react';
import Navbar from '../components/dashboard/Navbar';
import StatCard from '../components/dashboard/StatCard';
import ExerciseProgress from '../components/dashboard/ExerciseProgress';
import RecoveryProgressChart from '../components/charts/RecoveryProgressChart';
import TreatmentPlanPieChart from '../components/charts/TreatmentPlanPieChart';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import RecentMessages from '../components/dashboard/RecentMessages';
import AIInsightsPlaceholder from '../components/dashboard/AIInsightsPlaceholder';
import { ChevronDown } from 'lucide-react';

const PhysioDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState('All Patients');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const patients = ['All Patients', 'John Doe', 'Jane Smith', 'Mike Johnson'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Physiotherapist Dashboard</h1>
            <p className="text-gray-600">Monitor patient progress and manage treatments</p>
          </div>
          
          <div className="relative mt-4 sm:mt-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>{selectedPatient}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {patients.map((patient) => (
                  <button
                    key={patient}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {patient}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Patients"
            value="3"
            icon="👥"
            subtitle="Currently treating"
          />
          <StatCard
            title="Sessions Today"
            value="80"
            icon="📅"
            subtitle="Completed sessions"
          />
          <StatCard
            title="Next Appointment"
            value="No Upcoming event"
            icon="⏰"
            subtitle=""
          />
          <StatCard
            title="Treatment Plan Goals"
            value="7"
            icon="🎯"
            subtitle="Goals achieved"
          />
        </div>

        {/* Patient Selection Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recovery Progress</h3>
          <div className="space-y-2">
            {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, index) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{name}</span>
                    <button className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors">
                      ACTIVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecoveryProgressChart />
          <TreatmentPlanPieChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UpcomingSessions />
          <RecentMessages />
        </div>

        <div className="grid grid-cols-1">
          <AIInsightsPlaceholder />
        </div>
      </div>
    </div>
  );
};

export default PhysioDashboard;