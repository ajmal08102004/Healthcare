# Healthcare Backend

This is the backend for the Healthcare application, built with Django and PostgreSQL.

## Features

- User authentication and authorization
- Patient and physiotherapist profiles
- Appointment scheduling and management
- Exercise plans and progress tracking
- Chat functionality
- Notifications system

## Tech Stack

- Django 5.2.3
- Django REST Framework
- PostgreSQL
- Token-based authentication

## Setup Instructions

### Prerequisites

- Python 3.12+
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ajmal0810/Healthcare.git
cd Healthcare/healthcare_backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure PostgreSQL:
```bash
# Create a PostgreSQL user and database
sudo -u postgres psql -c "CREATE USER healthcare_user WITH PASSWORD 'healthcare_password';"
sudo -u postgres psql -c "CREATE DATABASE healthcare_db OWNER healthcare_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE healthcare_db TO healthcare_user;"
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver 0.0.0.0:12000
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get token
- `POST /api/auth/logout/` - Logout and invalidate token
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password
- `GET /api/auth/physiotherapists/` - List all physiotherapists

### Appointments
- `GET /api/appointments/` - List appointments
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/<id>/` - Get appointment details
- `PUT /api/appointments/<id>/` - Update appointment
- `DELETE /api/appointments/<id>/` - Delete appointment
- `POST /api/appointments/<id>/feedback/` - Submit feedback for appointment
- `GET /api/appointments/<id>/feedback/` - Get feedback for appointment

### Exercises
- `GET /api/exercises/categories/` - List exercise categories
- `GET /api/exercises/` - List exercises
- `GET /api/exercises/<id>/` - Get exercise details
- `GET /api/exercises/plans/` - List exercise plans
- `POST /api/exercises/plans/` - Create exercise plan
- `GET /api/exercises/plans/<id>/` - Get exercise plan details
- `PUT /api/exercises/plans/<id>/` - Update exercise plan
- `DELETE /api/exercises/plans/<id>/` - Delete exercise plan
- `POST /api/exercises/plans/<id>/items/` - Add item to exercise plan
- `DELETE /api/exercises/plans/<id>/items/<item_id>/` - Remove item from exercise plan
- `GET /api/exercises/progress/` - List exercise progress
- `POST /api/exercises/progress/` - Record exercise progress

### Chat
- `GET /api/chat/conversations/` - List conversations
- `POST /api/chat/conversations/` - Create conversation
- `GET /api/chat/conversations/<id>/` - Get conversation details
- `DELETE /api/chat/conversations/<id>/` - Delete conversation
- `GET /api/chat/conversations/<id>/messages/` - List messages in conversation
- `POST /api/chat/conversations/<id>/messages/` - Send message in conversation
- `POST /api/chat/messages/<id>/attachments/` - Upload attachment for message

### Notifications
- `GET /api/notifications/` - List notifications
- `GET /api/notifications/<id>/` - Get notification details
- `PUT /api/notifications/<id>/` - Mark notification as read
- `DELETE /api/notifications/<id>/` - Delete notification
- `POST /api/notifications/mark-all-read/` - Mark all notifications as read
- `GET /api/notifications/preferences/` - Get notification preferences
- `PUT /api/notifications/preferences/` - Update notification preferences