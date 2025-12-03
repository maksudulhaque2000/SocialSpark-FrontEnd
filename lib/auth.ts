import api from './api';
import { User, ApiResponse } from '@/types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'User' | 'Host';
}

interface SocialLoginData {
  name: string;
  email: string;
  profileImage?: string;
  provider: 'google' | 'github';
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Register
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Social Login
  socialLogin: async (data: SocialLoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post('/auth/social-login', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
  },

  // Save auth data
  saveAuthData: (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
  },

  // Get saved user
  getSavedUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get saved token
  getSavedToken: (): string | null => {
    return localStorage.getItem('token');
  },
};
