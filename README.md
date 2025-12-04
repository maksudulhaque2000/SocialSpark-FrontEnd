# 🎉 SocialSpark - Event Collaboration Platform

<div align="center">

![SocialSpark Banner](https://img.shields.io/badge/SocialSpark-Event%20Platform-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A modern, full-featured social event collaboration platform where users can discover, create, and participate in events with integrated payment processing, real-time messaging, and comprehensive review systems.**

[Live Demo](https://socialspark-frontend.vercel.app) · [Backend Repository](https://github.com/maksudulhaque2000/SocialSpark-BackEnd) · [Report Bug](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd/issues) · [Request Feature](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Links](#-live-links)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Key Functionalities](#-key-functionalities)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Demo Credentials](#-demo-credentials)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**SocialSpark** is a comprehensive event management and social collaboration platform built with cutting-edge technologies. It enables users to discover events, hosts to organize gatherings, and administrators to manage the entire ecosystem. The platform features secure payment processing via Stripe, real-time messaging, interactive maps, calendar views, and a sophisticated review system.

### 🎯 Core Objectives

- **Event Discovery**: Browse and search events by category, location, date, and price
- **Social Interaction**: Comment, review, and message other users
- **Monetization**: Paid events with Stripe integration and subscription tiers
- **Role-Based Access**: Different capabilities for Users, Hosts, and Admins
- **Real-Time Features**: Live messaging, unread counts, and instant updates

---

## ✨ Features

### 🔐 Authentication & Authorization

- **Multi-Method Authentication**
  - Email/Password login with JWT tokens
  - Google OAuth integration
  - GitHub OAuth integration
  - Social login with backend synchronization
- **Role-Based Access Control**
  - User, Host, and Admin roles
  - Protected routes with automatic redirection
  - Token refresh and session management
- **Profile Management**
  - Customizable profiles with bio and interests
  - Profile image upload
  - Public profile viewing
  - Role-specific dashboards

### 🎫 Event Management

- **Comprehensive Event Creation**
  - Rich text descriptions
  - 10 event categories (Concerts, Sports, Tech Meetups, Gaming, Food & Dining, Arts & Culture, Networking, Workshops, Hiking, Other)
  - Google Maps location integration
  - Date and time scheduling
  - Participant limits
  - Pricing (free or paid events)
  - Banner image upload (max 5MB)
  - Admin approval workflow

- **Advanced Event Discovery**
  - Multi-filter search (category, location, date range, price)
  - Grid, List, and Calendar view modes
  - Featured and popular events sections
  - Real-time availability updates
  - Event status tracking (upcoming, ongoing, completed, cancelled)

- **Event Participation**
  - One-click join/leave functionality
  - Secure payment processing for paid events
  - Participant list visibility
  - Event-specific comments section
  - Post-event review and rating system

### 💳 Payment & Subscription System

- **Stripe Integration**
  - Secure payment processing
  - Payment intent creation
  - Payment confirmation workflow
  - Payment history tracking

- **Three-Tier Subscription Plans**
  - **Free Plan**: Basic platform access
  - **Pro Plan**: Enhanced features with event discounts
  - **Premium Plan**: Maximum benefits and highest discounts
  - Configurable discount percentages
  - Subscription status tracking (Active/Expired/Cancelled)
  - Admin subscription management

- **Revenue Tracking**
  - Host revenue analytics
  - Revenue breakdown by event
  - Payment history for users

### 💬 Real-Time Messaging System

- **Request-Based Messaging**
  - Send message requests to users
  - Accept/Reject request workflow
  - Cancel pending requests
  - Request count notifications

- **Direct Messaging**
  - One-on-one conversations
  - Message pagination (50 per page)
  - Unread message tracking
  - Real-time message display
  - Message read status
  - Conversation history

### ⭐ Advanced Review System

- **Event Reviews**
  - 5-star rating system
  - Written feedback (min 10 characters)
  - Review reactions (like, love, helpful, insightful)
  - Edit/Delete own reviews
  - Average rating calculation
  - Host-specific reviews

- **Website Reviews**
  - Platform feedback system
  - Admin moderation (approve/reject)
  - Public display on homepage
  - Carousel presentation

### 💭 Interactive Comment System

- **Event Comments**
  - Real-time commenting
  - Edit/Delete own comments
  - Reaction system (like, love, wow, sad, angry)
  - Pagination (20 per page)
  - User avatars with initials fallback
  - Timestamp display

### 📊 Comprehensive Dashboards

- **User Dashboard**
  - Profile overview
  - Joined events tracking
  - Upcoming and completed events count
  - Quick access to profile editing

- **Host Dashboard**
  - Hosted events management
  - Total participants count
  - Revenue tracking and breakdown
  - Event creation and editing
  - Participant list access
  - Event status updates

- **Admin Dashboard**
  - Platform-wide statistics
  - User management (block/unblock, role changes, deletion)
  - Event approval system
  - Website review moderation
  - Subscription plan management
  - Category distribution analytics
  - Recent activity tracking

### 🗺️ Google Maps Integration

- **Interactive Maps**
  - Address geocoding
  - Location markers
  - Info windows
  - Click to open in Google Maps
  - Hover instructions
  - Error handling for invalid addresses

### 🎨 UI/UX Excellence

- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimization
  - Adaptive layouts

- **Loading States**
  - Skeleton loaders for all components
  - Progressive content loading
  - Smooth transitions

- **User Feedback**
  - SweetAlert2 notifications
  - Form validation with Zod
  - Error handling and messaging
  - Success confirmations

- **Visual Components**
  - Event calendar (React Big Calendar)
  - Image upload with preview
  - Reaction buttons
  - Dynamic avatars
  - Carousels and sliders

---

## 🛠️ Tech Stack

### **Frontend Core**

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.7 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.0 | Type safety |
| Tailwind CSS | 4.0 | Styling framework |

### **Key Libraries**

| Library | Purpose |
|---------|---------|
| NextAuth v4.24.13 | Authentication (Google, GitHub OAuth) |
| Stripe (@stripe/stripe-js, @stripe/react-stripe-js) | Payment processing |
| Axios v1.13.2 | HTTP client for API calls |
| React Hook Form v7.67.0 | Form handling |
| Zod v4.1.13 | Schema validation |
| SweetAlert2 v11.26.3 | Alert notifications |
| React Icons v5.5.0 | Icon library |
| date-fns v4.1.0 | Date manipulation |
| React Big Calendar v1.15.0 | Calendar component |
| @googlemaps/js-api-loader v1.16.8 | Google Maps integration |

### **Development Tools**

- ESLint for code linting
- TypeScript for static typing
- PostCSS for CSS processing
- Tailwind CSS v4 (@tailwindcss/postcss)

---

## 🌐 Live Links

| Resource | URL |
|----------|-----|
| **Frontend Live** | [https://socialspark-frontend.vercel.app](https://socialspark-frontend.vercel.app) |
| **Backend Live** | [https://socialspark-backend-3ewo.onrender.com](https://socialspark-backend-3ewo.onrender.com) |
| **Frontend Repo** | [https://github.com/maksudulhaque2000/SocialSpark-FrontEnd](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd) |
| **Backend Repo** | [https://github.com/maksudulhaque2000/SocialSpark-BackEnd](https://github.com/maksudulhaque2000/SocialSpark-BackEnd) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- A code editor (VS Code recommended)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/maksudulhaque2000/SocialSpark-FrontEnd.git
   cd SocialSpark-FrontEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file in root directory
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration (see [Environment Variables](#-environment-variables) section)

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# ============================================
# API Configuration
# ============================================
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
# For production, use: https://socialspark-backend-3ewo.onrender.com/api

# ============================================
# Stripe Payment Configuration
# ============================================
# Stripe publishable key for client-side
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx

# ============================================
# NextAuth Configuration
# ============================================
# Application URL
NEXTAUTH_URL=http://localhost:3000
# For production, use your Vercel URL

# NextAuth secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=generate_your_own_secret_with_openssl

# ============================================
# Google OAuth
# ============================================
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxx

# ============================================
# GitHub OAuth
# ============================================
GITHUB_CLIENT_ID=Ov23xxxxxxxxxxxx
GITHUB_CLIENT_SECRET=github_pat_xxxxxxxxxxxxxxxxx
```

### Environment Variable Guide

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | Backend API endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | Stripe public key for payments |
| `NEXTAUTH_URL` | ✅ Yes | Application base URL |
| `NEXTAUTH_SECRET` | ✅ Yes | Secret for NextAuth session encryption |
| `GOOGLE_CLIENT_ID` | ⚠️ Optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ⚠️ Optional | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | ⚠️ Optional | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | ⚠️ Optional | GitHub OAuth client secret |

> **Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Keep sensitive keys private!

---

## 📁 Project Structure

```
SocialSpark-FrontEnd/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (main)/                   # Main application routes
│   │   ├── dashboard/           # Role-based dashboards
│   │   │   ├── admin/          # Admin dashboard & reviews
│   │   │   ├── host/           # Host dashboard
│   │   │   └── user/           # User dashboard
│   │   ├── events/             # Event management
│   │   │   ├── [id]/           # Event details & edit
│   │   │   └── create/         # Create event
│   │   ├── host/[id]/          # Host profile
│   │   ├── user/[id]/          # User profile
│   │   ├── profile/edit/       # Edit own profile
│   │   ├── conversations/      # Message list
│   │   └── messages/[id]/      # Chat interface
│   ├── admin/                    # Admin management pages
│   │   ├── events/             # Event management
│   │   ├── pending/            # Approval queue
│   │   ├── subscriptions/      # Subscription management
│   │   └── users/              # User management
│   ├── about/                    # About page
│   ├── pricing/                  # Subscription plans
│   ├── api/                      # API routes (NextAuth)
│   ├── layout.tsx               # Root layout with Navbar/Footer
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   └── not-found.tsx            # 404 page
│
├── components/                   # Reusable React components
│   ├── layout/                  # Layout components
│   │   ├── Navbar.tsx          # Navigation bar with auth & notifications
│   │   └── Footer.tsx          # Footer component
│   ├── EventCalendar.tsx        # Calendar view (React Big Calendar)
│   ├── EventComments.tsx        # Comment section with reactions
│   ├── EventReviews.tsx         # Review section with ratings
│   ├── GoogleMap.tsx            # Google Maps integration
│   ├── PaymentModal.tsx         # Stripe payment dialog
│   ├── SkeletonLoader.tsx       # Loading skeletons (8 variants)
│   └── SessionProviderWrapper.tsx # NextAuth session wrapper
│
├── lib/                          # Service layer & utilities
│   ├── api.ts                   # Axios instance & interceptors
│   ├── auth.ts                  # Authentication services
│   ├── events.ts                # Event CRUD operations
│   ├── users.ts                 # User management
│   ├── payments.ts              # Payment processing (Stripe)
│   ├── subscriptions.ts         # Subscription handling
│   ├── reviews.ts               # Review operations
│   ├── comments.ts              # Comment services
│   ├── conversations.ts         # Conversation management
│   ├── messages.ts              # Direct messaging
│   ├── admin.ts                 # Admin operations
│   ├── stats.ts                 # Platform statistics API
│   ├── websiteReviews.ts        # Platform review management
│   └── stripe.ts                # Stripe initialization
│
├── types/                        # TypeScript definitions
│   └── index.ts                 # Global type definitions (User, Event, Review, etc.)
│
├── utils/                        # Helper functions
│   ├── helpers.ts               # Utility functions (formatDate, formatCurrency, etc.)
│   └── sweetalert.ts            # SweetAlert2 configurations
│
├── public/                       # Static assets
│   └── favicon.ico              # App icon
│
├── .env.local                    # Environment variables (git-ignored)
├── .env.example                  # Environment template
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── eslint.config.mjs             # ESLint config
├── postcss.config.mjs            # PostCSS config
├── vercel.json                   # Vercel deployment config
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

---

## 👥 User Roles

### 1. 👤 User Role

**Capabilities:**
- ✅ Browse and search all events
- ✅ Join free and paid events
- ✅ View event details with calendar
- ✅ Comment on events with reactions
- ✅ Review completed events (5-star + written feedback)
- ✅ Send/receive message requests
- ✅ Direct messaging with other users
- ✅ Manage personal profile
- ✅ View joined events dashboard
- ✅ Subscribe to premium plans
- ✅ Track payment history

### 2. 🎭 Host Role

**All User capabilities, plus:**
- ✅ Create new events with full customization
- ✅ Edit and delete own events
- ✅ Manage event status (upcoming, ongoing, completed, cancelled)
- ✅ View participant lists
- ✅ Track event revenue
- ✅ Access revenue analytics dashboard
- ✅ Receive reviews from participants
- ✅ Submit events for admin approval

### 3. 👑 Admin Role

**All User and Host capabilities, plus:**
- ✅ **User Management**
  - View all users with pagination
  - Block/Unblock users
  - Change user roles
  - Delete user accounts
  - Search and filter users
  
- ✅ **Event Management**
  - Approve/Reject pending events
  - Force delete any event
  - View all events with filters
  - Monitor event categories
  
- ✅ **Platform Administration**
  - View comprehensive statistics
  - Manage subscription plans
  - Create/Edit/Delete plans
  - View all subscriptions
  - Moderate website reviews
  - Approve/Reject platform feedback
  
- ✅ **Analytics Dashboard**
  - Total users (with new this month)
  - Total events (with new this month)
  - Pending approvals count
  - Active hosts tracking
  - User status breakdown
  - Event status distribution
  - Category analytics

---

## 🔑 Key Functionalities

### 🎫 Event System

**Event Creation Flow:**
1. Host fills out event form (title, description, category, location, date, time, price, participants limit)
2. Upload banner image (max 5MB, jpg/png/gif)
3. Select location with Google Maps integration
4. Submit for admin approval
5. Admin approves/rejects event
6. Approved events appear in public listings

**Event Discovery:**
- **Search**: By keyword in title/description
- **Filters**: 
  - Category (10 options)
  - Location (city/area)
  - Date range
  - Price range (free to custom max)
- **View Modes**: Grid, List, Calendar
- **Sorting**: Date, Popularity, Recently added

**Event Participation:**
- Free events: Instant join
- Paid events: Stripe payment → Join on confirmation
- Subscription discounts applied automatically
- Participant list visibility
- Leave event anytime before event date

### 💳 Payment Processing

**Stripe Integration:**
```typescript
// Payment flow:
1. User clicks "Join" on paid event
2. System creates Stripe payment intent
3. Payment modal opens with Stripe Elements
4. User enters card details
5. Payment processed securely
6. On success: User added to participants
7. Host receives revenue (minus platform fee)
```

**Subscription Benefits:**
- **Free**: No discounts
- **Pro**: 10-20% off event prices
- **Premium**: 20-30% off event prices
- Monthly/Yearly billing options
- Auto-renewal with Stripe
- Cancel anytime

### 💬 Messaging System

**Request Workflow:**
```
User A → Send Request → User B
         ↓
User B reviews request
         ↓
    Accept / Reject
         ↓
If accepted: Conversation created
         ↓
Direct messaging enabled
```

**Features:**
- Real-time unread count in navbar
- Message pagination (50 per page)
- Read/Unread status
- Cancel pending requests
- Conversation list with last message preview

### ⭐ Review & Rating

**Event Reviews:**
- Only for completed events
- 5-star rating system
- Written comment (min 10 chars)
- Reactions: Like, Love, Helpful, Insightful
- Edit within 24 hours
- Delete anytime
- Average rating displayed

**Website Reviews:**
- Any user can submit
- Admin moderation required
- Star rating + comment
- Approved reviews show on homepage
- Carousel display with auto-scroll

### 📊 Analytics & Statistics

**Platform Stats (Admin):**
- Total users, events, hosts
- New users/events this month
- Pending approvals
- Active subscriptions
- Category distribution chart
- Revenue tracking

**Host Analytics:**
- Total events hosted
- Total participants
- Revenue by event
- Average rating
- Upcoming/completed breakdown

**User Analytics:**
- Events joined
- Total spent
- Subscription status
- Reviews given

---

## 🔌 API Integration

### Service Architecture

All API calls are centralized in the `lib/` directory with TypeScript interfaces:

```typescript
// Example: Event Service
export const eventService = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => apiMultipart.post('/events', data),
  updateEvent: (id, data) => apiMultipart.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  joinEvent: (id) => api.post(`/events/${id}/join`),
  leaveEvent: (id) => api.post(`/events/${id}/leave`),
};
```

### API Services

| Service | File | Purpose |
|---------|------|---------|
| Authentication | `auth.ts` | Login, register, OAuth, token management |
| Events | `events.ts` | CRUD, join/leave, search, filters |
| Users | `users.ts` | Profile management, top hosts |
| Payments | `payments.ts` | Create payment intent, confirm payment |
| Subscriptions | `subscriptions.ts` | Plans, subscribe, cancel |
| Reviews | `reviews.ts` | Create, update, delete, reactions |
| Comments | `comments.ts` | CRUD, reactions, pagination |
| Conversations | `conversations.ts` | List, requests, accept/reject |
| Messages | `messages.ts` | Send, receive, mark read |
| Admin | `admin.ts` | User management, event approval |
| Statistics | `stats.ts` | Platform analytics |
| Website Reviews | `websiteReviews.ts` | Platform feedback |

### Axios Configuration

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**Vercel** is the recommended platform for Next.js deployment with automatic CI/CD.

#### Step-by-Step:

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository: `maksudulhaque2000/SocialSpark-FrontEnd`
   
3. **Configure Build Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   
   Copy all variables from `.env.local`:
   
   ```
   NEXT_PUBLIC_API_URL=https://socialspark-backend-3ewo.onrender.com/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate_your_own_secret_with_openssl
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxx
   GITHUB_CLIENT_ID=Ov23xxxxxxxxxxxx
   GITHUB_CLIENT_SECRET=github_pat_xxxxxxxxxxxxxxxxx
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Vercel will build and deploy automatically
   - Get your live URL: `https://your-app.vercel.app`

6. **Update OAuth Redirect URLs**
   - Google Console: Add `https://your-app.vercel.app/api/auth/callback/google`
   - GitHub Settings: Add `https://your-app.vercel.app/api/auth/callback/github`

#### Continuous Deployment

Vercel automatically deploys on every push to `main` branch:
```bash
git push origin main  # Triggers automatic deployment
```

### Deploy to Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

4. **Configuration**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Environment variables**: Add in Netlify dashboard

### Deploy to Custom VPS

1. **Server Requirements**
   - Ubuntu 20.04+ or similar
   - Node.js 18+
   - Nginx (reverse proxy)
   - PM2 (process manager)

2. **Setup on Server**
   ```bash
   # Clone repository
   git clone https://github.com/maksudulhaque2000/SocialSpark-FrontEnd.git
   cd SocialSpark-FrontEnd

   # Install dependencies
   npm install

   # Create .env.local
   nano .env.local  # Add your environment variables

   # Build application
   npm run build

   # Install PM2 globally
   npm install -g pm2

   # Start with PM2
   pm2 start npm --name "socialspark-frontend" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔑 Demo Credentials

Test the platform with these pre-configured accounts:

### Admin Account
```
Email: admin@gmail.com
Password: Password@123
```
**Access**: Full platform control, user management, event approval, analytics

### Host Account
```
Email: host@gmail.com
Password: Password@123
```
**Access**: Create events, manage participants, view revenue

### User Account
```
Email: user@gmail.com
Password: Password@123
```
**Access**: Join events, messaging, reviews, comments

> **Note**: These are demo accounts for testing. In production, change these credentials!

---

## 🐛 Troubleshooting

### Common Issues

#### 1. API Connection Failed
**Problem**: Frontend can't connect to backend

**Solutions**:
```bash
# Check if backend is running
curl https://socialspark-backend-3ewo.onrender.com/api/health

# Verify .env.local
cat .env.local | grep NEXT_PUBLIC_API_URL

# Ensure CORS is configured on backend
# Backend should allow: https://socialspark-frontend.vercel.app
```

#### 2. Build Errors
**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit

# Build again
npm run build
```

#### 3. Environment Variables Not Working
**Problem**: Variables undefined in browser

**Solutions**:
- Restart dev server after changing `.env.local`
- Ensure client-side variables use `NEXT_PUBLIC_` prefix
- Check for typos in variable names
- Verify `.env.local` is in root directory (not `/app`)

#### 4. Authentication Issues
**Problem**: Login fails or token expired

**Solutions**:
```javascript
// Clear localStorage
localStorage.clear();

// Check token expiration (backend)
// Verify JWT secret matches frontend/backend

// Check NextAuth configuration
// Ensure NEXTAUTH_URL and NEXTAUTH_SECRET are set
```

#### 5. Stripe Payment Fails
**Problem**: Payment doesn't complete

**Solutions**:
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is correct
- Check Stripe dashboard for errors
- Test with card: `4242 4242 4242 4242`
- Ensure backend has correct Stripe secret key

#### 6. Image Upload Issues
**Problem**: Images not uploading

**Solutions**:
- Check file size (max 5MB)
- Verify file type (jpg, png, gif)
- Backend must have Cloudinary configured
- Check network tab for upload errors

#### 7. Google Maps Not Loading
**Problem**: Map shows blank or error

**Solutions**:
- Verify Google Maps API key (backend)
- Enable required APIs: Maps JavaScript API, Geocoding API
- Check billing on Google Cloud Console
- Whitelist your domain

---

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // Main brand color
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          500: '#10b981',  // Success/accent color
        },
        // Add custom colors
        brand: '#your-color',
      },
    },
  },
};
```

### Fonts

Change fonts in `app/layout.tsx`:

```typescript
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

// Use in className
<body className={`${inter.variable} ${roboto.variable}`}>
```

### Logo and Branding

1. Replace `public/favicon.ico` with your icon
2. Update logo in `components/layout/Navbar.tsx`
3. Change site name in `app/layout.tsx` metadata

---

## 📱 Responsive Breakpoints

Tailwind CSS breakpoints used:

| Breakpoint | Min Width | Target Devices |
|-----------|-----------|----------------|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Extra large screens |

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

---

## 🔒 Security Best Practices

### Implemented Security Measures

1. **Authentication**
   - JWT tokens with expiration
   - Secure password hashing (backend)
   - OAuth integration

2. **Data Protection**
   - Input sanitization
   - XSS prevention
   - CSRF protection

3. **API Security**
   - CORS configuration
   - Rate limiting (backend)
   - Request validation

4. **Payment Security**
   - PCI compliance via Stripe
   - No card data storage
   - Secure payment intents

5. **Route Protection**
   - Role-based access control
   - Protected API routes
   - Automatic redirects

### Security Recommendations

- Never commit `.env.local` to Git
- Use strong `NEXTAUTH_SECRET` (32+ characters)
- Enable HTTPS in production
- Regularly update dependencies
- Monitor for vulnerabilities: `npm audit`

---

## 📊 Performance Optimization

### Implemented Optimizations

1. **Image Optimization**
   - Next.js `<Image>` component
   - Automatic WebP conversion
   - Lazy loading

2. **Code Splitting**
   - Automatic route-based splitting
   - Dynamic imports for heavy components

3. **Caching**
   - Browser caching for static assets
   - API response caching (backend)

4. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Gzip compression

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork the Repository

Click the **Fork** button on GitHub: [SocialSpark-FrontEnd](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd)

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/SocialSpark-FrontEnd.git
cd SocialSpark-FrontEnd
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. Make Changes

- Write clean, documented code
- Follow existing code style
- Test your changes locally

### 5. Commit Changes

```bash
git add .
git commit -m "Add: your feature description"
# or
git commit -m "Fix: bug description"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- Clear description of changes
- Screenshots (if UI changes)
- Testing steps

### Contribution Guidelines

- ✅ Follow TypeScript best practices
- ✅ Use Tailwind CSS for styling
- ✅ Write meaningful commit messages
- ✅ Test before submitting
- ✅ Update documentation if needed

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 SocialSpark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

Special thanks to:

- **[Next.js Team](https://nextjs.org/)** - For the incredible React framework
- **[Vercel](https://vercel.com/)** - For seamless deployment platform
- **[Stripe](https://stripe.com/)** - For secure payment processing
- **[Tailwind CSS](https://tailwindcss.com/)** - For utility-first CSS framework
- **[React Icons](https://react-icons.github.io/react-icons/)** - For beautiful icon library
- **[SweetAlert2](https://sweetalert2.github.io/)** - For elegant alert notifications
- **[Axios](https://axios-http.com/)** - For reliable HTTP client
- **[React Hook Form](https://react-hook-form.com/)** - For performant form handling
- **[Google Maps Platform](https://developers.google.com/maps)** - For maps integration
- **Open Source Community** - For countless libraries and tools

---

## 📞 Support & Contact

### Get Help

- **Documentation**: Read this README thoroughly
- **Issues**: [GitHub Issues](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd/issues)
- **Discussions**: [GitHub Discussions](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd/discussions)

### Report Bugs

Found a bug? Please [create an issue](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd/issues/new) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information

### Request Features

Have an idea? [Open a feature request](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd/issues/new) with:
- Feature description
- Use case
- Mockups (if applicable)

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] Real-time notifications (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Event recommendation system
- [ ] Social sharing integration
- [ ] Video event streaming
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Event waitlist system
- [ ] Recurring events

### Future Enhancements

- Integration with more payment gateways
- AI-powered event recommendations
- Advanced search with Elasticsearch
- Event ticket generation (QR codes)
- Email notifications
- Push notifications
- Event feedback surveys
- Gamification (badges, points)

---

## 📈 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/maksudulhaque2000/SocialSpark-FrontEnd?style=social)
![GitHub Forks](https://img.shields.io/github/forks/maksudulhaque2000/SocialSpark-FrontEnd?style=social)
![GitHub Issues](https://img.shields.io/github/issues/maksudulhaque2000/SocialSpark-FrontEnd)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/maksudulhaque2000/SocialSpark-FrontEnd)
![Last Commit](https://img.shields.io/github/last-commit/maksudulhaque2000/SocialSpark-FrontEnd)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ by [Maksudulhaque2000](https://github.com/maksudulhaque2000)**

[Live Demo](https://socialspark-frontend.vercel.app) • [Backend Repo](https://github.com/maksudulhaque2000/SocialSpark-BackEnd) • [Report Issue](https://github.com/maksudulhaque2000/SocialSpark-FrontEnd/issues)

---

© 2024 SocialSpark. All rights reserved.

</div>
