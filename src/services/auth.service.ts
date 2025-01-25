import axios from 'axios';
import { config } from '../config/config';
import { AuthResponse } from '../types/user.types';

class AuthService {
  private API_URL = config.API_URL;
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'user_data';

  async initAuth(): Promise<string> {
    try {
      const response = await axios.post(`${this.API_URL}/auth/init`);
      return response.data.authUrl;
    } catch (error) {
      console.error('Error initializing auth:', error);
      throw error;
    }
  }

  async checkAuthStatus(authCode: string): Promise<AuthResponse> {
    try {
      const response = await axios.get<AuthResponse>(`${this.API_URL}/auth/status/${authCode}`);
      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
        if (response.data.user) {
          this.setUser(response.data.user);
        }
      }
      return response.data;
    } catch (error) {
      console.error('Error checking auth status:', error);
      throw error;
    }
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setUser(user: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();