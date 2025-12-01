import api from './api';
import { ApiResponse } from '@/types';

// Dashboard Statistics
export const adminService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============= USER MANAGEMENT =============
  
  // Get all users
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Toggle user status (block/unblock)
  toggleUserStatus: async (userId: string): Promise<ApiResponse> => {
    try {
      const response = await api.patch(`/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId: string, role: string): Promise<ApiResponse> => {
    try {
      const response = await api.patch(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ============= EVENT MANAGEMENT =============

  // Get all events
  getAllEvents: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    isApproved?: boolean;
    hostId?: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.get('/admin/events', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending approval events
  getPendingEvents: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> => {
    try {
      const response = await api.get('/admin/events/pending', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve event
  approveEvent: async (eventId: string): Promise<ApiResponse> => {
    try {
      const response = await api.patch(`/admin/events/${eventId}/approve`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reject event
  rejectEvent: async (eventId: string, reason?: string): Promise<ApiResponse> => {
    try {
      const response = await api.patch(`/admin/events/${eventId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Force delete event
  forceDeleteEvent: async (eventId: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/admin/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
