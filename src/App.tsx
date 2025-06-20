import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleBasedRedirect from './routes/RoleBasedRedirect';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
            
            {/* Redirect routes */}
            <Route path="/" element={<RoleBasedRedirect />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;