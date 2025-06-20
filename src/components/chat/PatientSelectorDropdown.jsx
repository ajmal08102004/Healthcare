import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const PatientSelectorDropdown = ({ onSelectPatient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('Select Patient');
  
  const patients = [
    { id: 1, name: 'John Doe', condition: 'Knee Surgery Recovery' },
    { id: 2, name: 'Jane Smith', condition: 'Back Pain Treatment' },
    { id: 3, name: 'Mike Johnson', condition: 'Shoulder Rehabilitation' }
  ];

  const handleSelect = (patient) => {
    setSelectedPatient(patient.name);
    setIsOpen(false);
    onSelectPatient(patient);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-gray-700">{selectedPatient}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => handleSelect(patient)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                <div className="font-medium text-gray-900">{patient.name}</div>
                <div className="text-sm text-gray-500">{patient.condition}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSelectorDropdown;