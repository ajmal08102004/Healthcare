import React, { useState } from 'react';
import Navbar from '../components/dashboard/Navbar';
import StatCard from '../components/dashboard/StatCard';
import PatientSelector from '../components/dashboard/PatientSelector';
import RadialProgressChart from '../components/charts/RadialProgressChart';
import StreakTracker from '../components/dashboard/StreakTracker';
import AdherenceRate from '../components/dashboard/AdherenceRate';
import NextMeeting from '../components/dashboard/NextMeeting';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import EnhancedRecentMessages from '../components/dashboard/EnhancedRecentMessages';
import AIInsights from '../components/dashboard/AIInsights';
import RecoveryTrendsChart from '../components/charts/RecoveryTrendsChart';
import TreatmentPlanPieChart from '../components/charts/TreatmentPlanPieChart';

const PhysioDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState({ name: 'All Patients', id: 'all' });

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  // Mock data that changes based on selected patient
  const getPatientData = () => {
    if (selectedPatient.id === 'all') {
      return {
        activePatients: 12,
        sessionsToday: 8,
        nextAppointment: 'John Doe - 2:00 PM',
        treatmentGoals: 15,
        exerciseCompletion: 78,
        streak: 6,
        adherenceRate: 82
      };
    } else {
      return {
        activePatients: 1,
        sessionsToday: 2,
        nextAppointment: 'Tomorrow - 10:00 AM',
        treatmentGoals: 3,
        exerciseCompletion: selectedPatient.name === 'John Doe' ? 85 : 
                          selectedPatient.name === 'Jane Smith' ? 72 : 90,
        streak: selectedPatient.name === 'John Doe' ? 7 : 
               selectedPatient.name === 'Jane Smith' ? 4 : 9,
        adherenceRate: selectedPatient.name === 'John Doe' ? 88 : 
                      selectedPatient.name === 'Jane Smith' ? 75 : 92
      };
    }
  };

  const patientData = getPatientData();

  const physioInsights = [
    {
      type: 'alert',
      icon: '⚠️',
      title: 'Patient Attention Needed',
      message: `${selectedPatient.name === 'All Patients' ? 'Jane Smith' : selectedPatient.name} has missed 2 consecutive sessions. Consider reaching out.`,
      color: 'yellow'
    },
    {
      type: 'positive',
      icon: '🎉',
      title: 'Treatment Success',
      message: `${selectedPatient.name === 'All Patients' ? 'John Doe' : selectedPatient.name} has achieved 90% of recovery goals ahead of schedule.`,
      color: 'green'
    },
    {
      type: 'suggestion',
      icon: '📊',
      title: 'Data Insight',
      message: 'Patients show 15% better adherence when exercises are scheduled in the morning.',
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Physiotherapist Dashboard</h1>
            <p className="text-gray-600">Monitor patient progress and manage treatments</p>
          </div>
          
          <PatientSelector 
            onSelectPatient={handlePatientSelect}
            selectedPatient={selectedPatient.name}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Patients"
            value={patientData.activePatients.toString()}
            icon="👥"
            subtitle="Currently treating"
          />
          <StatCard
            title="Sessions Today"
            value={patientData.sessionsToday.toString()}
            icon="📅"
            subtitle="Completed sessions"
          />
          <StatCard
            title="Next Appointment"
            value={patientData.nextAppointment}
            icon="⏰"
            subtitle=""
          />
          <StatCard
            title="Treatment Goals"
            value={patientData.treatmentGoals.toString()}
            icon="🎯"
            subtitle="Goals achieved"
          />
        </div>

        {/* Patient-Specific Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RadialProgressChart 
            percentage={patientData.exerciseCompletion} 
            title="Exercise Completion" 
            subtitle={selectedPatient.name === 'All Patients' ? 'Average across all patients' : `${selectedPatient.name}'s progress`}
          />
          <StreakTracker 
            streakDays={7} 
            currentStreak={patientData.streak} 
          />
          <AdherenceRate 
            rate={patientData.adherenceRate} 
            trend={5} 
          />
        </div>

        {/* Session Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NextMeeting 
            doctorName="You"
            date="Today"
            time="2:00 PM"
            canJoin={true}
          />
          <UpcomingSessions />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RecoveryTrendsChart selectedPatient={selectedPatient.name} />
          <TreatmentPlanPieChart />
        </div>

        {/* Communication & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedRecentMessages 
            isPhysio={true} 
            selectedPatient={selectedPatient.name} 
          />
          <AIInsights 
            insights={physioInsights} 
            isPatient={false} 
          />
        </div>
      </div>
    </div>
  );
};

export default PhysioDashboard;