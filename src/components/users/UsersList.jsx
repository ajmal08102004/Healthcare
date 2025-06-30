import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Mail, Phone, Calendar, UserCheck, UserX } from 'lucide-react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, userTypeFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (userTypeFilter) params.user_type = userTypeFilter;
      if (statusFilter) params.is_active = statusFilter === 'active';
      
      const response = await apiService.getUsers(params);
      setUsers(response.results || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case 'patient':
        return 'bg-blue-100 text-blue-800';
      case 'physiotherapist':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUserAction = async (userId, action) => {
    try {
      // Implement user actions like activate/deactivate, etc.
      console.log(`${action} user ${userId}`);
      // Refresh users list after action
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action} user:`, error);
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage patients, physiotherapists, and system users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* User Type Filter */}
            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All User Types</option>
              <option value="patient">Patients</option>
              <option value="physiotherapist">Physiotherapists</option>
              <option value="admin">Administrators</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setUserTypeFilter('');
                setStatusFilter('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* User Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.first_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user.username
                        }
                      </h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUserTypeColor(user.user_type)}`}>
                      {user.user_type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.is_active)}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  {user.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  
                  {user.phone_number && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{user.phone_number}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined {formatDate(user.date_joined)}</span>
                  </div>
                </div>

                {/* User Stats/Info */}
                {user.user_type === 'patient' && (
                  <div className="bg-blue-50 p-3 rounded mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Appointments:</span>
                        <span className="font-medium ml-1">{user.appointments_count || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Visit:</span>
                        <span className="font-medium ml-1">
                          {user.last_appointment ? formatDate(user.last_appointment) : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {user.user_type === 'physiotherapist' && (
                  <div className="bg-green-50 p-3 rounded mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Patients:</span>
                        <span className="font-medium ml-1">{user.patients_count || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Specialization:</span>
                        <span className="font-medium ml-1">{user.specialization || 'General'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Profile
                  </button>
                  
                  <div className="flex gap-2">
                    {currentUser?.user_type === 'admin' && user.id !== currentUser.id && (
                      <>
                        {user.is_active ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'deactivate')}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.user_type === 'patient').length}
              </div>
              <div className="text-sm text-gray-600">Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.user_type === 'physiotherapist').length}
              </div>
              <div className="text-sm text-gray-600">Physiotherapists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.user_type === 'admin').length}
              </div>
              <div className="text-sm text-gray-600">Administrators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {users.filter(u => u.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;