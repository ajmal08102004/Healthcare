import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Plus, Filter, Search } from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [physiotherapists, setPhysiotherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchAppointments();
    if (user?.user_type === 'patient') {
      fetchPhysiotherapists();
    }
  }, [filter, searchTerm]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      
      let response;
      if (filter === 'upcoming') {
        response = await apiService.getUpcomingAppointments();
      } else if (filter === 'past') {
        response = await apiService.getPastAppointments();
      } else {
        response = await apiService.getAppointments(params);
      }
      
      setAppointments(response.results || response || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhysiotherapists = async () => {
    try {
      const response = await apiService.getPhysiotherapists();
      setPhysiotherapists(response.results || []);
    } catch (error) {
      console.error('Error fetching physiotherapists:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointments</h1>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Appointments</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>

              {/* Add Appointment Button */}
              {user?.user_type === 'patient' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-900">
                      {formatDate(appointment.date)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center mb-3">
                  <Clock className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    {formatTime(appointment.time)}
                  </span>
                </div>

                {/* Participants */}
                <div className="space-y-2 mb-4">
                  {user?.user_type === 'patient' ? (
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        Dr. {appointment.physiotherapist_name || 'TBD'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">
                        {appointment.patient_name || 'Patient'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Location */}
                {appointment.location && (
                  <div className="flex items-center mb-4">
                    <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 text-sm">
                      {appointment.location}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {appointment.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {appointment.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </button>
                  
                  {appointment.status === 'scheduled' && (
                    <div className="flex gap-2">
                      <button className="text-sm text-gray-600 hover:text-gray-800">
                        Reschedule
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {appointments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'upcoming' 
                ? "You don't have any upcoming appointments." 
                : filter === 'past'
                ? "No past appointments to display."
                : "You haven't scheduled any appointments yet."}
            </p>
            {user?.user_type === 'patient' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Book Your First Appointment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;