# Healthcare API Documentation

This document describes the RESTful API endpoints available in the Healthcare application.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
Most endpoints require authentication. Use Token authentication by including the token in the Authorization header:
```
Authorization: Token your_token_here
```

## API Endpoints

### 1. Users Management (`/api/users/`)

#### User ViewSet
- **GET** `/api/users/` - List all users (filtered by permissions)
- **POST** `/api/users/` - Create a new user (registration)
- **GET** `/api/users/{id}/` - Retrieve a specific user
- **PUT** `/api/users/{id}/` - Update a user (own profile only)
- **PATCH** `/api/users/{id}/` - Partial update a user
- **DELETE** `/api/users/{id}/` - Delete a user (own account only)

#### Custom User Actions
- **GET** `/api/users/me/` - Get current user's profile
- **GET** `/api/users/physiotherapists/` - Get list of available physiotherapists

#### Query Parameters
- `user_type`: Filter by user type (patient, physiotherapist, admin)
- `is_active`: Filter by active status
- `is_verified`: Filter by verification status
- `search`: Search in username, email, first_name, last_name
- `ordering`: Order by username, email, created_at, last_login

### 2. Patient Profiles (`/api/patient-profiles/`)

#### Patient Profile ViewSet
- **GET** `/api/patient-profiles/` - List patient profiles
- **POST** `/api/patient-profiles/` - Create a patient profile
- **GET** `/api/patient-profiles/{id}/` - Retrieve a patient profile
- **PUT** `/api/patient-profiles/{id}/` - Update a patient profile
- **PATCH** `/api/patient-profiles/{id}/` - Partial update a patient profile
- **DELETE** `/api/patient-profiles/{id}/` - Delete a patient profile

### 3. Physiotherapist Profiles (`/api/physiotherapist-profiles/`)

#### Physiotherapist Profile ViewSet
- **GET** `/api/physiotherapist-profiles/` - List physiotherapist profiles
- **POST** `/api/physiotherapist-profiles/` - Create a physiotherapist profile
- **GET** `/api/physiotherapist-profiles/{id}/` - Retrieve a physiotherapist profile
- **PUT** `/api/physiotherapist-profiles/{id}/` - Update a physiotherapist profile
- **PATCH** `/api/physiotherapist-profiles/{id}/` - Partial update a physiotherapist profile
- **DELETE** `/api/physiotherapist-profiles/{id}/` - Delete a physiotherapist profile

#### Query Parameters
- `is_available`: Filter by availability
- `years_of_experience`: Filter by experience
- `search`: Search in name, specializations, education
- `ordering`: Order by consultation_fee, years_of_experience, name

### 4. Appointments (`/api/appointments/`)

#### Appointment ViewSet
- **GET** `/api/appointments/` - List appointments (filtered by user)
- **POST** `/api/appointments/` - Create a new appointment
- **GET** `/api/appointments/{id}/` - Retrieve an appointment
- **PUT** `/api/appointments/{id}/` - Update an appointment
- **PATCH** `/api/appointments/{id}/` - Partial update an appointment
- **DELETE** `/api/appointments/{id}/` - Delete an appointment

#### Custom Appointment Actions
- **POST** `/api/appointments/{id}/add_feedback/` - Add feedback to appointment
- **GET** `/api/appointments/{id}/feedback/` - Get appointment feedback
- **GET** `/api/appointments/upcoming/` - Get upcoming appointments
- **GET** `/api/appointments/past/` - Get past appointments

#### Query Parameters
- `status`: Filter by status (scheduled, confirmed, completed, cancelled, no_show)
- `date`: Filter by specific date
- `physiotherapist`: Filter by physiotherapist ID
- `patient`: Filter by patient ID
- `search`: Search in reason, notes
- `ordering`: Order by date, start_time, created_at

### 5. Appointment Feedback (`/api/appointment-feedback/`)

#### Appointment Feedback ViewSet
- **GET** `/api/appointment-feedback/` - List feedback (filtered by user)
- **POST** `/api/appointment-feedback/` - Create feedback
- **GET** `/api/appointment-feedback/{id}/` - Retrieve feedback
- **PUT** `/api/appointment-feedback/{id}/` - Update feedback
- **PATCH** `/api/appointment-feedback/{id}/` - Partial update feedback
- **DELETE** `/api/appointment-feedback/{id}/` - Delete feedback

#### Query Parameters
- `rating`: Filter by rating
- `appointment__status`: Filter by appointment status
- `ordering`: Order by rating, created_at

### 6. Exercise Categories (`/api/exercise-categories/`)

#### Exercise Category ViewSet
- **GET** `/api/exercise-categories/` - List exercise categories
- **POST** `/api/exercise-categories/` - Create a category (authenticated users)
- **GET** `/api/exercise-categories/{id}/` - Retrieve a category
- **PUT** `/api/exercise-categories/{id}/` - Update a category
- **PATCH** `/api/exercise-categories/{id}/` - Partial update a category
- **DELETE** `/api/exercise-categories/{id}/` - Delete a category

#### Query Parameters
- `search`: Search in name, description
- `ordering`: Order by name, created_at

### 7. Exercises (`/api/exercises/`)

#### Exercise ViewSet
- **GET** `/api/exercises/` - List exercises
- **POST** `/api/exercises/` - Create an exercise (physiotherapists/admins only)
- **GET** `/api/exercises/{id}/` - Retrieve an exercise
- **PUT** `/api/exercises/{id}/` - Update an exercise (physiotherapists/admins only)
- **PATCH** `/api/exercises/{id}/` - Partial update an exercise
- **DELETE** `/api/exercises/{id}/` - Delete an exercise (physiotherapists/admins only)

#### Query Parameters
- `category`: Filter by category ID
- `difficulty`: Filter by difficulty (beginner, intermediate, advanced)
- `duration`: Filter by duration
- `search`: Search in name, description
- `ordering`: Order by name, difficulty, duration, created_at

### 8. Exercise Plans (`/api/exercise-plans/`)

#### Exercise Plan ViewSet
- **GET** `/api/exercise-plans/` - List exercise plans (filtered by user)
- **POST** `/api/exercise-plans/` - Create an exercise plan (physiotherapists only)
- **GET** `/api/exercise-plans/{id}/` - Retrieve an exercise plan
- **PUT** `/api/exercise-plans/{id}/` - Update an exercise plan
- **PATCH** `/api/exercise-plans/{id}/` - Partial update an exercise plan
- **DELETE** `/api/exercise-plans/{id}/` - Delete an exercise plan

#### Custom Exercise Plan Actions
- **POST** `/api/exercise-plans/{id}/add_exercise/` - Add exercise to plan
- **GET** `/api/exercise-plans/{id}/exercises/` - Get all exercises in plan

#### Query Parameters
- `is_active`: Filter by active status
- `patient`: Filter by patient ID
- `physiotherapist`: Filter by physiotherapist ID
- `search`: Search in name, description
- `ordering`: Order by name, start_date, end_date, created_at

### 9. Exercise Plan Items (`/api/exercise-plan-items/`)

#### Exercise Plan Item ViewSet
- **GET** `/api/exercise-plan-items/` - List exercise plan items
- **POST** `/api/exercise-plan-items/` - Create an exercise plan item
- **GET** `/api/exercise-plan-items/{id}/` - Retrieve an exercise plan item
- **PUT** `/api/exercise-plan-items/{id}/` - Update an exercise plan item
- **PATCH** `/api/exercise-plan-items/{id}/` - Partial update an exercise plan item
- **DELETE** `/api/exercise-plan-items/{id}/` - Delete an exercise plan item

#### Query Parameters
- `exercise_plan`: Filter by exercise plan ID
- `exercise`: Filter by exercise ID
- `day_of_week`: Filter by day of week (0-6)
- `ordering`: Order by day_of_week

### 10. Exercise Progress (`/api/exercise-progress/`)

#### Exercise Progress ViewSet
- **GET** `/api/exercise-progress/` - List exercise progress (filtered by user)
- **POST** `/api/exercise-progress/` - Create exercise progress (patients only)
- **GET** `/api/exercise-progress/{id}/` - Retrieve exercise progress
- **PUT** `/api/exercise-progress/{id}/` - Update exercise progress
- **PATCH** `/api/exercise-progress/{id}/` - Partial update exercise progress
- **DELETE** `/api/exercise-progress/{id}/` - Delete exercise progress

#### Query Parameters
- `patient`: Filter by patient ID
- `exercise_plan_item`: Filter by exercise plan item ID
- `difficulty_rating`: Filter by difficulty rating (1-5)
- `pain_level`: Filter by pain level (0-4)
- `ordering`: Order by date_completed, created_at

### 11. Books (`/api/books/`)

#### Book ViewSet
- **GET** `/api/books/` - List books
- **POST** `/api/books/` - Create a book (authenticated users)
- **GET** `/api/books/{id}/` - Retrieve a book
- **PUT** `/api/books/{id}/` - Update a book
- **PATCH** `/api/books/{id}/` - Partial update a book
- **DELETE** `/api/books/{id}/` - Delete a book

#### Custom Book Actions
- **POST** `/api/books/{id}/bookmark/` - Bookmark a book
- **DELETE** `/api/books/{id}/bookmark/` - Remove bookmark
- **POST** `/api/books/{id}/review/` - Add a review
- **GET** `/api/books/{id}/reviews/` - Get all reviews for a book

#### Query Parameters
- `category`: Filter by category ID
- `book_type`: Filter by book type (educational, reference, research, guide, manual)
- `language`: Filter by language
- `is_available`: Filter by availability
- `author`: Filter by author name (contains)
- `year`: Filter by publication year
- `search`: Search in title, author, description, publisher
- `ordering`: Order by title, author, publication_date, created_at

### 12. Book Categories (`/api/categories/`)

#### Book Category ViewSet
- **GET** `/api/categories/` - List book categories
- **POST** `/api/categories/` - Create a category (authenticated users)
- **GET** `/api/categories/{id}/` - Retrieve a category
- **PUT** `/api/categories/{id}/` - Update a category
- **PATCH** `/api/categories/{id}/` - Partial update a category
- **DELETE** `/api/categories/{id}/` - Delete a category

#### Query Parameters
- `search`: Search in name, description
- `ordering`: Order by name, created_at

### 13. Book Reviews (`/api/reviews/`)

#### Book Review ViewSet
- **GET** `/api/reviews/` - List user's book reviews
- **POST** `/api/reviews/` - Create a book review
- **GET** `/api/reviews/{id}/` - Retrieve a book review
- **PUT** `/api/reviews/{id}/` - Update a book review
- **PATCH** `/api/reviews/{id}/` - Partial update a book review
- **DELETE** `/api/reviews/{id}/` - Delete a book review

### 14. Book Bookmarks (`/api/bookmarks/`)

#### Book Bookmark ViewSet (Read-only)
- **GET** `/api/bookmarks/` - List user's bookmarked books
- **GET** `/api/bookmarks/{id}/` - Retrieve a bookmark

## Authentication Endpoints

### Registration and Login
- **POST** `/api/auth/register/` - Register a new user
- **POST** `/api/auth/login/` - Login user
- **POST** `/api/auth/logout/` - Logout user
- **POST** `/api-token-auth/` - Get authentication token

### Profile Management
- **GET** `/api/auth/profile/` - Get user profile
- **PUT** `/api/auth/profile/` - Update user profile
- **GET** `/api/auth/patient-profile/` - Get patient profile
- **PUT** `/api/auth/patient-profile/` - Update patient profile
- **GET** `/api/auth/physiotherapist-profile/` - Get physiotherapist profile
- **PUT** `/api/auth/physiotherapist-profile/` - Update physiotherapist profile
- **POST** `/api/auth/change-password/` - Change password
- **GET** `/api/auth/physiotherapists/` - List available physiotherapists

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "id": 1,
  "field1": "value1",
  "field2": "value2",
  ...
}
```

### List Response
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "field1": "value1",
      ...
    }
  ]
}
```

### Error Response
```json
{
  "error": "Error message",
  "field_errors": {
    "field_name": ["Field specific error"]
  }
}
```

## Permissions

- **Public**: No authentication required
- **Authenticated**: Requires valid authentication token
- **Owner**: User can only access/modify their own resources
- **Physiotherapist**: Only physiotherapists can perform certain actions
- **Admin**: Only admin users can perform certain actions

## Filtering and Searching

Most list endpoints support:
- **Filtering**: Use query parameters to filter results
- **Searching**: Use `search` parameter for text search
- **Ordering**: Use `ordering` parameter to sort results
- **Pagination**: Results are paginated with 20 items per page by default

Example:
```
GET /api/books/?category=1&search=python&ordering=title&page=2
```

## Status Codes

- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Permission denied
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error