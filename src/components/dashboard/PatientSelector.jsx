import React, { useState } from 'react';
import { ChevronDown, Search, User } from 'lucide-react';

const PatientSelector = ({ onSelectPatient, selectedPatient = "All Patients" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const patients = [
    { id: 'all', name: 'All Patients', avatar: '👥', condition: 'Overview' },
    { id: 1, name: 'John Doe', avatar: '👤', condition: 'Knee Surgery Recovery' },
    { id: 2, name: 'Jane Smith', avatar: '👤', condition: 'Back Pain Treatment' },
    { id: 3, name: 'Mike Johnson', avatar: '👤', condition: 'Shoulder Rehabilitation' },
    { id: 4, name: 'Sarah Wilson', avatar: '👤', condition: 'Sports Injury Recovery' },
    { id: 5, name: 'Tom Brown', avatar: '👤', condition: 'Post-Surgery Therapy' }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (patient) => {
    onSelectPatient(patient);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm min-w-[200px]"
      >
        <User className="h-4 w-4 text-gray-500" />
        <span className="font-medium text-gray-700 flex-1 text-left">{selectedPatient}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-80 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelect(patient)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                      {patient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{patient.name}</div>
                      <div className="text-sm text-gray-500 truncate">{patient.condition}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientSelector;