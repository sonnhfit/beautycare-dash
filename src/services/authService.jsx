import axios from 'axios';
import API_CONFIG from '../config/apiConfig';

// Base URL for API - using centralized configuration
const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Login user with username and password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise} User data and tokens
   */
  async login(username, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/token/`, {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      // Store tokens and user data
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        tokens: { access, refresh },
        user,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
      } else if (error.response?.status === 400) {
        throw new Error('Dữ liệu đăng nhập không hợp lệ.');
      } else {
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  /**
   * Verify token validity
   * @returns {Promise<boolean>}
   */
  async verifyToken() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;

      await axios.post(`${API_BASE_URL}/token/verify/`, {
        token,
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Refresh access token
   * @returns {Promise<string|null>} New access token or null
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return null;

      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      this.logout();
      return null;
    }
  },

  /**
   * Get user profile from API
   * @returns {Promise} User profile data
   */
  async getUserProfile() {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy thông tin người dùng.');
    }
  },
};

export default api;
