# 🎨 SocialSpark Frontend

A modern, responsive web application for SocialSpark - A social event collaboration platform built with Next.js 15, TypeScript, and Tailwind CSS.

## 📋 Features

### User Interface
- ✅ Modern, responsive design
- ✅ Beautiful landing page
- ✅ Intuitive navigation
- ✅ Mobile-first approach
- ✅ Dark mode ready

### Authentication
- ✅ User registration with role selection
- ✅ Secure login system
- ✅ Social login UI (Google, Facebook)
- ✅ JWT token management
- ✅ Protected routes
- ✅ Auto-refresh on auth changes

### Event Features
- ✅ Browse events with filters
- ✅ Search functionality
- ✅ Event details page
- ✅ Create event (Host only)
- ✅ Join/leave events
- ✅ Event categories
- ✅ Image upload support

### Dashboard
- ✅ User Dashboard (joined events)
- ✅ Host Dashboard (hosted events)
- ✅ Admin Dashboard (platform overview)
- ✅ Statistics and analytics
- ✅ Event management

### Additional Features
- ✅ Real-time UI updates
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications (SweetAlert2)
- ✅ Pagination
- ✅ Responsive images

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Notifications**: SweetAlert2
- **Icons**: React Icons
- **Date Handling**: date-fns

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe (for payment)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# NextAuth (for authentication)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth (optional)
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Main app pages
│   │   ├── events/        # Event pages
│   │   └── dashboard/     # Dashboard pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── layout/           # Layout components (Navbar, Footer)
├── lib/                  # API services
│   ├── api.ts           # Axios instance
│   ├── auth.ts          # Auth service
│   ├── events.ts        # Event service
│   └── users.ts         # User service
├── types/               # TypeScript types
│   └── index.ts        # Type definitions
├── utils/              # Utility functions
│   └── helpers.ts     # Helper functions
├── public/            # Static assets
├── .env.local        # Environment variables
├── .env.example      # Environment variables template
├── next.config.ts    # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

## 🚀 Getting Started

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Update Backend URL**
   - After deployment, update `NEXT_PUBLIC_API_URL` to your backend URL
   - Redeploy if needed

### Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Netlify dashboard

### Deploy to Custom Server

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "socialspark-frontend" -- start
   pm2 save
   pm2 startup
   ```

## 🎯 Key Pages

### Public Pages
- `/` - Landing page
- `/events` - Browse all events
- `/events/[id]` - Event details
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/dashboard/user` - User dashboard
- `/dashboard/host` - Host dashboard (Host only)
- `/dashboard/admin` - Admin dashboard (Admin only)
- `/events/create` - Create event (Host only)

## 🔑 Demo Credentials

```
Admin:
Email: admin@gmail.com
Password: Password@123

Host:
Email: host@gmail.com
Password: Password@123

User:
Email: user@gmail.com
Password: Password@123
```

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Blue
      secondary: '#10B981',  // Green
      // Add your colors
    }
  }
}
```

### Fonts

The project uses Geist font family. To change:

```typescript
// app/layout.tsx
import { YourFont } from 'next/font/google';

const yourFont = YourFont({
  subsets: ['latin'],
  variable: '--font-your-font',
});
```

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Failed**
```bash
# Check if backend is running
# Verify NEXT_PUBLIC_API_URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**2. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**3. Environment Variables Not Working**
- Restart development server after changing `.env.local`
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Check for typos in variable names

**4. Image Upload Issues**
- Verify Cloudinary configuration in backend
- Check file size limits
- Ensure correct MIME types

**5. Authentication Issues**
- Clear browser localStorage
- Check JWT token expiration
- Verify backend API is accessible

## 📱 Responsive Design

The application is fully responsive and tested on:
- 📱 Mobile (320px - 767px)
- 📱 Tablet (768px - 1023px)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

## 🔒 Security Features

- **XSS Protection**: Input sanitization
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: JWT tokens in localStorage
- **Input Validation**: Client-side and server-side
- **Protected Routes**: Role-based access control
- **HTTPS Ready**: Production-ready security headers

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check documentation
- Review console errors

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting platform
- Tailwind CSS for styling
- React Icons for beautiful icons
- SweetAlert2 for notifications

---

**Built with ❤️ for the SocialSpark community**
