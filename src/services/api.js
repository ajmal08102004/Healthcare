// Enhanced API service for Healthcare application
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:12000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Set authentication tokens
  setToken(token, refreshToken = null) {
    this.token = token;
    localStorage.setItem('authToken', token);
    
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Remove authentication tokens
  removeToken() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }

  // Get headers with authentication
  getHeaders(isFormData = false) {
    const headers = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }
    
    return headers;
  }

  // Process failed queue after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Handle token refresh
  async refreshAuthToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access, data.refresh);
        this.processQueue(null, data.access);
        return data.access;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      this.processQueue(error, null);
      this.removeToken();
      // Redirect to login
      window.location.href = '/login';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Enhanced error handling
  handleApiError(error, response) {
    const errorInfo = {
      message: 'An unexpected error occurred',
      status: response?.status,
      details: null,
    };

    if (response?.status === 401) {
      errorInfo.message = 'Authentication required';
      this.removeToken();
      window.location.href = '/login';
    } else if (response?.status === 403) {
      errorInfo.message = 'Access denied';
    } else if (response?.status === 404) {
      errorInfo.message = 'Resource not found';
    } else if (response?.status === 422) {
      errorInfo.message = 'Validation error';
    } else if (response?.status >= 500) {
      errorInfo.message = 'Server error. Please try again later.';
    }

    if (error.details) {
      errorInfo.details = error.details;
    }

    return errorInfo;
  }

  // Generic API request method with retry logic
  async request(endpoint, options = {}, retryCount = 0) {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: this.getHeaders(isFormData),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 errors with token refresh
      if (response.status === 401 && this.refreshToken && retryCount === 0) {
        try {
          await this.refreshAuthToken();
          return this.request(endpoint, options, retryCount + 1);
        } catch (refreshError) {
          throw refreshError;
        }
      }
      
      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        
        const error = new Error(errorData.message || errorData.detail || errorData.error || 'Request failed');
        error.status = response.status;
        error.details = errorData;
        
        throw error;
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', {
        url,
        method: config.method || 'GET',
        error: error.message,
        status: error.status,
      });
      
      // Add retry logic for network errors
      if (!error.status && retryCount < 2) {
        console.log(`Retrying request (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.request(endpoint, options, retryCount + 1);
      }
      
      throw this.handleApiError(error, { status: error.status });
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
      // Try the enhanced login endpoint first
      const response = await this.post('/auth/login/', credentials);
      if (response.token) {
        this.setToken(response.token, response.refresh_token);
        return response;
      }
      return response;
    } catch (error) {
      // Fallback to token auth endpoint
      try {
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
          
          // Get user details after successful login
          try {
            const userResponse = await this.getCurrentUser();
            return { ...data, user: userResponse };
          } catch (userError) {
            return data;
          }
        }
        
        const errorData = await tokenResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || 'Login failed');
      } catch (fallbackError) {
        throw error; // Throw original error if fallback also fails
      }
    }
  }

  async register(userData) {
    try {
      const response = await this.post('/auth/register/', userData);
      if (response.token) {
        this.setToken(response.token, response.refresh_token);
      }
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.post('/auth/logout/');
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.removeToken();
    }
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password/', { email });
  }

  async resetPassword(token, newPassword) {
    return this.post('/auth/reset-password/', { token, password: newPassword });
  }

  async verifyEmail(token) {
    return this.post('/auth/verify-email/', { token });
  }

  async resendVerification(email) {
    return this.post('/auth/resend-verification/', { email });
  }

  // User methods
  async getCurrentUser() {
    try {
      return await this.get('/auth/profile/');
    } catch (error) {
      // Fallback to users endpoint
      return this.get('/users/me/');
    }
  }

  async updateCurrentUser(data) {
    try {
      return await this.put('/auth/profile/', data);
    } catch (error) {
      // Fallback to users endpoint
      return this.patch('/users/me/', data);
    }
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

  async deleteUser(id) {
    return this.delete(`/users/${id}/`);
  }

  async getPhysiotherapists(params = {}) {
    return this.get('/auth/physiotherapists/', params);
  }

  async searchUsers(query, userType = null) {
    const params = { search: query };
    if (userType) params.user_type = userType;
    return this.get('/users/', params);
  }

  // Profile methods
  async getProfile() {
    return this.getCurrentUser();
  }

  async updateProfile(data) {
    return this.updateCurrentUser(data);
  }

  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    return this.request('/auth/profile/', {
      method: 'PATCH',
      body: formData,
    });
  }

  async changePassword(data) {
    return this.post('/auth/change-password/', data);
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

  async cancelAppointment(id, reason = '') {
    return this.patch(`/appointments/${id}/`, {
      status: 'cancelled',
      cancellation_reason: reason,
    });
  }

  async rescheduleAppointment(id, newDate, newStartTime, newEndTime) {
    return this.patch(`/appointments/${id}/`, {
      date: newDate,
      start_time: newStartTime,
      end_time: newEndTime,
      status: 'rescheduled',
    });
  }

  async getUpcomingAppointments(params = {}) {
    return this.get('/appointments/', { 
      ...params, 
      status: 'scheduled,confirmed',
      ordering: 'date,start_time' 
    });
  }

  async getPastAppointments(params = {}) {
    return this.get('/appointments/', { 
      ...params, 
      status: 'completed,cancelled,no_show',
      ordering: '-date,-start_time' 
    });
  }

  async getTodaysAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.get('/appointments/', { 
      date: today,
      ordering: 'start_time' 
    });
  }

  async getAppointmentsByDateRange(startDate, endDate, params = {}) {
    return this.get('/appointments/', {
      ...params,
      date__gte: startDate,
      date__lte: endDate,
      ordering: 'date,start_time'
    });
  }

  async getAvailableTimeSlots(physiotherapistId, date) {
    return this.get(`/appointments/available-slots/`, {
      physiotherapist: physiotherapistId,
      date: date,
    });
  }

  // Appointment feedback methods
  async addAppointmentFeedback(appointmentId, feedbackData) {
    return this.post(`/appointments/${appointmentId}/feedback/`, feedbackData);
  }

  async updateAppointmentFeedback(appointmentId, feedbackData) {
    return this.patch(`/appointments/${appointmentId}/feedback/`, feedbackData);
  }

  async getAppointmentFeedback(appointmentId) {
    return this.get(`/appointments/${appointmentId}/feedback/`);
  }

  // Appointment documents
  async uploadAppointmentDocument(appointmentId, file, documentType, title) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('title', title);
    
    return this.request(`/appointments/${appointmentId}/documents/`, {
      method: 'POST',
      body: formData,
    });
  }

  async getAppointmentDocuments(appointmentId) {
    return this.get(`/appointments/${appointmentId}/documents/`);
  }

  async deleteAppointmentDocument(appointmentId, documentId) {
    return this.delete(`/appointments/${appointmentId}/documents/${documentId}/`);
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

  async searchExercises(query, params = {}) {
    return this.get('/exercises/', { ...params, search: query });
  }

  async getExercisesByCategory(categoryId, params = {}) {
    return this.get('/exercises/', { ...params, category: categoryId });
  }

  async getExercisesByDifficulty(difficulty, params = {}) {
    return this.get('/exercises/', { ...params, difficulty });
  }

  async getExercisesByBodyPart(bodyPart, params = {}) {
    return this.get('/exercises/', { ...params, target_body_parts: bodyPart });
  }

  async uploadExerciseImage(exerciseId, file) {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.request(`/exercises/${exerciseId}/`, {
      method: 'PATCH',
      body: formData,
    });
  }

  // Exercise categories
  async getExerciseCategories(params = {}) {
    return this.get('/exercise-categories/', params);
  }

  async getExerciseCategory(id) {
    return this.get(`/exercise-categories/${id}/`);
  }

  async createExerciseCategory(data) {
    return this.post('/exercise-categories/', data);
  }

  async updateExerciseCategory(id, data) {
    return this.patch(`/exercise-categories/${id}/`, data);
  }

  async deleteExerciseCategory(id) {
    return this.delete(`/exercise-categories/${id}/`);
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

  async getMyExercisePlans() {
    return this.get('/exercise-plans/', { patient: 'me' });
  }

  async getActiveExercisePlans() {
    return this.get('/exercise-plans/', { status: 'active' });
  }

  async activateExercisePlan(id) {
    return this.patch(`/exercise-plans/${id}/`, { status: 'active' });
  }

  async pauseExercisePlan(id) {
    return this.patch(`/exercise-plans/${id}/`, { status: 'paused' });
  }

  async completeExercisePlan(id) {
    return this.patch(`/exercise-plans/${id}/`, { status: 'completed' });
  }

  // Exercise plan items
  async getExercisePlanItems(planId) {
    return this.get(`/exercise-plans/${planId}/items/`);
  }

  async addExerciseToPlan(planId, exerciseData) {
    return this.post(`/exercise-plans/${planId}/items/`, exerciseData);
  }

  async updateExercisePlanItem(planId, itemId, data) {
    return this.patch(`/exercise-plans/${planId}/items/${itemId}/`, data);
  }

  async removeExerciseFromPlan(planId, itemId) {
    return this.delete(`/exercise-plans/${planId}/items/${itemId}/`);
  }

  async getTodaysExercises() {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return this.get('/exercise-plan-items/', { 
      day_of_week: today,
      exercise_plan__status: 'active'
    });
  }

  async getWeeklyExerciseSchedule(planId) {
    return this.get(`/exercise-plans/${planId}/weekly-schedule/`);
  }

  // Exercise progress
  async getExerciseProgress(params = {}) {
    return this.get('/exercise-progress/', params);
  }

  async getExerciseProgressByPlan(planId) {
    return this.get('/exercise-progress/', { exercise_plan_item__exercise_plan: planId });
  }

  async createExerciseProgress(data) {
    return this.post('/exercise-progress/', data);
  }

  async updateExerciseProgress(id, data) {
    return this.patch(`/exercise-progress/${id}/`, data);
  }

  async deleteExerciseProgress(id) {
    return this.delete(`/exercise-progress/${id}/`);
  }

  async getMyExerciseProgress(params = {}) {
    return this.get('/exercise-progress/', { ...params, patient: 'me' });
  }

  async getExerciseProgressStats(planId = null) {
    const params = planId ? { plan_id: planId } : {};
    return this.get('/exercise-progress/stats/', params);
  }

  async getExerciseStreaks() {
    return this.get('/exercise-progress/streaks/');
  }

  // Analytics and reports
  async getExerciseAnalytics(params = {}) {
    return this.get('/analytics/exercises/', params);
  }

  async getAppointmentAnalytics(params = {}) {
    return this.get('/analytics/appointments/', params);
  }

  async getPatientProgressReport(patientId, params = {}) {
    return this.get(`/analytics/patients/${patientId}/progress/`, params);
  }

  async getDashboardStats() {
    return this.get('/analytics/dashboard/');
  }

  // Notifications
  async getNotifications(params = {}) {
    return this.get('/notifications/', params);
  }

  async markNotificationAsRead(id) {
    return this.patch(`/notifications/${id}/`, { is_read: true });
  }

  async markAllNotificationsAsRead() {
    return this.post('/notifications/mark-all-read/');
  }

  async deleteNotification(id) {
    return this.delete(`/notifications/${id}/`);
  }

  // Chat/Messaging
  async getConversations(params = {}) {
    return this.get('/chat/conversations/', params);
  }

  async getConversation(id) {
    return this.get(`/chat/conversations/${id}/`);
  }

  async createConversation(data) {
    return this.post('/chat/conversations/', data);
  }

  async getMessages(conversationId, params = {}) {
    return this.get(`/chat/conversations/${conversationId}/messages/`, params);
  }

  async sendMessage(conversationId, message) {
    return this.post(`/chat/conversations/${conversationId}/messages/`, { message });
  }

  async markMessagesAsRead(conversationId) {
    return this.post(`/chat/conversations/${conversationId}/mark-read/`);
  }

  // Utility methods
  async healthCheck() {
    return this.get('/health/');
  }

  async getSystemInfo() {
    return this.get('/system/info/');
  }

  // File upload helper
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  // Batch operations
  async batchUpdate(endpoint, updates) {
    return this.post(`${endpoint}/batch-update/`, { updates });
  }

  async batchDelete(endpoint, ids) {
    return this.post(`${endpoint}/batch-delete/`, { ids });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;