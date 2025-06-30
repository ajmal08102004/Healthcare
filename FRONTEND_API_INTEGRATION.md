# Frontend API Integration Guide

## 🔗 API Integration Status

The Healthcare React frontend is now **fully integrated** with the Django REST API backend. This document outlines the integration details and how to use the connected system.

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

### 3. Books Integration
- **Books List Component**: `src/components/books/BooksList.jsx` displays real book data
- **Search & Filtering**: Real-time search and filtering using API endpoints
- **Bookmark Functionality**: Users can bookmark books via API
- **Category Management**: Dynamic category loading from API

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
2. **Navigate to Books**: Go to `/books` to see the integrated books list
3. **Search & Filter**: Test real-time search and filtering
4. **Bookmark Books**: Test the bookmark functionality
5. **API Responses**: Check browser console for API responses

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
│   └── books/
│       └── BooksList.jsx      # New component with API integration
├── pages/
│   └── Books.jsx              # Books page
└── App.tsx                    # Updated with loading states and Books route
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

### Books API Methods
```javascript
// Get books with filtering
const books = await apiService.getBooks({ search: 'term', category: 1 });

// Get single book
const book = await apiService.getBook(bookId);

// Bookmark a book
await apiService.bookmarkBook(bookId);

// Add review
await apiService.addBookReview(bookId, { rating: 5, comment: 'Great!' });
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

### Appointments API Methods
```javascript
// Get appointments
const appointments = await apiService.getAppointments();

// Create appointment
await apiService.createAppointment(appointmentData);

// Get upcoming appointments
const upcoming = await apiService.getUpcomingAppointments();
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
- **5 Books** across 3 categories
- **4 Appointments** (past and future)
- **5 Exercises** across 3 categories
- **2 Exercise Plans** with progress tracking

## 🧪 Testing the Integration

### Manual Testing
1. Login with sample credentials
2. Navigate to different pages
3. Test CRUD operations
4. Verify data persistence
5. Check error handling

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:12000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Test books endpoint
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:12000/api/books/
```

## 🔄 Real-time Features

- **Live Search**: Search results update as you type
- **Dynamic Filtering**: Filters applied immediately
- **Instant Bookmarks**: Bookmark status updates immediately
- **Error Feedback**: Real-time error messages for failed operations

## 🛠️ Development Workflow

1. **Backend Changes**: Modify Django models/views
2. **Run Migrations**: `python manage.py migrate`
3. **Update API Service**: Add new methods to `api.js`
4. **Update Components**: Use new API methods in React components
5. **Test Integration**: Verify frontend-backend communication

## 🚀 Next Steps

### Immediate Enhancements
- Add more components for other resources (appointments, exercises)
- Implement real-time notifications
- Add form validation
- Enhance error handling UI

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
- ✅ Real authentication
- ✅ Live data from API
- ✅ CRUD operations
- ✅ Error handling
- ✅ Loading states
- ✅ Role-based access

The system is ready for further development and can be extended with additional features as needed!