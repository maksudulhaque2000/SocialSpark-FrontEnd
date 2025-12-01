import api from './api';
import { ApiResponse } from '@/types';

export interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  eventId: string;
  comment: string;
  reactions: {
    userId: {
      _id: string;
      name: string;
      profileImage?: string;
    };
    type: 'like' | 'love' | 'wow' | 'sad' | 'angry';
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const commentService = {
  // Create comment
  createComment: async (
    eventId: string,
    comment: string
  ): Promise<ApiResponse<{ comment: Comment }>> => {
    const response = await api.post('/comments', { eventId, comment });
    return response.data;
  },

  // Get event comments
  getEventComments: async (
    eventId: string,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<CommentsResponse>> => {
    const response = await api.get(`/comments/event/${eventId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Update comment
  updateComment: async (
    commentId: string,
    comment: string
  ): Promise<ApiResponse<{ comment: Comment }>> => {
    const response = await api.patch(`/comments/${commentId}`, { comment });
    return response.data;
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Add reaction to comment
  addReaction: async (
    commentId: string,
    type: 'like' | 'love' | 'wow' | 'sad' | 'angry'
  ): Promise<ApiResponse<{ comment: Comment }>> => {
    const response = await api.post(`/comments/${commentId}/reaction`, { type });
    return response.data;
  },

  // Remove reaction from comment
  removeReaction: async (commentId: string): Promise<ApiResponse<{ comment: Comment }>> => {
    const response = await api.delete(`/comments/${commentId}/reaction`);
    return response.data;
  },
};
