import React from 'react';
import Navbar from '../components/dashboard/Navbar';
import { Bell, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      icon: Clock,
      title: 'Upcoming Appointment',
      message: 'You have an appointment with Dr. Afnan tomorrow at 10:00 AM',
      time: '2 hours ago',
      read: false,
      color: 'blue'
    },
    {
      id: 2,
      type: 'success',
      icon: CheckCircle,
      title: 'Exercise Completed',
      message: 'Great job! You completed all exercises for today',
      time: '4 hours ago',
      read: false,
      color: 'green'
    },
    {
      id: 3,
      type: 'reminder',
      icon: Bell,
      title: 'Medication Reminder',
      message: 'Time to take your prescribed medication',
      time: '6 hours ago',
      read: true,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'info',
      icon: Info,
      title: 'Treatment Plan Updated',
      message: 'Your physiotherapist has updated your treatment plan',
      time: '1 day ago',
      read: true,
      color: 'blue'
    },
    {
      id: 5,
      type: 'alert',
      icon: AlertCircle,
      title: 'Missed Session',
      message: 'You missed your scheduled session yesterday',
      time: '2 days ago',
      read: true,
      color: 'red'
    }
  ];

  const getColorClasses = (color, read) => {
    const baseClasses = {
      blue: read ? 'bg-blue-50 text-blue-600' : 'bg-blue-100 text-blue-700',
      green: read ? 'bg-green-50 text-green-600' : 'bg-green-100 text-green-700',
      yellow: read ? 'bg-yellow-50 text-yellow-600' : 'bg-yellow-100 text-yellow-700',
      red: read ? 'bg-red-50 text-red-600' : 'bg-red-100 text-red-700'
    };
    return baseClasses[color] || baseClasses.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your health journey</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                Mark all as read
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      getColorClasses(notification.color, notification.read)
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                          )}
                        </h3>
                        <span className="text-sm text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{notification.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {notifications.length === 0 && (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;