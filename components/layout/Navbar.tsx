'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiMessageCircle } from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { messageService } from '@/lib/messages';
import { conversationService } from '@/lib/conversations';
import { User } from '@/types';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const savedUser = authService.getSavedUser();
    setUser(savedUser);

    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUser = authService.getSavedUser();
      setUser(updatedUser);
      if (!updatedUser) {
        setUnreadCount(0);
        setRequestCount(0);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchCounts();
      // Poll for counts every 30 seconds
      const interval = setInterval(fetchCounts, 30000);
      
      // Listen for unread count changes
      const handleUnreadCountChanged = () => {
        fetchCounts();
      };
      window.addEventListener('unread-count-changed', handleUnreadCountChanged);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('unread-count-changed', handleUnreadCountChanged);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCounts = async () => {
    try {
      const [unreadResponse, requestsResponse] = await Promise.all([
        messageService.getUnreadCount(),
        conversationService.getRequests(),
      ]);
      
      if (unreadResponse.success && unreadResponse.data) {
        setUnreadCount(unreadResponse.data.unreadCount);
      }
      
      if (requestsResponse.success && requestsResponse.data) {
        setRequestCount(requestsResponse.data.requests.length);
      }
    } catch (error) {
      console.error('Failed to fetch counts:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUnreadCount(0);
    setRequestCount(0);
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Social</span>
              <span className="text-2xl font-bold text-gray-800">Spark</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/events" className="text-gray-700 hover:text-blue-600 transition">
              Events
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition">
              Pricing
            </Link>
            {user?.role === 'Host' && (
              <>
                <Link href="/events/create" className="text-gray-700 hover:text-blue-600 transition">
                  Create Event
                </Link>
                <Link href={`/host/${user.id}`} className="text-gray-700 hover:text-blue-600 transition">
                  My Profile
                </Link>
              </>
            )}
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
              About
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/messages"
                  className="relative text-gray-700 hover:text-purple-600 transition"
                  title={`${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}, ${requestCount} pending request${requestCount !== 1 ? 's' : ''}`}
                >
                  <FiMessageCircle className="w-6 h-6" />
                  {(unreadCount + requestCount) > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {(unreadCount + requestCount) > 9 ? '9+' : (unreadCount + requestCount)}
                    </span>
                  )}
                </Link>
                <Link
                  href={`/dashboard/${user.role.toLowerCase()}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <FiUser className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/events"
              className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            {user?.role === 'Host' && (
              <>
                <Link
                  href="/events/create"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Create Event
                </Link>
                <Link
                  href={`/host/${user.id}`}
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            {user ? (
              <>
                <Link
                  href="/messages"
                  className="flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <span>Messages</span>
                  {(unreadCount + requestCount) > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {(unreadCount + requestCount) > 9 ? '9+' : (unreadCount + requestCount)}
                    </span>
                  )}
                </Link>
                <Link
                  href={`/dashboard/${user.role.toLowerCase()}`}
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
