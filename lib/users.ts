import api, { apiMultipart } from './api';
import { User, Event, ApiResponse } from '@/types';
import { Review } from './reviews';

export interface HostProfile {
  profile: User;
  statistics: {
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    totalParticipants: number;
    averageRating: number;
    totalReviews: number;
  };
  events: Event[];
  reviews: Review[];
}

export const userService = {
  // Get user by ID
  getUser: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Get host profile with statistics
  getHostProfile: async (id: string): Promise<ApiResponse<HostProfile>> => {
    const response = await api.get(`/users/${id}/profile`);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, formData: FormData): Promise<ApiResponse<{ user: User }>> => {
    const token = localStorage.getItem('token');
    const instance = apiMultipart({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await instance.patch(`/users/${id}`, formData);
    return response.data;
  },

  // Get user events
  getUserEvents: async (id: string): Promise<ApiResponse<{ events: Event[] }>> => {
    const response = await api.get(`/users/${id}/events`);
    return response.data;
  },

  // Get user hosted events
  getUserHostedEvents: async (id: string): Promise<ApiResponse<{ events: Event[] }>> => {
    const response = await api.get(`/users/${id}/hosted-events`);
    return response.data;
  },

  // Get top hosts
  getTopHosts: async (): Promise<ApiResponse<{ hosts: User[] }>> => {
    const response = await api.get('/users/top-hosts');
    return response.data;
  },
};
