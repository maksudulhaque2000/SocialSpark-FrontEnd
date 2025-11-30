export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Host' | 'Admin';
  profileImage?: string;
  bio?: string;
  interests?: string[];
  isVerified: boolean;
  isActive: boolean;
  hostedEvents?: Event[];
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  time: string;
  hostId: User | string;
  image?: string;
  bannerImage?: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  isPaid: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: (User | string)[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  userId: User | string;
  hostId: User | string;
  eventId: Event | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  userId: string;
  eventId: string;
  amount: number;
  stripePaymentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface EventsResponse {
  events: Event[];
  pagination: PaginationData;
}

export interface ReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export type UserRole = 'User' | 'Host' | 'Admin';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export const EVENT_CATEGORIES = [
  'Concerts',
  'Sports',
  'Hiking',
  'Tech Meetups',
  'Gaming',
  'Food & Dining',
  'Arts & Culture',
  'Networking',
  'Workshops',
  'Other',
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];
