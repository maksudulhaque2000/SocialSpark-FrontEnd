import api from './api';
import { ApiResponse, WebsiteReview, PaginationData } from '@/types';

export const websiteReviewService = {
  // Create a new website review (authenticated users only)
  createReview: async (data: {
    rating: number;
    comment: string;
  }): Promise<ApiResponse<{ review: WebsiteReview }>> => {
    try {
      const response = await api.post('/website-reviews', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to create review' };
    }
  },

  // Get all approved reviews (public)
  getApprovedReviews: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<
    ApiResponse<{
      reviews: WebsiteReview[];
      pagination: PaginationData;
    }>
  > => {
    try {
      const response = await api.get('/website-reviews/approved', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch reviews' };
    }
  },

  // Get all reviews with filters (admin only)
  getAllReviews: async (params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }): Promise<
    ApiResponse<{
      reviews: WebsiteReview[];
      pagination: PaginationData;
    }>
  > => {
    try {
      const response = await api.get('/admin/reviews', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch reviews' };
    }
  },

  // Get pending reviews (admin only)
  getPendingReviews: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<
    ApiResponse<{
      reviews: WebsiteReview[];
      pagination: PaginationData;
    }>
  > => {
    try {
      const response = await api.get('/admin/reviews/pending', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to fetch pending reviews' };
    }
  },

  // Approve a review (admin only)
  approveReview: async (
    reviewId: string
  ): Promise<ApiResponse<{ review: WebsiteReview }>> => {
    try {
      const response = await api.patch(`/admin/reviews/${reviewId}/approve`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to approve review' };
    }
  },

  // Reject a review (admin only)
  rejectReview: async (reviewId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await api.patch(`/admin/reviews/${reviewId}/reject`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to reject review' };
    }
  },

  // Delete a review (admin only)
  deleteReview: async (reviewId: string): Promise<ApiResponse<null>> => {
    try {
      const response = await api.delete(`/admin/reviews/${reviewId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Failed to delete review' };
    }
  },
};
