import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const PatientSearchBar = ({ onSelectPatient, selectedPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Mock patient database with comprehensive information
  const patients = [
    {
      id: 'all',
      name: 'All Patients',
      avatar: '👥',
      condition: 'Overview',
      status: 'active',
      lastSession: null,
      progress: null,
      adherence: null,
      isOverview: true
    },
    {
      id: 1,
      name: 'John Doe',
      avatar: '👤',
      condition: 'Knee Surgery Recovery',
      status: 'active',
      lastSession: '2024-01-14',
      nextSession: '2024-01-16',
      progress: 85,
      adherence: 88,
      totalSessions: 12,
      completedSessions: 10,
      painLevel: 3,
      exerciseCompletion: 85,
      streak: 7,
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com',
      age: 45,
      startDate: '2023-12-01',
      notes: 'Excellent progress, very motivated patient'
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: '👤',
      condition: 'Back Pain Treatment',
      status: 'attention',
      lastSession: '2024-01-12',
      nextSession: '2024-01-17',
      progress: 72,
      adherence: 75,
      totalSessions: 8,
      completedSessions: 6,
      painLevel: 5,
      exerciseCompletion: 72,
      streak: 4,
      phone: '+1 (555) 987-6543',
      email: 'jane.smith@email.com',
      age: 38,
      startDate: '2023-12-15',
      notes: 'Missed last 2 sessions, needs follow-up'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: '👤',
      condition: 'Shoulder Rehabilitation',
      status: 'excellent',
      lastSession: '2024-01-15',
      nextSession: '2024-01-18',
      progress: 90,
      adherence: 92,
      totalSessions: 15,
      completedSessions: 14,
      painLevel: 2,
      exerciseCompletion: 90,
      streak: 9,
      phone: '+1 (555) 456-7890',
      email: 'mike.johnson@email.com',
      age: 32,
      startDate: '2023-11-20',
      notes: 'Outstanding recovery, ahead of schedule'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      avatar: '👤',
      condition: 'Sports Injury Recovery',
      status: 'active',
      lastSession: '2024-01-13',
      nextSession: '2024-01-16',
      progress: 78,
      adherence: 82,
      totalSessions: 10,
      completedSessions: 8,
      painLevel: 4,
      exerciseCompletion: 78,
      streak: 5,
      phone: '+1 (555) 234-5678',
      email: 'sarah.wilson@email.com',
      age: 28,
      startDate: '2023-12-10',
      notes: 'Good progress, needs consistency improvement'
    },
    {
      id: 5,
      name: 'Tom Brown',
      avatar: '👤',
      condition: 'Post-Surgery Therapy',
      status: 'active',
      lastSession: '2024-01-14',
      nextSession: '2024-01-17',
      progress: 68,
      adherence: 79,
      totalSessions: 6,
      completedSessions: 4,
      painLevel: 6,
      exerciseCompletion: 68,
      streak: 3,
      phone: '+1 (555) 345-6789',
      email: 'tom.brown@email.com',
      age: 52,
      startDate: '2024-01-01',
      notes: 'Recent start, building routine'
    }
  ];

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (patient) => {
    onSelectPatient(patient);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'attention': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-3 w-3" />;
      case 'attention': return <AlertCircle className="h-3 w-3" />;
      default: return <TrendingUp className="h-3 w-3" />;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div ref={searchRef} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients by name or condition..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelect(patient)}
                  className={`w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-b-0 ${
                    selectedPatient?.id === patient.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                      {patient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 truncate">{patient.name}</h4>
                        {!patient.isOverview && (
                          <div className="flex items-center gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(patient.status)}`}>
                              {getStatusIcon(patient.status)}
                              {patient.status}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{patient.condition}</p>
                      {!patient.isOverview && (
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last: {patient.lastSession}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {patient.progress}% progress
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No patients found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearchBar;