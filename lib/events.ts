import api, { apiMultipart } from './api';
import { Event, ApiResponse, EventsResponse } from '@/types';

interface EventFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

export const eventService = {
  // Get all events
  getEvents: async (filters?: EventFilters): Promise<ApiResponse<EventsResponse>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },

  // Get single event
  getEvent: async (id: string): Promise<ApiResponse<{ event: Event }>> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (formData: FormData): Promise<ApiResponse<{ event: Event }>> => {
    const token = localStorage.getItem('token');
    const instance = apiMultipart({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await instance.post('/events', formData);
    return response.data;
  },

  // Update event
  updateEvent: async (id: string, formData: FormData): Promise<ApiResponse<{ event: Event }>> => {
    const token = localStorage.getItem('token');
    const instance = apiMultipart({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await instance.patch(`/events/${id}`, formData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Join event
  joinEvent: async (id: string): Promise<ApiResponse<{ event: Event }>> => {
    const response = await api.post(`/events/${id}/join`);
    return response.data;
  },

  // Leave event
  leaveEvent: async (id: string): Promise<ApiResponse> => {
    const response = await api.post(`/events/${id}/leave`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<ApiResponse<{ categories: string[] }>> => {
    const response = await api.get('/events/categories');
    return response.data;
  },
};
