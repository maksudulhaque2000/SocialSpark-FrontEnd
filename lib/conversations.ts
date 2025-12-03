import api from './api';
import { ApiResponse, Conversation } from '@/types';

export const conversationService = {
  // Send message request
  sendRequest: async (receiverId: string): Promise<ApiResponse<{ conversation: Conversation }>> => {
    const response = await api.post('/conversations/request', { receiverId });
    return response.data;
  },

  // Cancel message request
  cancelRequest: async (receiverId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/conversations/cancel/${receiverId}`);
    return response.data;
  },

  // Get pending requests
  getRequests: async (): Promise<ApiResponse<{ requests: Conversation[] }>> => {
    const response = await api.get('/conversations/requests');
    return response.data;
  },

  // Accept message request
  acceptRequest: async (conversationId: string): Promise<ApiResponse<{ conversation: Conversation }>> => {
    const response = await api.patch(`/conversations/${conversationId}/accept`);
    return response.data;
  },

  // Reject message request
  rejectRequest: async (conversationId: string): Promise<ApiResponse<{ conversation: Conversation }>> => {
    const response = await api.patch(`/conversations/${conversationId}/reject`);
    return response.data;
  },

  // Get all conversations
  getConversations: async (): Promise<ApiResponse<{ conversations: Conversation[] }>> => {
    const response = await api.get('/conversations');
    return response.data;
  },

  // Get specific conversation
  getConversation: async (conversationId: string): Promise<ApiResponse<{ conversation: Conversation }>> => {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data;
  },

  // Check if conversation exists with a user
  checkConversation: async (userId: string): Promise<ApiResponse<{ exists: boolean; conversation: Conversation | null }>> => {
    const response = await api.get(`/conversations/check/${userId}`);
    return response.data;
  },
};
