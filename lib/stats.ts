import api from './api';
import { ApiResponse, PlatformStats } from '@/types';

export const statsService = {
  // Get platform statistics
  getStats: async (): Promise<ApiResponse<PlatformStats>> => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch statistics' };
    }
  },
};
