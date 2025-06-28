import React, { useState } from 'react';
import Navbar from '../components/dashboard/Navbar';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PhysioBookings = () => {
  const [activeTab, setActiveTab] = useState('requests');
  
  const appointmentRequests = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-01-15',
      time: '10:00 AM',
      condition: 'Knee rehabilitation',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      notes: 'Follow-up appointment for knee surgery recovery',
      status: 'pending'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-01-15',
      time: '2:30 PM',
      condition: 'Back pain treatment',
      phone: '+1 (555) 987-6543',
      email: 'jane.smith@email.com',
      notes: 'Chronic lower back pain, needs assessment',
      status: 'pending'
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      date: '2024-01-16',
      time: '9:00 AM',
      condition: 'Shoulder therapy',
      phone: '+1 (555) 456-7890',
      email: 'mike.johnson@email.com',
      notes: 'Post-surgical shoulder rehabilitation',
      status: 'confirmed'
    }
  ];

  const patientHistory = [
    {
      id: 1,
      patientName: 'John Doe',
      lastVisit: '2024-01-10',
      totalSessions: 12,
      condition: 'Knee rehabilitation',
      progress: 85,
      nextAppointment: '2024-01-15'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      lastVisit: '2024-01-08',
      totalSessions: 8,
      condition: 'Back pain treatment',
      progress: 65,
      nextAppointment: '2024-01-15'
    },
    {
      id: 3,
      patientName: 'Mike Johnson',
      lastVisit: '2024-01-12',
      totalSessions: 15,
      condition: 'Shoulder therapy',
      progress: 90,
      nextAppointment: '2024-01-16'
    }
  ];

  const handleApprove = (requestId) => {
    alert(`Appointment request ${requestId} approved`);
  };

  const handleReject = (requestId) => {
    alert(`Appointment request ${requestId} rejected`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">Manage appointments and patient bookings</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-1 rounded-lg border border-gray-200 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Appointment Requests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Patient History
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Queries
          </button>
        </div>

        {/* Appointment Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending Appointment Requests</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {appointmentRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                          <p className="text-sm text-gray-600">{request.condition}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {request.status}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{request.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{request.time}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{request.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{request.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      {request.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {request.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patient History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Patient Treatment History</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {patientHistory.map((patient) => (
                <div key={patient.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.patientName}</h3>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="text-lg font-semibold text-green-600">{patient.progress}%</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Total Sessions</div>
                      <div className="font-semibold text-gray-900">{patient.totalSessions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Last Visit</div>
                      <div className="font-semibold text-gray-900">{patient.lastVisit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Next Appointment</div>
                      <div className="font-semibold text-gray-900">{patient.nextAppointment}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${patient.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Patient Queries</h2>
            </div>
            
            <div className="p-6">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Queries Yet</h3>
                <p className="text-gray-600">Patient queries will appear here once you start receiving feedback.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysioBookings;