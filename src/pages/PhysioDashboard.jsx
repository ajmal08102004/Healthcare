import React, { useState } from 'react';
import { AlertCircle, PartyPopper, BarChart3, Users, Calendar, Clock, Target } from 'lucide-react';
import Navbar from '../components/dashboard/Navbar';
import StatCard from '../components/dashboard/StatCard';
import PatientSearchBar from '../components/dashboard/PatientSearchBar';
import PatientRecordCard from '../components/dashboard/PatientRecordCard';
import RadialProgressChart from '../components/charts/RadialProgressChart';
import StreakTracker from '../components/dashboard/StreakTracker';
import AdherenceRate from '../components/dashboard/AdherenceRate';
import NextMeeting from '../components/dashboard/NextMeeting';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import EnhancedRecentMessages from '../components/dashboard/EnhancedRecentMessages';
import AIInsights from '../components/dashboard/AIInsights';
import RecoveryTrendsChart from '../components/charts/RecoveryTrendsChart';
import TreatmentPlanPieChart from '../components/charts/TreatmentPlanPieChart';
import ExerciseManager from '../components/exercises/ExerciseManager';

const PhysioDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState({ 
    name: 'All Patients', 
    id: 'all',
    isOverview: true 
  });

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  // Mock data that changes based on selected patient
  const getPatientData = () => {
    if (selectedPatient.id === 'all' || selectedPatient.isOverview) {
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
        sessionsToday: selectedPatient.completedSessions || 2,
        nextAppointment: selectedPatient.nextSession || 'Tomorrow - 10:00 AM',
        treatmentGoals: selectedPatient.totalSessions || 3,
        exerciseCompletion: selectedPatient.exerciseCompletion || 85,
        streak: selectedPatient.streak || 7,
        adherenceRate: selectedPatient.adherence || 88
      };
    }
  };

  const patientData = getPatientData();

  const getPatientSpecificInsights = () => {
    if (selectedPatient.isOverview || selectedPatient.id === 'all') {
      return [
        {
          type: 'alert',
          icon: AlertCircle,
          title: 'Patient Attention Needed',
          message: 'Jane Smith has missed 2 consecutive sessions. Consider reaching out.',
          color: 'yellow'
        },
        {
          type: 'positive',
          icon: PartyPopper,
          title: 'Treatment Success',
          message: 'John Doe has achieved 90% of recovery goals ahead of schedule.',
          color: 'green'
        },
        {
          type: 'suggestion',
          icon: BarChart3,
          title: 'Data Insight',
          message: 'Patients show 15% better adherence when exercises are scheduled in the morning.',
          color: 'blue'
        }
      ];
    } else {
      const insights = [];
      
      // Generate patient-specific insights
      if (selectedPatient.status === 'attention') {
        insights.push({
          type: 'alert',
          icon: AlertCircle,
          title: 'Attention Required',
          message: `${selectedPatient.name} has missed recent sessions and needs follow-up.`,
          color: 'yellow'
        });
      }
      
      if (selectedPatient.progress >= 85) {
        insights.push({
          type: 'positive',
          icon: PartyPopper,
          title: 'Excellent Progress',
          message: `${selectedPatient.name} is showing outstanding recovery progress at ${selectedPatient.progress}%.`,
          color: 'green'
        });
      }
      
      if (selectedPatient.adherence < 80) {
        insights.push({
          type: 'suggestion',
          icon: BarChart3,
          title: 'Adherence Improvement',
          message: `Consider adjusting exercise schedule for ${selectedPatient.name} to improve adherence rate.`,
          color: 'blue'
        });
      } else {
        insights.push({
          type: 'positive',
          icon: BarChart3,
          title: 'Good Adherence',
          message: `${selectedPatient.name} maintains excellent adherence at ${selectedPatient.adherence}%.`,
          color: 'green'
        });
      }
      
      return insights;
    }
  };

  const physioInsights = getPatientSpecificInsights();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Physiotherapist Dashboard</h1>
            <p className="text-gray-600">
              {selectedPatient.isOverview 
                ? 'Monitor patient progress and manage treatments' 
                : `Managing ${selectedPatient.name} - ${selectedPatient.condition}`
              }
            </p>
          </div>
          
          <PatientSearchBar 
            onSelectPatient={handlePatientSelect}
            selectedPatient={selectedPatient}
          />
        </div>

        {/* Patient Record Card - Show when specific patient is selected */}
        {!selectedPatient.isOverview && selectedPatient.id !== 'all' && (
          <div className="mb-8">
            <PatientRecordCard patient={selectedPatient} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={selectedPatient.isOverview ? "Active Patients" : "Patient Status"}
            value={selectedPatient.isOverview ? patientData.activePatients.toString() : selectedPatient.status}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            subtitle={selectedPatient.isOverview ? "Currently treating" : "Current condition"}
          />
          <StatCard
            title={selectedPatient.isOverview ? "Sessions Today" : "Completed Sessions"}
            value={patientData.sessionsToday.toString()}
            icon={<Calendar className="h-6 w-6 text-green-600" />}
            subtitle={selectedPatient.isOverview ? "Completed sessions" : `of ${selectedPatient.totalSessions || 'N/A'} total`}
          />
          <StatCard
            title="Next Appointment"
            value={selectedPatient.isOverview ? patientData.nextAppointment : selectedPatient.nextSession || 'Not scheduled'}
            icon={<Clock className="h-6 w-6 text-orange-600" />}
            subtitle=""
          />
          <StatCard
            title={selectedPatient.isOverview ? "Treatment Goals" : "Pain Level"}
            value={selectedPatient.isOverview ? patientData.treatmentGoals.toString() : `${selectedPatient.painLevel || 'N/A'}/10`}
            icon={<Target className="h-6 w-6 text-purple-600" />}
            subtitle={selectedPatient.isOverview ? "Goals achieved" : "Current pain level"}
          />
        </div>

        {/* Patient-Specific Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RadialProgressChart 
            percentage={patientData.exerciseCompletion} 
            title="Exercise Completion" 
            subtitle={selectedPatient.isOverview ? 'Average across all patients' : `${selectedPatient.name}'s progress`}
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

        {/* Exercise Manager Section */}
        <div className="mb-8">
          <ExerciseManager selectedPatient={selectedPatient.name} />
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