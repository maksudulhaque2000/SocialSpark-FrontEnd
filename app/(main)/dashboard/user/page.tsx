'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiMapPin, FiClock, FiUser, FiSettings } from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { userService } from '@/lib/users';
import { User, Event } from '@/types';
import { formatDate } from '@/utils/helpers';
import Swal from 'sweetalert2';
import { DashboardCardSkeleton, EventCardSkeleton } from '@/components/SkeletonLoader';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const currentUser = authService.getSavedUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'User') {
      router.push(`/dashboard/${currentUser.role.toLowerCase()}`);
      return;
    }
    setUser(currentUser);
    fetchUserEvents(currentUser.id);
  }, []);

  const fetchUserEvents = async (userId: string) => {
    setLoading(true);
    try {
      const response = await userService.getUserEvents(userId);
      if (response.success && response.data) {
        setJoinedEvents(response.data.events);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load your events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = joinedEvents.filter(
    (event) => event.status === 'upcoming' || event.status === 'ongoing'
  );
  const pastEvents = joinedEvents.filter(
    (event) => event.status === 'completed'
  );

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs sm:text-sm font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto"
            >
              <FiSettings className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              <span className="text-gray-700">Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <DashboardCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Events Joined</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{joinedEvents.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Upcoming Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{upcomingEvents.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <FiClock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Completed Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pastEvents.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 rounded-full flex items-center justify-center">
                <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Events</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg font-semibold transition text-sm ${
                  activeTab === 'upcoming'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming ({upcomingEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-lg font-semibold transition text-sm ${
                  activeTab === 'past'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past ({pastEvents.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : displayEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming'
                  ? 'No upcoming events. Start exploring!'
                  : 'No past events yet.'}
              </p>
              <Link
                href="/events"
                className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                Browse Events
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {displayEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="block border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* Event Image */}
                    <div className="w-full sm:w-20 md:w-24 h-40 sm:h-20 md:h-24 rounded-lg overflow-hidden shrink-0">
                      {event.bannerImage ? (
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <span className="text-white text-2xl">🎉</span>
                        </div>
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="text-gray-700 shrink-0" />
                              <span className="truncate">{formatDate(event.date)} • {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiMapPin className="text-gray-700 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          event.status === 'upcoming' ? 'bg-gray-200 text-gray-800' :
                          event.status === 'ongoing' ? 'bg-gray-300 text-gray-900' :
                          'bg-gray-400 text-white'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/events"
              className="flex-1 text-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
            >
              Browse Events
            </Link>
            <Link
              href="/profile/edit"
              className="flex-1 text-center px-4 py-2 bg-white border border-gray-700 text-gray-800 rounded-lg hover:bg-gray-50 transition"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
