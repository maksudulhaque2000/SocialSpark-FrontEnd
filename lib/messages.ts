import api from './api';
import { ApiResponse, Message } from '@/types';

export const messageService = {
  // Send a message
  sendMessage: async (conversationId: string, content: string): Promise<ApiResponse<{ message: Message }>> => {
    const response = await api.post('/messages', { conversationId, content });
    return response.data;
  },

  // Get messages in a conversation
  getMessages: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<ApiResponse<{ messages: Message[]; pagination: any }>> => {
    const response = await api.get(`/messages/${conversationId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (conversationId: string): Promise<ApiResponse> => {
    const response = await api.patch(`/messages/${conversationId}/read`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<ApiResponse<{ unreadCount: number }>> => {
    const response = await api.get('/messages/unread/count');
    return response.data;
  },
};
