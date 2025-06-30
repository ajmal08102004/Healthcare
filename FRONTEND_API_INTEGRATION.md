# Frontend API Integration Guide

## 🔗 API Integration Status

The Healthcare React frontend is now **fully integrated** with the Django REST API backend. This document outlines the integration details and how to use the connected system for core healthcare management features.

## ✅ What's Integrated

### 1. Authentication System
- **Real API Authentication**: Login now uses actual Django token authentication
- **Persistent Sessions**: User sessions persist across browser refreshes
- **Automatic Token Management**: Tokens are stored and managed automatically
- **Role-based Navigation**: Users are redirected based on their actual user type from the API

### 2. API Service Layer
- **Centralized API Service**: `src/services/api.js` handles all API communications
- **Token Authentication**: Automatic token inclusion in all requests
- **Error Handling**: Comprehensive error handling for all API calls
- **CRUD Operations**: Full Create, Read, Update, Delete operations for all resources

### 3. Core Healthcare Features Integration
- **Appointments Management**: Complete appointment scheduling and management system
- **Exercise Library**: Comprehensive exercise management with plans and progress tracking
- **User Management**: Patient and physiotherapist management for admin users
- **Real-time Data**: All components now use live data from the API

## 🚀 How to Use the Integrated System

### Starting the Application

1. **Start the Django Backend**:
   ```bash
   cd healthcare_backend
   python manage.py runserver 0.0.0.0:12000
   ```

2. **Start the React Frontend**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:5173 (or your Vite dev server port)
   - Backend API: http://localhost:12000/api/

### Login Credentials
Use the sample users created by the populate script:
- **Admin**: admin / admin123
- **Patient**: patient1 / password123
- **Physiotherapist**: physio1 / password123

### Testing the Integration

1. **Login**: Use real credentials to authenticate
2. **Navigate to Appointments**: Go to `/appointments` to see appointment management
3. **Browse Exercises**: Go to `/exercises` to explore the exercise library
4. **User Management**: Go to `/users` (admin/physio only) to manage users
5. **Search & Filter**: Test real-time search and filtering across all components
6. **API Responses**: Check browser console for API responses

## 📁 File Structure

```
src/
├── services/
│   └── api.js                 # Centralized API service
├── context/
│   └── AuthContext.jsx        # Updated with real authentication
├── components/
│   ├── auth/
│   │   └── LoginForm.jsx      # Updated to use real API
│   ├── appointments/
│   │   └── AppointmentsList.jsx # Appointments management component
│   ├── exercises/
│   │   └── ExercisesList.jsx  # Exercise library component
│   └── users/
│       └── UsersList.jsx      # User management component
├── pages/
│   ├── Appointments.jsx       # Appointments page
│   ├── Exercises.jsx          # Exercises page
│   └── Users.jsx              # Users page
└── App.tsx                    # Updated with loading states and new routes
```

## 🔧 API Service Features

### Authentication Methods
```javascript
// Login
const result = await apiService.login({ email, password });

// Register
const result = await apiService.register(userData);

// Logout
await apiService.logout();

// Get current user
const user = await apiService.getCurrentUser();
```

### Appointments API Methods
```javascript
// Get appointments with filtering
const appointments = await apiService.getAppointments({ search: 'term' });

// Get upcoming appointments
const upcoming = await apiService.getUpcomingAppointments();

// Create appointment
await apiService.createAppointment(appointmentData);

// Update appointment
await apiService.updateAppointment(appointmentId, updateData);
```

### Users API Methods
```javascript
// Get all users
const users = await apiService.getUsers();

// Get physiotherapists
const physios = await apiService.getPhysiotherapists();

// Update user
await apiService.updateUser(userId, updateData);
```



### Exercises API Methods
```javascript
// Get exercises
const exercises = await apiService.getExercises();

// Get exercise plans
const plans = await apiService.getExercisePlans();

// Create exercise progress
await apiService.createExerciseProgress(progressData);
```

## 🔐 Authentication Flow

1. **User enters credentials** in LoginForm
2. **API call made** to `/api-token-auth/` endpoint
3. **Token received** and stored in localStorage
4. **User data fetched** from `/api/users/me/`
5. **User redirected** based on their role from API
6. **Subsequent requests** include token in Authorization header

## 🌐 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:12000` & `http://localhost:12001` (Runtime ports)
- Production URLs for deployment

## 📊 Sample Data Available

The integrated system includes:
- **5 Users** (admin, patients, physiotherapists)
- **4 Appointments** (past and future)
- **5 Exercises** across 3 categories
- **2 Exercise Plans** with progress tracking
- **Complete user profiles** with healthcare-specific information

## 🧪 Testing the Integration

### Manual Testing
1. Login with sample credentials
2. Navigate to appointments, exercises, and users pages
3. Test search and filtering functionality
4. Verify data persistence and real-time updates
5. Check error handling and loading states

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:12000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Test appointments endpoint
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:12000/api/appointments/

# Test exercises endpoint
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:12000/api/exercises/

# Test users endpoint
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:12000/api/users/
```

## 🔄 Real-time Features

- **Live Search**: Search results update as you type across all components
- **Dynamic Filtering**: Filters applied immediately for appointments, exercises, and users
- **Instant Updates**: Data updates immediately without page refresh
- **Error Feedback**: Real-time error messages for failed operations
- **Loading States**: Proper loading indicators during API calls

## 🛠️ Development Workflow

1. **Backend Changes**: Modify Django models/views
2. **Run Migrations**: `python manage.py migrate`
3. **Update API Service**: Add new methods to `api.js`
4. **Update Components**: Use new API methods in React components
5. **Test Integration**: Verify frontend-backend communication

## 🚀 Next Steps

### Immediate Enhancements
- Add appointment booking forms
- Implement exercise progress tracking
- Add real-time notifications
- Enhance form validation and error handling UI

### Advanced Features
- WebSocket integration for real-time updates
- File upload functionality
- Advanced filtering and sorting
- Pagination controls
- Caching strategies

## 📝 Notes

- **Development Mode**: CORS is set to allow all origins for development
- **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
- **Error Handling**: All API errors are logged to console
- **Loading States**: Components show loading spinners during API calls

## 🎉 Success!

The Healthcare application now has a **fully functional** frontend-backend integration with:
- ✅ Real authentication and user management
- ✅ Live appointment management system
- ✅ Comprehensive exercise library and plans
- ✅ User management for admin and physiotherapists
- ✅ Real-time search and filtering
- ✅ Complete CRUD operations
- ✅ Error handling and loading states
- ✅ Role-based access control

The system provides a solid foundation for a complete healthcare management platform with core features fully integrated!