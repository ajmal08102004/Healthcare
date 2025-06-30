import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleBasedRedirect from './routes/RoleBasedRedirect';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PersonalInformation from './pages/PersonalInformation';

// Dashboard Pages
import PatientDashboard from './pages/PatientDashboard';
import PhysioDashboard from './pages/PhysioDashboard';

// Chat Pages
import PatientChat from './pages/PatientChat';
import PhysioChat from './pages/PhysioChat';

// Booking Pages
import Booking from './pages/Booking';
import PhysioBookings from './pages/PhysioBookings';

// Other Pages
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Appointments from './pages/Appointments';
import Exercises from './pages/Exercises';
import Users from './pages/Users';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading Healthcare App...</p>
    </div>
  </div>
);

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/personal-info" element={<PersonalInformation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route path="/patient-dashboard" element={
              <PrivateRoute>
                <PatientDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/physio-dashboard" element={
              <PrivateRoute>
                <PhysioDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/patient-chat" element={
              <PrivateRoute>
                <PatientChat />
              </PrivateRoute>
            } />
            
            <Route path="/physio-chat" element={
              <PrivateRoute>
                <PhysioChat />
              </PrivateRoute>
            } />
            
            <Route path="/booking" element={
              <PrivateRoute>
                <Booking />
              </PrivateRoute>
            } />
            
            <Route path="/physio-bookings" element={
              <PrivateRoute>
                <PhysioBookings />
              </PrivateRoute>
            } />
            
            <Route path="/notifications" element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            <Route path="/appointments" element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            } />

            <Route path="/exercises" element={
              <PrivateRoute>
                <Exercises />
              </PrivateRoute>
            } />

            <Route path="/users" element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            } />
            
            {/* Redirect routes */}
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;