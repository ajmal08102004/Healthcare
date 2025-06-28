import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Clock, TrendingUp, AlertCircle, CheckCircle, Filter, X } from 'lucide-react';

const PatientSearchBar = ({ onSelectPatient, selectedPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [surgeryFilter, setSurgeryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Enhanced patient database with surgery types
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
      isOverview: true,
      surgeryType: null
    },
    {
      id: 1,
      name: 'John Doe',
      avatar: '👤',
      condition: 'Knee Surgery Recovery',
      surgeryType: 'knee',
      surgeryDate: '2023-11-15',
      surgeon: 'Dr. Michael Roberts',
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
      notes: 'Excellent progress, very motivated patient',
      medicalHistory: 'Previous ACL injury in 2018, no complications',
      currentMedications: 'Ibuprofen 400mg twice daily',
      allergies: 'None known'
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: '👤',
      condition: 'Spinal Surgery Recovery',
      surgeryType: 'spine',
      surgeryDate: '2023-12-10',
      surgeon: 'Dr. Sarah Chen',
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
      notes: 'Missed last 2 sessions, needs follow-up',
      medicalHistory: 'Chronic lower back pain for 5 years',
      currentMedications: 'Gabapentin 300mg, Tramadol as needed',
      allergies: 'Penicillin'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      avatar: '👤',
      condition: 'Shoulder Surgery Recovery',
      surgeryType: 'shoulder',
      surgeryDate: '2023-11-20',
      surgeon: 'Dr. James Wilson',
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
      notes: 'Outstanding recovery, ahead of schedule',
      medicalHistory: 'Rotator cuff tear from sports injury',
      currentMedications: 'None',
      allergies: 'None known'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      avatar: '👤',
      condition: 'Hip Surgery Recovery',
      surgeryType: 'hip',
      surgeryDate: '2023-12-05',
      surgeon: 'Dr. Emily Rodriguez',
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
      notes: 'Good progress, needs consistency improvement',
      medicalHistory: 'Hip dysplasia since childhood',
      currentMedications: 'Naproxen 500mg twice daily',
      allergies: 'Latex'
    },
    {
      id: 5,
      name: 'Tom Brown',
      avatar: '👤',
      condition: 'Knee Surgery Recovery',
      surgeryType: 'knee',
      surgeryDate: '2023-12-20',
      surgeon: 'Dr. Michael Roberts',
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
      notes: 'Recent start, building routine',
      medicalHistory: 'Meniscus tear, previous knee issues',
      currentMedications: 'Acetaminophen 1000mg as needed',
      allergies: 'Aspirin'
    },
    {
      id: 6,
      name: 'Lisa Davis',
      avatar: '👤',
      condition: 'Ankle Surgery Recovery',
      surgeryType: 'ankle',
      surgeryDate: '2023-11-30',
      surgeon: 'Dr. Robert Kim',
      status: 'excellent',
      lastSession: '2024-01-15',
      nextSession: '2024-01-18',
      progress: 88,
      adherence: 90,
      totalSessions: 12,
      completedSessions: 11,
      painLevel: 2,
      exerciseCompletion: 88,
      streak: 8,
      phone: '+1 (555) 567-8901',
      email: 'lisa.davis@email.com',
      age: 35,
      startDate: '2023-12-05',
      notes: 'Excellent compliance, very dedicated',
      medicalHistory: 'Fracture from running accident',
      currentMedications: 'None',
      allergies: 'None known'
    }
  ];

  const surgeryTypes = [
    { value: 'all', label: 'All Surgery Types' },
    { value: 'knee', label: 'Knee Surgery' },
    { value: 'shoulder', label: 'Shoulder Surgery' },
    { value: 'spine', label: 'Spinal Surgery' },
    { value: 'hip', label: 'Hip Surgery' },
    { value: 'ankle', label: 'Ankle Surgery' }
  ];

  useEffect(() => {
    let filtered = patients;

    // Filter by surgery type
    if (surgeryFilter !== 'all') {
      filtered = filtered.filter(patient => 
        patient.isOverview || patient.surgeryType === surgeryFilter
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPatients(filtered);
  }, [searchTerm, surgeryFilter]);

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

  const clearFilters = () => {
    setSurgeryFilter('all');
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

  const getSurgeryTypeColor = (surgeryType) => {
    const colors = {
      knee: 'bg-blue-50 text-blue-700',
      shoulder: 'bg-purple-50 text-purple-700',
      spine: 'bg-red-50 text-red-700',
      hip: 'bg-green-50 text-green-700',
      ankle: 'bg-orange-50 text-orange-700'
    };
    return colors[surgeryType] || 'bg-gray-50 text-gray-700';
  };

  const activeFiltersCount = (surgeryFilter !== 'all' ? 1 : 0);

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2 mb-2">
        <div ref={searchRef} className="relative flex-1">
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
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm relative ${
            activeFiltersCount > 0 ? 'ring-2 ring-blue-200 border-blue-300' : ''
          }`}
        >
          <Filter className="h-5 w-5 text-gray-600" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Type</label>
            <select
              value={surgeryFilter}
              onChange={(e) => setSurgeryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {surgeryTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

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
                        <div className="flex items-center gap-1">
                          {!patient.isOverview && patient.surgeryType && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSurgeryTypeColor(patient.surgeryType)}`}>
                              {patient.surgeryType}
                            </span>
                          )}
                          {!patient.isOverview && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(patient.status)}`}>
                              {getStatusIcon(patient.status)}
                              {patient.status}
                            </span>
                          )}
                        </div>
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
                <p>No patients found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearchBar;