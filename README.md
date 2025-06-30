# 🏥 Healthcare Management System

A comprehensive healthcare management platform built with React (frontend) and Django REST Framework (backend).

## ✨ Features

- **User Management**: Patient and Physiotherapist profiles with role-based access
- **Appointment System**: Complete appointment booking and management
- **Exercise Library**: Comprehensive exercise database with categorization
- **Exercise Plans**: Personalized exercise plan creation and tracking
- **Progress Monitoring**: Track patient progress and exercise completion
- **Communication**: Messaging system between patients and physiotherapists
- **Notifications**: Real-time notifications for appointments and updates
- **Dashboard**: Role-specific dashboards with analytics and insights

## 🚀 Quick Start

### Automated Setup (Recommended)

#### For Windows:
```bash
git clone https://github.com/ajmaltheaj810/Healthcare.git
cd Healthcare
setup.bat
```

#### For macOS/Linux:
```bash
git clone https://github.com/ajmaltheaj810/Healthcare.git
cd Healthcare
chmod +x setup.sh
./setup.sh
```

### Manual Setup

See [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for detailed manual setup instructions.

## 🏃‍♂️ Running the Application

After setup, start both servers:

### Backend (Django)
```bash
# Windows
start_backend.bat

# macOS/Linux
./start_backend.sh
```
Backend available at: `http://localhost:12000`

### Frontend (React)
```bash
# Windows
start_frontend.bat

# macOS/Linux
./start_frontend.sh
```
Frontend available at: `http://localhost:5173`

## 🧪 Test Accounts

The application comes with pre-loaded test data:

- **Patient**: `patient1` / `password123`
- **Physiotherapist**: `physio1` / `password123`
- **Admin**: `admin` / `admin123`

## 📚 API Documentation

Complete API documentation is available at:
- Interactive API: `http://localhost:12000/api/`
- Documentation: [healthcare_backend/API_DOCUMENTATION.md](healthcare_backend/API_DOCUMENTATION.md)

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Django 5.2** with Python 3.8+
- **Django REST Framework** for API
- **Token Authentication** for security
- **SQLite** (development) / **PostgreSQL** (production)
- **CORS** enabled for frontend integration

## 📁 Project Structure

```
Healthcare/
├── src/                          # React frontend source
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Page components
│   ├── services/               # API service layer
│   └── context/                # React context providers
├── healthcare_backend/          # Django backend
│   ├── authentication/         # User management app
│   ├── appointments/           # Appointment management
│   ├── exercises/              # Exercise library
│   ├── notifications/          # Notification system
│   └── api_views.py           # Centralized API views
├── setup.sh / setup.bat       # Automated setup scripts
└── LOCAL_SETUP_GUIDE.md       # Detailed setup guide
```

## 🔧 Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Environment Variables

#### Backend (.env in healthcare_backend/)
```env
SECRET_KEY=your-secret-key
DEBUG=True
USE_SQLITE=true
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend (.env in project root)
```env
VITE_API_BASE_URL=http://localhost:12000
VITE_NODE_ENV=development
```

## 🚀 Deployment

### Production Build

#### Backend
```bash
cd healthcare_backend
pip install gunicorn
python manage.py collectstatic
gunicorn healthcare_backend.wsgi:application
```

#### Frontend
```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [LOCAL_SETUP_GUIDE.md](LOCAL_SETUP_GUIDE.md) for troubleshooting
2. Review the API documentation
3. Open an issue on GitHub

## 🎯 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Real-time chat implementation
- [ ] Advanced analytics dashboard
- [ ] Integration with wearable devices
- [ ] Telemedicine video calls
- [ ] Multi-language support

---

**Built with ❤️ for better healthcare management**
