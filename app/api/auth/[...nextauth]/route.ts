import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === 'google' || account?.provider === 'github') {
          // Send to backend for social login
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${apiUrl}/auth/social-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name || '',
              email: user.email || '',
              profileImage: user.image || undefined,
              provider: account.provider,
            }),
          });

          if (!response.ok) {
            console.error('Backend social login failed:', await response.text());
            return false;
          }

          const data = await response.json();
          
          if (data.success && data.data) {
            // Store token and user in user object to pass to JWT callback
            user.backendToken = data.data.token;
            user.backendUser = data.data.user;
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error('Social sign-in error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Add backend token and user to JWT
      if (user) {
        token.backendToken = user.backendToken;
        token.backendUser = user.backendUser;
      }
      return token;
    },
    async session({ session, token }) {
      // Add backend data to session
      session.backendToken = token.backendToken;
      session.backendUser = token.backendUser;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to a custom callback page that will handle localStorage
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/auth/callback`;
      }
      return `${baseUrl}/auth/callback`;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
