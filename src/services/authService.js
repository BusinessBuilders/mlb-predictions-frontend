// Authentication service for MLB Betting System

// Use localhost for all environments to avoid ngrok routing issues
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = this.token ? this.parseToken(this.token) : null;
  }

  /**
   * Parse JWT token to extract user info
   */
  parseToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.user_id,
        username: payload.username,
        exp: payload.exp
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired() {
    if (!this.user) return true;
    return Date.now() >= this.user.exp * 1000;
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      this.setAuthData(data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      this.setAuthData(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Set authentication data
   */
  setAuthData(authData) {
    this.token = authData.access_token;
    this.user = authData.user;
    localStorage.setItem('auth_token', this.token);
  }

  /**
   * Logout user
   */
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token && !this.isTokenExpired();
  }

  /**
   * Get auth header for API requests
   */
  getAuthHeader() {
    if (!this.token) return {};
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }

  /**
   * Make authenticated API request
   */
  async apiRequest(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
      });

      if (response.status === 401) {
        // Token expired or invalid
        this.logout();
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Track usage for future subscription limits
   */
  async trackUsage(action) {
    if (!this.isAuthenticated()) return;

    try {
      await this.apiRequest('/usage/track', {
        method: 'POST',
        body: JSON.stringify({ action })
      });
    } catch (error) {
      console.warn('Usage tracking failed:', error);
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;