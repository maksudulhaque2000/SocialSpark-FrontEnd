'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUsers, 
  FiCalendar, 
  FiTrendingUp, 
  FiShield,
  FiSettings,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { adminService } from '@/lib/admin';
import { User } from '@/types';
import Swal from 'sweetalert2';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    blocked: number;
    hosts: number;
    newThisMonth: number;
  };
  events: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    pendingApproval: number;
    newThisMonth: number;
  };
  reviews: {
    pendingReviews: number;
  };
  categoryDistribution: Array<{ _id: string; count: number }>;
  recentUsers: Array<any>;
  recentEvents: Array<any>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      Swal.fire('Error', 'Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

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
                  <FiShield className="w-8 h-8 text-purple-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  {user.role} - Administrator
                </span>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-900"
            >
              <FiSettings />
              <span>Edit Profile</span>
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-700 font-medium">Platform Management Dashboard</p>
            <p className="text-gray-600 text-sm">Manage users, events, and monitor platform activity</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : stats ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
                    <p className="text-green-600 text-sm mt-1">
                      +{stats.users.newThisMonth} this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Events</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.events.total}</p>
                    <p className="text-green-600 text-sm mt-1">
                      +{stats.events.newThisMonth} this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCalendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Approval</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.events.pendingApproval}</p>
                    <p className="text-orange-600 text-sm mt-1">Needs Review</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FiClock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Hosts</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.users.hosts}</p>
                    <p className="text-blue-600 text-sm mt-1">Event Creators</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">User Status</h3>
                  <FiUsers className="text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold text-green-600">{stats.users.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Blocked Users</span>
                    <span className="font-semibold text-red-600">{stats.users.blocked}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Event Status</h3>
                  <FiCalendar className="text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Upcoming</span>
                    <span className="font-semibold text-blue-600">{stats.events.upcoming}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-gray-600">{stats.events.completed}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
                  <FiTrendingUp className="text-gray-400" />
                </div>
                <div className="space-y-2">
                  {stats.categoryDistribution.slice(0, 3).map((cat, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{cat._id}</span>
                      <span className="font-semibold text-gray-900">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    href="/admin/users"
                    className="block w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <FiUsers className="text-blue-600" />
                      <div>
                        <p className="font-semibold">Manage Users</p>
                        <p className="text-sm text-gray-600">View, block, and manage user accounts</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/admin/events"
                    className="block w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <FiCalendar className="text-green-600" />
                      <div>
                        <p className="font-semibold">Manage Events</p>
                        <p className="text-sm text-gray-600">Review, approve, and moderate events</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/admin/pending"
                    className="block w-full text-left px-4 py-3 border border-orange-300 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <FiAlertCircle className="text-orange-600" />
                      <div>
                        <p className="font-semibold text-orange-900">Pending Approvals</p>
                        <p className="text-sm text-orange-700">
                          {stats.events.pendingApproval} events waiting for approval
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard/admin/reviews"
                    className="block w-full text-left px-4 py-3 border border-purple-300 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      <FiCheckCircle className="text-purple-600" />
                      <div>
                        <p className="font-semibold text-purple-900">Website Reviews</p>
                        <p className="text-sm text-purple-700">
                          {stats.reviews?.pendingReviews || 0} reviews pending approval
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stats.recentUsers.slice(0, 3).map((recentUser, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="font-semibold text-sm text-gray-900">New user registered</p>
                      <p className="text-xs text-gray-600">{recentUser.name} - {recentUser.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(recentUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {stats.recentEvents.slice(0, 2).map((event, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <p className="font-semibold text-sm text-gray-900">New event created</p>
                      <p className="text-xs text-gray-600">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No statistics available</p>
          </div>
        )}
      </div>
    </div>
  );
}
