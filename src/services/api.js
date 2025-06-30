// API service for Healthcare application
const API_BASE_URL = 'http://localhost:12000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    
    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication methods
  async login(credentials) {
    try {
      const response = await this.post('/auth/login/', credentials);
      if (response.token) {
        this.setToken(response.token);
      }
      return response;
    } catch (error) {
      // Try token auth endpoint if login endpoint fails
      const tokenResponse = await fetch(`${this.baseURL}-token-auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.email || credentials.username,
          password: credentials.password,
        }),
      });
      
      if (tokenResponse.ok) {
        const data = await tokenResponse.json();
        this.setToken(data.token);
        return data;
      }
      
      throw error;
    }
  }

  async register(userData) {
    return this.post('/auth/register/', userData);
  }

  async logout() {
    try {
      await this.post('/auth/logout/');
    } finally {
      this.removeToken();
    }
  }

  // User methods
  async getCurrentUser() {
    return this.get('/users/me/');
  }

  async getUsers(params = {}) {
    return this.get('/users/', params);
  }

  async getUser(id) {
    return this.get(`/users/${id}/`);
  }

  async updateUser(id, data) {
    return this.patch(`/users/${id}/`, data);
  }

  async getPhysiotherapists() {
    return this.get('/users/physiotherapists/');
  }

  // Books methods
  async getBooks(params = {}) {
    return this.get('/books/', params);
  }

  async getBook(id) {
    return this.get(`/books/${id}/`);
  }

  async createBook(data) {
    return this.post('/books/', data);
  }

  async updateBook(id, data) {
    return this.patch(`/books/${id}/`, data);
  }

  async deleteBook(id) {
    return this.delete(`/books/${id}/`);
  }

  async bookmarkBook(id) {
    return this.post(`/books/${id}/bookmark/`);
  }

  async removeBookmark(id) {
    return this.delete(`/books/${id}/bookmark/`);
  }

  async addBookReview(id, reviewData) {
    return this.post(`/books/${id}/review/`, reviewData);
  }

  async getBookReviews(id) {
    return this.get(`/books/${id}/reviews/`);
  }

  // Book categories
  async getBookCategories() {
    return this.get('/categories/');
  }

  async createBookCategory(data) {
    return this.post('/categories/', data);
  }

  // Appointments methods
  async getAppointments(params = {}) {
    return this.get('/appointments/', params);
  }

  async getAppointment(id) {
    return this.get(`/appointments/${id}/`);
  }

  async createAppointment(data) {
    return this.post('/appointments/', data);
  }

  async updateAppointment(id, data) {
    return this.patch(`/appointments/${id}/`, data);
  }

  async deleteAppointment(id) {
    return this.delete(`/appointments/${id}/`);
  }

  async getUpcomingAppointments() {
    return this.get('/appointments/upcoming/');
  }

  async getPastAppointments() {
    return this.get('/appointments/past/');
  }

  async addAppointmentFeedback(id, feedbackData) {
    return this.post(`/appointments/${id}/add_feedback/`, feedbackData);
  }

  // Exercises methods
  async getExercises(params = {}) {
    return this.get('/exercises/', params);
  }

  async getExercise(id) {
    return this.get(`/exercises/${id}/`);
  }

  async createExercise(data) {
    return this.post('/exercises/', data);
  }

  async updateExercise(id, data) {
    return this.patch(`/exercises/${id}/`, data);
  }

  async deleteExercise(id) {
    return this.delete(`/exercises/${id}/`);
  }

  // Exercise categories
  async getExerciseCategories() {
    return this.get('/exercise-categories/');
  }

  // Exercise plans
  async getExercisePlans(params = {}) {
    return this.get('/exercise-plans/', params);
  }

  async getExercisePlan(id) {
    return this.get(`/exercise-plans/${id}/`);
  }

  async createExercisePlan(data) {
    return this.post('/exercise-plans/', data);
  }

  async updateExercisePlan(id, data) {
    return this.patch(`/exercise-plans/${id}/`, data);
  }

  async deleteExercisePlan(id) {
    return this.delete(`/exercise-plans/${id}/`);
  }

  async addExerciseToPlan(planId, exerciseData) {
    return this.post(`/exercise-plans/${planId}/add_exercise/`, exerciseData);
  }

  // Exercise progress
  async getExerciseProgress(params = {}) {
    return this.get('/exercise-progress/', params);
  }

  async createExerciseProgress(data) {
    return this.post('/exercise-progress/', data);
  }

  async updateExerciseProgress(id, data) {
    return this.patch(`/exercise-progress/${id}/`, data);
  }

  // Profile methods
  async getPatientProfile() {
    return this.get('/auth/patient-profile/');
  }

  async updatePatientProfile(data) {
    return this.put('/auth/patient-profile/', data);
  }

  async getPhysiotherapistProfile() {
    return this.get('/auth/physiotherapist-profile/');
  }

  async updatePhysiotherapistProfile(data) {
    return this.put('/auth/physiotherapist-profile/', data);
  }

  async changePassword(data) {
    return this.post('/auth/change-password/', data);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;