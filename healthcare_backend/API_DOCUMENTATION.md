# Healthcare Backend API Documentation

## Overview
This document provides comprehensive documentation for the Healthcare Backend RESTful API endpoints. The API provides complete CRUD operations for all healthcare-related entities.

## Base URL
- Development: `http://localhost:12000/api/`
- Production: `https://your-domain.com/api/`

## Authentication
All API endpoints require authentication using Token-based authentication.

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login (returns token)
- `POST /api/auth/logout/` - User logout
- `POST /api-token-auth/` - Get authentication token

### Headers Required
```
Authorization: Token <your-token-here>
Content-Type: application/json
```

## API Endpoints

### 1. User Management

#### Users
- `GET /api/users/` - List all users (filtered by permissions)
- `GET /api/users/{id}/` - Get specific user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user
- `GET /api/users/me/` - Get current user profile
- `POST /api/users/change_password/` - Change password
- `GET /api/users/stats/` - Get user statistics

#### Patient Profiles
- `GET /api/patients/` - List patient profiles
- `POST /api/patients/` - Create patient profile
- `GET /api/patients/{id}/` - Get patient profile
- `PUT /api/patients/{id}/` - Update patient profile
- `DELETE /api/patients/{id}/` - Delete patient profile

#### Physiotherapist Profiles
- `GET /api/physiotherapists/` - List physiotherapist profiles
- `POST /api/physiotherapists/` - Create physiotherapist profile
- `GET /api/physiotherapists/{id}/` - Get physiotherapist profile
- `PUT /api/physiotherapists/{id}/` - Update physiotherapist profile
- `DELETE /api/physiotherapists/{id}/` - Delete physiotherapist profile
- `GET /api/physiotherapists/available/` - Get available physiotherapists
- `POST /api/physiotherapists/{id}/toggle_availability/` - Toggle availability

### 2. Appointment Management

#### Appointments
- `GET /api/appointments/` - List appointments (filtered by user role)
- `POST /api/appointments/` - Create appointment
- `GET /api/appointments/{id}/` - Get appointment details
- `PUT /api/appointments/{id}/` - Update appointment
- `DELETE /api/appointments/{id}/` - Delete appointment
- `GET /api/appointments/today/` - Get today's appointments
- `GET /api/appointments/upcoming/` - Get upcoming appointments
- `POST /api/appointments/{id}/cancel/` - Cancel appointment
- `POST /api/appointments/{id}/complete/` - Mark appointment as completed
- `POST /api/appointments/{id}/confirm/` - Confirm appointment

#### Appointment Feedback
- `GET /api/appointment-feedback/` - List appointment feedback
- `POST /api/appointment-feedback/` - Create feedback
- `GET /api/appointment-feedback/{id}/` - Get feedback details
- `PUT /api/appointment-feedback/{id}/` - Update feedback
- `DELETE /api/appointment-feedback/{id}/` - Delete feedback

#### Appointment Documents
- `GET /api/appointment-documents/` - List appointment documents
- `POST /api/appointment-documents/` - Upload document
- `GET /api/appointment-documents/{id}/` - Get document
- `PUT /api/appointment-documents/{id}/` - Update document
- `DELETE /api/appointment-documents/{id}/` - Delete document

### 3. Exercise Management

#### Exercise Categories
- `GET /api/exercise-categories/` - List exercise categories
- `POST /api/exercise-categories/` - Create category
- `GET /api/exercise-categories/{id}/` - Get category details
- `PUT /api/exercise-categories/{id}/` - Update category
- `DELETE /api/exercise-categories/{id}/` - Delete category

#### Exercises
- `GET /api/exercises/` - List exercises
- `POST /api/exercises/` - Create exercise
- `GET /api/exercises/{id}/` - Get exercise details
- `PUT /api/exercises/{id}/` - Update exercise
- `DELETE /api/exercises/{id}/` - Delete exercise
- `GET /api/exercises/by_category/` - Get exercises by category

#### Exercise Plans
- `GET /api/exercise-plans/` - List exercise plans
- `POST /api/exercise-plans/` - Create exercise plan
- `GET /api/exercise-plans/{id}/` - Get plan details
- `PUT /api/exercise-plans/{id}/` - Update plan
- `DELETE /api/exercise-plans/{id}/` - Delete plan
- `GET /api/exercise-plans/active/` - Get active plans
- `POST /api/exercise-plans/{id}/activate/` - Activate plan
- `POST /api/exercise-plans/{id}/complete/` - Complete plan

#### Exercise Plan Items
- `GET /api/exercise-plan-items/` - List plan items
- `POST /api/exercise-plan-items/` - Create plan item
- `GET /api/exercise-plan-items/{id}/` - Get item details
- `PUT /api/exercise-plan-items/{id}/` - Update item
- `DELETE /api/exercise-plan-items/{id}/` - Delete item

#### Exercise Progress
- `GET /api/exercise-progress/` - List progress records
- `POST /api/exercise-progress/` - Create progress record
- `GET /api/exercise-progress/{id}/` - Get progress details
- `PUT /api/exercise-progress/{id}/` - Update progress
- `DELETE /api/exercise-progress/{id}/` - Delete progress
- `GET /api/exercise-progress/stats/` - Get progress statistics

### 4. Communication

#### Conversations
- `GET /api/conversations/` - List conversations
- `POST /api/conversations/` - Create conversation
- `GET /api/conversations/{id}/` - Get conversation details
- `PUT /api/conversations/{id}/` - Update conversation
- `DELETE /api/conversations/{id}/` - Delete conversation

#### Messages
- `GET /api/messages/` - List messages
- `POST /api/messages/` - Send message
- `GET /api/messages/{id}/` - Get message details
- `PUT /api/messages/{id}/` - Update message
- `DELETE /api/messages/{id}/` - Delete message

#### Attachments
- `GET /api/attachments/` - List attachments
- `POST /api/attachments/` - Upload attachment
- `GET /api/attachments/{id}/` - Get attachment
- `PUT /api/attachments/{id}/` - Update attachment
- `DELETE /api/attachments/{id}/` - Delete attachment

### 5. Notifications

#### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/` - Create notification
- `GET /api/notifications/{id}/` - Get notification details
- `PUT /api/notifications/{id}/` - Update notification
- `DELETE /api/notifications/{id}/` - Delete notification
- `GET /api/notifications/unread/` - Get unread notifications
- `POST /api/notifications/mark_all_read/` - Mark all as read
- `POST /api/notifications/{id}/mark_read/` - Mark specific as read

#### Notification Preferences
- `GET /api/notification-preferences/` - List preferences
- `POST /api/notification-preferences/` - Create preferences
- `GET /api/notification-preferences/{id}/` - Get preferences
- `PUT /api/notification-preferences/{id}/` - Update preferences
- `DELETE /api/notification-preferences/{id}/` - Delete preferences

## Filtering and Search

### Query Parameters
- `?search=<term>` - Search across specified fields
- `?ordering=<field>` - Order results by field (prefix with `-` for descending)
- `?page=<number>` - Pagination
- `?page_size=<number>` - Items per page (max 100)

### Filtering Examples
- `GET /api/appointments/?status=scheduled` - Filter by status
- `GET /api/exercises/?category=1&difficulty=beginner` - Multiple filters
- `GET /api/notifications/?is_read=false` - Filter unread notifications
- `GET /api/users/?search=john` - Search users by name

## Response Format

### Success Response
```json
{
  "count": 25,
  "next": "http://localhost:12000/api/appointments/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "field1": "value1",
      "field2": "value2",
      ...
    }
  ]
}
```

### Error Response
```json
{
  "detail": "Error message",
  "field_errors": {
    "field_name": ["Error for this field"]
  }
}
```

## HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Sample API Calls

### Login
```bash
curl -X POST "http://localhost:12000/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{"username": "patient1", "password": "password123"}'
```

### Get Appointments
```bash
curl -X GET "http://localhost:12000/api/appointments/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Token your-token-here"
```

### Create Appointment
```bash
curl -X POST "http://localhost:12000/api/appointments/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Token your-token-here" \
  -d '{
    "physiotherapist": 1,
    "date": "2025-07-01",
    "start_time": "10:00:00",
    "end_time": "11:00:00",
    "appointment_type": "consultation",
    "reason": "Back pain assessment"
  }'
```

## Permissions

### User Types
- **Patient**: Can view/edit own data, create appointments, view assigned exercises
- **Physiotherapist**: Can view assigned patients, manage appointments, create exercise plans
- **Admin**: Full access to all endpoints

### Permission Classes
- `IsAuthenticated` - Requires valid authentication
- `IsOwnerOrReadOnly` - Can edit own data, read others
- `IsPhysiotherapistOrReadOnly` - Physiotherapists can edit, others read-only

## Rate Limiting
- Default: 1000 requests per hour per user
- Authentication endpoints: 100 requests per hour per IP

## Pagination
- Default page size: 20 items
- Maximum page size: 100 items
- Use `page` and `page_size` query parameters

## Data Validation
All endpoints include comprehensive data validation:
- Required fields validation
- Format validation (email, phone, dates)
- Business logic validation
- Permission-based validation

## Error Handling
The API provides detailed error messages for:
- Validation errors
- Permission errors
- Authentication errors
- Business logic violations
- Server errors

## Testing
Sample data is available for testing:
- Users: patient1/password123, physio1/password123
- Admin: admin/admin123
- Sample appointments, exercises, and notifications included

## Support
For API support and questions, please contact the development team.