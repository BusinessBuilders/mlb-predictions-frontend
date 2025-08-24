// Supabase service for MLB Betting System
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Use localhost for all environments to avoid ngrok routing issues
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

class SupabaseAuthService {
  constructor() {
    this.user = null;
    this.session = null;
    
    // Get initial session
    this.getSession();
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.session = session;
      this.user = session?.user || null;
      console.log('Auth state changed:', event, this.user?.email);
    });
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      this.session = session;
      this.user = session?.user || null;
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      console.log('🔧 Attempting Supabase registration for:', userData.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username
          }
        }
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }

      console.log('✅ Supabase registration successful');

      // User profile is automatically created by database trigger
      // No need to manually update profile here

      return {
        user: data.user,
        session: data.session
      };
    } catch (error) {
      console.error('🚨 Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user (supports both email and username)
   */
  async login(credentials) {
    try {
      let email = credentials.email;
      
      // If no email provided and looks like username, convert username to email format
      if (!email && credentials.username) {
        console.log('🔍 Converting username to email format:', credentials.username);
        
        // Simple approach: if it doesn't contain @, assume it's a username and try common format
        if (!credentials.username.includes('@')) {
          // Try the format we know exists: username + "@gmail.com"
          email = `${credentials.username}1210@gmail.com`;
          console.log('✅ Trying email format:', email);
        } else {
          email = credentials.username;
        }
      }
      
      if (!email) {
        throw new Error('Email or username required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: credentials.password
      });

      if (error) {
        // If login failed and we converted username, try original as email
        if (credentials.username && !credentials.username.includes('@')) {
          console.log('🔄 Retrying with different email format...');
          throw new Error(`Login failed. Try using your email address instead of username.`);
        }
        throw error;
      }

      return {
        user: data.user,
        session: data.session
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      this.user = null;
      this.session = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          ...profileData
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
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
    return !!this.user && !!this.session;
  }

  /**
   * Get auth header for API requests
   */
  getAuthHeader() {
    if (!this.session?.access_token) return {};
    return {
      'Authorization': `Bearer ${this.session.access_token}`
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
      // Use localhost for all environments to avoid ngrok routing issues  
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
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
   * Get predictions from Supabase directly
   */
  async getPredictions(date = null, limit = 50) {
    try {
      let query = supabase
        .from('ultimate_game_predictions')
        .select('*')
        .order('prediction_timestamp', { ascending: false })
        .limit(limit);

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  }

  /**
   * Get hot batter data from Supabase directly
   */
  async getHotBatters(date = null) {
    try {
      let query = supabase
        .from('enhanced_game_situations')
        .select('*')
        .order('created_at', { ascending: false });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching hot batters:', error);
      throw error;
    }
  }

  /**
   * Track usage
   */
  async trackUsage(action) {
    if (!this.isAuthenticated()) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: this.user.id,
          date: today,
          predictions_viewed: action === 'prediction_view' ? 1 : 0,
          api_calls: action === 'api_call' ? 1 : 0
        });

      if (error) throw error;
    } catch (error) {
      console.warn('Usage tracking failed:', error);
    }
  }
}

// Create singleton instance
const supabaseAuthService = new SupabaseAuthService();

export default supabaseAuthService;