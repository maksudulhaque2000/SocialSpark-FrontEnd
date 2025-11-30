'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiUser, FiSettings } from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { User } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getSavedUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'Admin') {
      router.push(`/dashboard/${currentUser.role.toLowerCase()}`);
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-8 h-8 text-purple-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FiSettings />
              <span>Edit Profile</span>
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600">Platform Overview & Management</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">1,234</p>
                <p className="text-green-600 text-sm mt-1">+12% this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">567</p>
                <p className="text-green-600 text-sm mt-1">+8% this month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$45.2K</p>
                <p className="text-green-600 text-sm mt-1">+15% this month</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Hosts</p>
                <p className="text-3xl font-bold text-gray-900">89</p>
                <p className="text-green-600 text-sm mt-1">+5% this month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <p className="font-semibold">Manage Users</p>
                <p className="text-sm text-gray-600">View and moderate user accounts</p>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <p className="font-semibold">Manage Events</p>
                <p className="text-sm text-gray-600">Review and moderate events</p>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <p className="font-semibold">View Reports</p>
                <p className="text-sm text-gray-600">Check platform analytics</p>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="font-semibold text-sm">New user registered</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="font-semibold text-sm">New event created</p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-semibold text-sm">Payment received</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <p className="font-semibold text-sm">New review posted</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Admin Dashboard</h3>
          <p className="text-blue-800 text-sm">
            This is a simplified admin dashboard. Full admin features including user management,
            event moderation, and detailed analytics can be implemented based on requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
