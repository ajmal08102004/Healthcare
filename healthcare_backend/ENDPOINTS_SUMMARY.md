# Healthcare API - RESTful Endpoints Summary

## 🚀 Server Information
- **Base URL**: `http://localhost:12000`
- **Server Status**: ✅ Running on port 12000
- **Database**: SQLite (development)
- **Authentication**: Token-based authentication

## 📋 Available RESTful Endpoints

### 1. Users Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/` | List all users (with pagination) |
| POST | `/api/users/` | Create a new user |
| GET | `/api/users/{id}/` | Get specific user details |
| PUT | `/api/users/{id}/` | Update user (full update) |
| PATCH | `/api/users/{id}/` | Partial update user |
| DELETE | `/api/users/{id}/` | Delete user |
| GET | `/api/users/me/` | Get current user profile |
| GET | `/api/users/physiotherapists/` | List available physiotherapists |

### 2. Patient Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient-profiles/` | List patient profiles |
| POST | `/api/patient-profiles/` | Create patient profile |
| GET | `/api/patient-profiles/{id}/` | Get patient profile |
| PUT | `/api/patient-profiles/{id}/` | Update patient profile |
| PATCH | `/api/patient-profiles/{id}/` | Partial update patient profile |
| DELETE | `/api/patient-profiles/{id}/` | Delete patient profile |

### 3. Physiotherapist Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/physiotherapist-profiles/` | List physiotherapist profiles |
| POST | `/api/physiotherapist-profiles/` | Create physiotherapist profile |
| GET | `/api/physiotherapist-profiles/{id}/` | Get physiotherapist profile |
| PUT | `/api/physiotherapist-profiles/{id}/` | Update physiotherapist profile |
| PATCH | `/api/physiotherapist-profiles/{id}/` | Partial update physiotherapist profile |
| DELETE | `/api/physiotherapist-profiles/{id}/` | Delete physiotherapist profile |

### 4. Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointments/` | List appointments (filtered by user) |
| POST | `/api/appointments/` | Create new appointment |
| GET | `/api/appointments/{id}/` | Get appointment details |
| PUT | `/api/appointments/{id}/` | Update appointment |
| PATCH | `/api/appointments/{id}/` | Partial update appointment |
| DELETE | `/api/appointments/{id}/` | Delete appointment |
| GET | `/api/appointments/upcoming/` | Get upcoming appointments |
| GET | `/api/appointments/past/` | Get past appointments |
| POST | `/api/appointments/{id}/add_feedback/` | Add feedback to appointment |
| GET | `/api/appointments/{id}/feedback/` | Get appointment feedback |

### 5. Appointment Feedback
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/appointment-feedback/` | List feedback (filtered by user) |
| POST | `/api/appointment-feedback/` | Create feedback |
| GET | `/api/appointment-feedback/{id}/` | Get feedback details |
| PUT | `/api/appointment-feedback/{id}/` | Update feedback |
| PATCH | `/api/appointment-feedback/{id}/` | Partial update feedback |
| DELETE | `/api/appointment-feedback/{id}/` | Delete feedback |

### 6. Exercise Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercise-categories/` | List exercise categories |
| POST | `/api/exercise-categories/` | Create exercise category |
| GET | `/api/exercise-categories/{id}/` | Get category details |
| PUT | `/api/exercise-categories/{id}/` | Update category |
| PATCH | `/api/exercise-categories/{id}/` | Partial update category |
| DELETE | `/api/exercise-categories/{id}/` | Delete category |

### 7. Exercises
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises/` | List exercises |
| POST | `/api/exercises/` | Create exercise (physiotherapists/admins only) |
| GET | `/api/exercises/{id}/` | Get exercise details |
| PUT | `/api/exercises/{id}/` | Update exercise |
| PATCH | `/api/exercises/{id}/` | Partial update exercise |
| DELETE | `/api/exercises/{id}/` | Delete exercise |

### 8. Exercise Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercise-plans/` | List exercise plans (filtered by user) |
| POST | `/api/exercise-plans/` | Create exercise plan (physiotherapists only) |
| GET | `/api/exercise-plans/{id}/` | Get exercise plan details |
| PUT | `/api/exercise-plans/{id}/` | Update exercise plan |
| PATCH | `/api/exercise-plans/{id}/` | Partial update exercise plan |
| DELETE | `/api/exercise-plans/{id}/` | Delete exercise plan |
| POST | `/api/exercise-plans/{id}/add_exercise/` | Add exercise to plan |
| GET | `/api/exercise-plans/{id}/exercises/` | Get exercises in plan |

### 9. Exercise Plan Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercise-plan-items/` | List exercise plan items |
| POST | `/api/exercise-plan-items/` | Create exercise plan item |
| GET | `/api/exercise-plan-items/{id}/` | Get plan item details |
| PUT | `/api/exercise-plan-items/{id}/` | Update plan item |
| PATCH | `/api/exercise-plan-items/{id}/` | Partial update plan item |
| DELETE | `/api/exercise-plan-items/{id}/` | Delete plan item |

### 10. Exercise Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercise-progress/` | List exercise progress (filtered by user) |
| POST | `/api/exercise-progress/` | Create progress entry (patients only) |
| GET | `/api/exercise-progress/{id}/` | Get progress details |
| PUT | `/api/exercise-progress/{id}/` | Update progress |
| PATCH | `/api/exercise-progress/{id}/` | Partial update progress |
| DELETE | `/api/exercise-progress/{id}/` | Delete progress |

### 11. Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books/` | List books |
| POST | `/api/books/` | Create book |
| GET | `/api/books/{id}/` | Get book details |
| PUT | `/api/books/{id}/` | Update book |
| PATCH | `/api/books/{id}/` | Partial update book |
| DELETE | `/api/books/{id}/` | Delete book |
| POST | `/api/books/{id}/bookmark/` | Bookmark book |
| DELETE | `/api/books/{id}/bookmark/` | Remove bookmark |
| POST | `/api/books/{id}/review/` | Add book review |
| GET | `/api/books/{id}/reviews/` | Get book reviews |

### 12. Book Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List book categories |
| POST | `/api/categories/` | Create book category |
| GET | `/api/categories/{id}/` | Get category details |
| PUT | `/api/categories/{id}/` | Update category |
| PATCH | `/api/categories/{id}/` | Partial update category |
| DELETE | `/api/categories/{id}/` | Delete category |

### 13. Book Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/` | List user's book reviews |
| POST | `/api/reviews/` | Create book review |
| GET | `/api/reviews/{id}/` | Get review details |
| PUT | `/api/reviews/{id}/` | Update review |
| PATCH | `/api/reviews/{id}/` | Partial update review |
| DELETE | `/api/reviews/{id}/` | Delete review |

### 14. Book Bookmarks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks/` | List user's bookmarked books |
| GET | `/api/bookmarks/{id}/` | Get bookmark details |

## 🔐 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api-token-auth/` | Get authentication token |
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/logout/` | Logout user |
| GET | `/api/auth/profile/` | Get user profile |
| PUT | `/api/auth/profile/` | Update user profile |
| POST | `/api/auth/change-password/` | Change password |

## 🔍 Query Parameters

### Filtering
- `category`: Filter by category ID
- `user_type`: Filter by user type (patient, physiotherapist, admin)
- `status`: Filter by status
- `is_active`: Filter by active status
- `difficulty`: Filter by difficulty level
- `book_type`: Filter by book type

### Searching
- `search`: Text search across relevant fields

### Ordering
- `ordering`: Sort results by specified fields
- Use `-` prefix for descending order (e.g., `-created_at`)

### Pagination
- `page`: Page number
- `page_size`: Number of items per page (default: 20)

## 📊 Sample Data Available

The API comes pre-populated with sample data:

### Users
- **Admin**: `admin` / `admin123`
- **Patient 1**: `patient1` / `password123` (John Doe)
- **Patient 2**: `patient2` / `password123` (Jane Smith)
- **Physiotherapist 1**: `physio1` / `password123` (Dr. Sarah Johnson)
- **Physiotherapist 2**: `physio2` / `password123` (Dr. Michael Brown)

### Sample Data Includes
- ✅ 4 Books with categories and reviews
- ✅ 5 Exercises across 3 categories
- ✅ 4 Appointments (past and future)
- ✅ 2 Exercise plans with progress tracking
- ✅ User profiles and relationships
- ✅ Book bookmarks and reviews

## 🧪 Testing the API

### Get Authentication Token
```bash
curl -X POST http://localhost:12000/api-token-auth/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Use Token for Authenticated Requests
```bash
TOKEN="your_token_here"
curl -H "Authorization: Token $TOKEN" http://localhost:12000/api/users/
```

### Example CRUD Operations

#### Create a Book
```bash
curl -X POST http://localhost:12000/api/books/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "description": "Book description",
    "category": 1,
    "book_type": "educational"
  }'
```

#### Update a Book
```bash
curl -X PATCH http://localhost:12000/api/books/1/ \
  -H "Authorization: Token $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

#### Filter and Search
```bash
# Search books
curl -H "Authorization: Token $TOKEN" \
  "http://localhost:12000/api/books/?search=therapy"

# Filter by category
curl -H "Authorization: Token $TOKEN" \
  "http://localhost:12000/api/books/?category=1"

# Multiple filters
curl -H "Authorization: Token $TOKEN" \
  "http://localhost:12000/api/books/?category=1&book_type=educational&ordering=title"
```

## ✅ Features Implemented

- ✅ **Complete CRUD Operations** for all resources
- ✅ **RESTful URL Patterns** following REST conventions
- ✅ **Token-based Authentication** with proper permissions
- ✅ **Advanced Filtering** by multiple fields
- ✅ **Text Search** across relevant fields
- ✅ **Pagination** for large datasets
- ✅ **Custom Actions** (bookmarks, reviews, feedback)
- ✅ **Proper HTTP Status Codes** (200, 201, 204, 400, 401, 403, 404)
- ✅ **Data Validation** and error handling
- ✅ **Relationship Management** between entities
- ✅ **Permission-based Access Control**
- ✅ **Comprehensive API Documentation**

The Healthcare API is now fully functional and ready for use! 🎉