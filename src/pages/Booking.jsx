import React, { useState } from 'react';
import Navbar from '../components/dashboard/Navbar';
import { Search, Star, Clock, MapPin, Calendar } from 'lucide-react';

const Booking = () => {
  const [selectedPhysio, setSelectedPhysio] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const physiotherapists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Sports Rehabilitation',
      rating: 4.9,
      reviews: 127,
      location: 'Downtown Clinic',
      image: '👩‍⚕️',
      availableSlots: ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM']
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedic Therapy',
      rating: 4.8,
      reviews: 95,
      location: 'Medical Center',
      image: '👨‍⚕️',
      availableSlots: ['8:30 AM', '11:00 AM', '1:30 PM', '5:00 PM']
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Neurological Rehabilitation',
      rating: 4.9,
      reviews: 156,
      location: 'Rehab Institute',
      image: '👩‍⚕️',
      availableSlots: ['10:00 AM', '12:30 PM', '3:00 PM', '6:00 PM']
    }
  ];

  const handleBooking = () => {
    if (selectedPhysio && selectedDate && selectedTime) {
      alert(`Booking confirmed with ${selectedPhysio.name} on ${selectedDate} at ${selectedTime}`);
    } else {
      alert('Please select a physiotherapist, date, and time slot');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Find and book with qualified physiotherapists</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for physiotherapists by name or specialty..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Physiotherapist List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Available Physiotherapists</h2>
            
            {physiotherapists.map((physio) => (
              <div
                key={physio.id}
                className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer transition-all ${
                  selectedPhysio?.id === physio.id
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
                onClick={() => setSelectedPhysio(physio)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                    {physio.image}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{physio.name}</h3>
                    <p className="text-blue-600 text-sm mb-2">{physio.specialty}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{physio.rating}</span>
                        <span>({physio.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{physio.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {physio.availableSlots.slice(0, 3).map((slot) => (
                        <span
                          key={slot}
                          className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                        >
                          {slot}
                        </span>
                      ))}
                      {physio.availableSlots.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{physio.availableSlots.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Book Appointment</h2>
            
            {selectedPhysio ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl">
                    {selectedPhysio.image}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedPhysio.name}</h3>
                    <p className="text-sm text-blue-600">{selectedPhysio.specialty}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPhysio.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === slot
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific concerns or requests..."
                  />
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a physiotherapist to book an appointment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;