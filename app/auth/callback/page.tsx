'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const backendToken = session.backendToken;
      const backendUser = session.backendUser;

      if (backendToken && backendUser) {
        // Save to localStorage
        localStorage.setItem('token', backendToken);
        localStorage.setItem('user', JSON.stringify(backendUser));
        
        // Dispatch auth-change event
        window.dispatchEvent(new Event('auth-change'));

        // Redirect based on role
        const role = backendUser.role.toLowerCase();
        router.push(`/dashboard/${role}`);
      } else {
        // If no backend data, redirect to login
        router.push('/login');
      }
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
