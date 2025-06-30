# 🏥 Healthcare Application - Local Setup Guide

This guide will help you set up and run the Healthcare application locally on your system.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Python 3.8+** (recommended: Python 3.10 or 3.11)
- **Node.js 16+** (recommended: Node.js 18 or 20)
- **npm** or **yarn** (comes with Node.js)
- **Git**

### Optional (for production)
- **PostgreSQL** (for production database)
- **Redis** (for caching and sessions)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ajmaltheaj810/Healthcare.git
cd Healthcare
```

### 2. Backend Setup (Django)

#### Navigate to Backend Directory
```bash
cd healthcare_backend
```

#### Create Virtual Environment
```bash
# Using venv (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the `healthcare_backend` directory:
```bash
# Create .env file
touch .env  # On Windows: type nul > .env
```

Add the following content to `.env`:
```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database (SQLite for development)
USE_SQLITE=true

# For PostgreSQL (optional)
# DATABASE_URL=postgresql://username:password@localhost:5432/healthcare_db

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173

# API Settings
API_BASE_URL=http://localhost:12000
```

#### Database Setup
```bash
# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Follow prompts to create admin user

# Load sample data (optional but recommended)
python create_sample_data.py
```

#### Start Backend Server
```bash
# Start Django development server
python manage.py runserver 0.0.0.0:12000
```

The backend API will be available at: `http://localhost:12000`

### 3. Frontend Setup (React + Vite)

#### Open New Terminal and Navigate to Project Root
```bash
cd Healthcare  # Make sure you're in the project root
```

#### Install Node.js Dependencies
```bash
npm install
# or if you prefer yarn:
# yarn install
```

#### Environment Configuration
Create a `.env` file in the project root:
```bash
# Create .env file
touch .env  # On Windows: type nul > .env
```

Add the following content to `.env`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:12000
VITE_API_TIMEOUT=10000

# Development Settings
VITE_NODE_ENV=development
```

#### Start Frontend Development Server
```bash
npm run dev
# or with yarn:
# yarn dev
```

The frontend will be available at: `http://localhost:5173`

## 🔧 Detailed Setup Instructions

### Backend Configuration

#### 1. Django Settings
The application uses environment variables for configuration. Key settings:

- **Database**: Uses SQLite by default (set `USE_SQLITE=true`)
- **CORS**: Configured for frontend integration
- **Authentication**: Token-based authentication enabled
- **API**: RESTful endpoints with comprehensive documentation

#### 2. Available Management Commands
```bash
# Create sample data
python manage.py shell -c "exec(open('create_sample_data.py').read())"

# Check API endpoints
python manage.py show_urls

# Run tests
python manage.py test

# Collect static files (for production)
python manage.py collectstatic
```

### Frontend Configuration

#### 1. Available Scripts
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type checking
npm run type-check
```

#### 2. Environment Variables
- `VITE_API_BASE_URL`: Backend API URL
- `VITE_API_TIMEOUT`: API request timeout
- `VITE_NODE_ENV`: Environment mode

## 🧪 Testing the Setup

### 1. Verify Backend
Visit `http://localhost:12000/api/` in your browser. You should see the Django REST Framework browsable API.

### 2. Test Authentication
```bash
# Test login endpoint
curl -X POST "http://localhost:12000/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### 3. Verify Frontend
Visit `http://localhost:5173` in your browser. You should see the Healthcare application login page.

### 4. Test Sample Data
If you loaded sample data, you can use these test accounts:
- **Patient**: `patient1` / `password123`
- **Physiotherapist**: `physio1` / `password123`
- **Admin**: `admin` / `admin123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout

### Core Features
- `GET/POST/PUT/DELETE /api/users/` - User management
- `GET/POST/PUT/DELETE /api/patients/` - Patient profiles
- `GET/POST/PUT/DELETE /api/physiotherapists/` - Physiotherapist profiles
- `GET/POST/PUT/DELETE /api/appointments/` - Appointment management
- `GET/POST/PUT/DELETE /api/exercises/` - Exercise library
- `GET/POST/PUT/DELETE /api/exercise-plans/` - Exercise plans
- `GET/POST/PUT/DELETE /api/notifications/` - Notifications

For complete API documentation, see: `healthcare_backend/API_DOCUMENTATION.md`

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 12000 (backend)
# On Windows:
netstat -ano | findstr :12000
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:12000 | xargs kill -9

# Kill process using port 5173 (frontend)
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

#### 2. Database Issues
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
python create_sample_data.py
```

#### 3. CORS Issues
Ensure your `.env` file includes the correct CORS origins:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173
```

#### 4. Module Not Found Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt
npm install
```

#### 5. Permission Errors
```bash
# On macOS/Linux, you might need to use sudo for global installations
sudo npm install -g <package-name>
```

### Environment-Specific Issues

#### Windows
- Use `venv\Scripts\activate` to activate virtual environment
- Use `type nul > .env` to create empty files
- Use PowerShell or Command Prompt

#### macOS/Linux
- Use `source venv/bin/activate` to activate virtual environment
- Use `touch .env` to create empty files
- Ensure Python 3 is available as `python` or `python3`

## 🔒 Security Notes

### Development vs Production

#### Development (Current Setup)
- Uses SQLite database
- Debug mode enabled
- CORS allows localhost origins
- Secret key in environment file

#### Production Recommendations
- Use PostgreSQL or MySQL
- Set `DEBUG=False`
- Use environment variables for secrets
- Configure proper CORS origins
- Use HTTPS
- Set up proper logging
- Use Redis for caching

## 📱 Mobile Development

The frontend is responsive and works on mobile devices. For mobile app development:

1. **React Native**: The API is ready for React Native integration
2. **Progressive Web App**: The current setup supports PWA features
3. **Mobile Testing**: Use browser dev tools to test mobile responsiveness

## 🚀 Deployment

### Local Production Build

#### Backend
```bash
# Install production dependencies
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn healthcare_backend.wsgi:application --bind 0.0.0.0:12000
```

#### Frontend
```bash
# Build for production
npm run build

# Serve production build
npm run preview
```

### Docker Setup (Optional)
```dockerfile
# Example Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 12000
CMD ["gunicorn", "healthcare_backend.wsgi:application", "--bind", "0.0.0.0:12000"]
```

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure environment variables are set correctly
4. Check the console for error messages
5. Review the API documentation for endpoint usage

## 🎯 Next Steps

After successful setup:

1. Explore the API using the browsable interface at `http://localhost:12000/api/`
2. Test different user roles (patient, physiotherapist, admin)
3. Create appointments and exercise plans
4. Customize the frontend components
5. Add new features using the existing API structure

---

**Happy Coding! 🚀**