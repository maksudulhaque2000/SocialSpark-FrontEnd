import api from './api';
import { ApiResponse } from '@/types';

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export interface Payment {
  _id: string;
  userId: string;
  eventId: {
    _id: string;
    title: string;
    date: string;
    location: string;
    bannerImage?: string;
  };
  amount: number;
  stripePaymentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface HostRevenue {
  totalRevenue: number;
  totalPayments: number;
  revenueByEvent: Array<{
    event: {
      _id: string;
      title: string;
      date: string;
    };
    revenue: number;
    paymentCount: number;
  }>;
}

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (eventId: string): Promise<ApiResponse<PaymentIntent>> => {
    const response = await api.post('/payments/create-intent', { eventId });
    return response.data;
  },

  // Confirm payment and join event
  confirmPaymentAndJoin: async (paymentIntentId: string): Promise<ApiResponse<{ event: unknown }>> => {
    const response = await api.post('/payments/confirm-and-join', { paymentIntentId });
    return response.data;
  },

  // Get user payments
  getUserPayments: async (userId: string): Promise<ApiResponse<{ payments: Payment[] }>> => {
    const response = await api.get(`/payments/user/${userId}`);
    return response.data;
  },

  // Get host revenue
  getHostRevenue: async (hostId: string): Promise<ApiResponse<HostRevenue>> => {
    const response = await api.get(`/payments/host/${hostId}/revenue`);
    return response.data;
  },
};
