'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiUsers, FiDollarSign, FiPlus, FiEdit, FiTrash2, FiEye, FiUser, FiSettings } from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { userService } from '@/lib/users';
import { eventService } from '@/lib/events';
import { User, Event } from '@/types';
import { formatDate, formatCurrency } from '@/utils/helpers';
import Swal from 'sweetalert2';

export default function HostDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  });

  useEffect(() => {
    const currentUser = authService.getSavedUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (currentUser.role !== 'Host') {
      router.push(`/dashboard/${currentUser.role.toLowerCase()}`);
      return;
    }
    setUser(currentUser);
    fetchHostedEvents(currentUser.id);
  }, []);

  const fetchHostedEvents = async (userId: string) => {
    setLoading(true);
    try {
      const response = await userService.getUserHostedEvents(userId);
      if (response.success && response.data) {
        const events = response.data.events;
        setHostedEvents(events);

        // Calculate stats
        const totalParticipants = events.reduce(
          (sum, event) => sum + event.currentParticipants,
          0
        );
        const upcomingEvents = events.filter(
          (e) => e.status === 'upcoming' || e.status === 'ongoing'
        ).length;
        const completedEvents = events.filter((e) => e.status === 'completed').length;

        setStats({
          totalEvents: events.length,
          totalParticipants,
          upcomingEvents,
          completedEvents,
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load your events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete Event?',
      text: `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      try {
        await eventService.deleteEvent(eventId);
        await Swal.fire('Deleted!', 'Event has been deleted', 'success');
        if (user) fetchHostedEvents(user.id);
      } catch (error) {
        Swal.fire('Error', 'Failed to delete event', 'error');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/profile/edit"
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 rounded-lg hover:bg-gray-50 transition"
              >
                <FiSettings className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600">Edit Profile</span>
              </Link>
              <Link
                href="/events/create"
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <FiPlus />
                <span>Create Event</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Participants</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedEvents}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Events</h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : hostedEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't created any events yet.</p>
              <Link
                href="/events/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <FiPlus />
                <span>Create Your First Event</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {hostedEvents.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Event Image */}
                    <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                      {event.bannerImage ? (
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-3xl">🎉</span>
                        </div>
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {event.title}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-semibold">{formatDate(event.date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Participants</p>
                          <p className="font-semibold">
                            {event.currentParticipants}/{event.maxParticipants}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Category</p>
                          <p className="font-semibold">{event.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-semibold">
                            {event.isPaid ? formatCurrency(event.price) : 'Free'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/events/${event._id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          <FiEye />
                          <span>View</span>
                        </Link>
                        <Link
                          href={`/events/${event._id}/edit`}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                        >
                          <FiEdit />
                          <span>Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm"
                        >
                          <FiTrash2 />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
