import api from './api';
import { ApiResponse } from '@/types';

export interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  hostId: string;
  eventId: {
    _id: string;
    title: string;
    date?: string;
  };
  rating: number;
  comment: string;
  reactions?: {
    userId: {
      _id: string;
      name: string;
      profileImage?: string;
    };
    type: 'like' | 'love' | 'helpful' | 'insightful';
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export const reviewService = {
  // Create review
  createReview: async (data: {
    eventId: string;
    hostId: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<{ review: Review }>> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Get host reviews
  getHostReviews: async (hostId: string): Promise<ApiResponse<ReviewsResponse>> => {
    const response = await api.get(`/reviews/host/${hostId}`);
    return response.data;
  },

  // Get event reviews
  getEventReviews: async (eventId: string): Promise<ApiResponse<ReviewsResponse>> => {
    const response = await api.get(`/reviews/event/${eventId}`);
    return response.data;
  },

  // Update review
  updateReview: async (
    reviewId: string,
    data: { rating?: number; comment?: string }
  ): Promise<ApiResponse<{ review: Review }>> => {
    const response = await api.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // Add reaction to review
  addReaction: async (
    reviewId: string,
    type: 'like' | 'love' | 'helpful' | 'insightful'
  ): Promise<ApiResponse<{ review: Review }>> => {
    const response = await api.post(`/reviews/${reviewId}/reaction`, { type });
    return response.data;
  },

  // Remove reaction from review
  removeReaction: async (reviewId: string): Promise<ApiResponse<{ review: Review }>> => {
    const response = await api.delete(`/reviews/${reviewId}/reaction`);
    return response.data;
  },
};
