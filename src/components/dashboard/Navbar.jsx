import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Calendar, 
  Bell, 
  User, 
  LogOut,
  Activity,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  const isPatient = user?.role === 'patient';
  
  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: isPatient ? '/patient-dashboard' : '/physio-dashboard'
    },
    {
      name: 'Chat',
      icon: MessageCircle,
      path: isPatient ? '/patient-chat' : '/physio-chat'
    },
    {
      name: 'Booking',
      icon: Calendar,
      path: isPatient ? '/booking' : '/physio-bookings'
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: '#',
      onClick: (e) => {
        e.preventDefault();
        // Handle notifications - could open a modal or dropdown
        alert('Notifications feature coming soon!');
      }
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">HealthCare</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={item.onClick}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;