import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface SubscriptionPlan {
  _id: string;
  name: string;
  slug: 'free' | 'pro' | 'premium';
  price: number;
  duration: number;
  discountPercentage: number;
  features: string[];
  isActive: boolean;
}

export interface UserSubscription {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  planId: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  stripeSubscriptionId?: string;
}

export interface SubscribeToPlanResponse {
  subscription?: UserSubscription;
  clientSecret?: string;
  message: string;
}

// Get all active subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const response = await axios.get(`${API_URL}/subscriptions/plans`);
  return response.data.data.plans || [];
};

// Get user's current subscription
export const getUserSubscription = async (token: string): Promise<UserSubscription | null> => {
  try {
    const response = await axios.get(`${API_URL}/subscriptions/my-subscription`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data.subscription;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Subscribe to a plan
export const subscribeToPlan = async (
  planId: string,
  token: string
): Promise<SubscribeToPlanResponse> => {
  const response = await axios.post(
    `${API_URL}/subscriptions/subscribe`,
    { planId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data;
};

// Confirm subscription payment
export const confirmSubscriptionPayment = async (
  paymentIntentId: string,
  token: string
): Promise<UserSubscription> => {
  const response = await axios.post(
    `${API_URL}/subscriptions/confirm-subscription`,
    { paymentIntentId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data.subscription;
};

// Cancel subscription
export const cancelSubscription = async (token: string): Promise<void> => {
  await axios.post(
    `${API_URL}/subscriptions/cancel`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Admin: Create or update subscription plan
export const upsertSubscriptionPlan = async (
  planData: {
    planId?: string;
    name: string;
    slug: 'free' | 'pro' | 'premium';
    price: number;
    duration: number;
    discountPercentage: number;
    features: string[];
    isActive?: boolean;
  },
  token: string
): Promise<SubscriptionPlan> => {
  const response = await axios.post(
    `${API_URL}/subscriptions/plans/upsert`,
    planData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.data.plan;
};

// Admin: Get all subscriptions
export const getAllSubscriptions = async (token: string): Promise<UserSubscription[]> => {
  const response = await axios.get(`${API_URL}/subscriptions/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data.subscriptions || [];
};
