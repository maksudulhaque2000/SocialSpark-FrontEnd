'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiUsers, FiDollarSign, FiPlus, FiEdit, FiTrash2, FiEye, FiUser, FiSettings } from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { userService } from '@/lib/users';
import { eventService } from '@/lib/events';
import { paymentService } from '@/lib/payments';
import { User, Event } from '@/types';
import { formatDate, formatCurrency } from '@/utils/helpers';
import Swal from 'sweetalert2';

export default function HostDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
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
    fetchRevenue(currentUser.id);
  }, []);

  const fetchRevenue = async (userId: string) => {
    setRevenueLoading(true);
    try {
      const response = await paymentService.getHostRevenue(userId);
      if (response.success && response.data) {
        setTotalRevenue(response.data.totalRevenue || 0);
      }
    } catch (error) {
      console.error('Failed to load revenue:', error);
    } finally {
      setRevenueLoading(false);
    }
  };

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

  const handleStatusChange = async (eventId: string, eventTitle: string, currentStatus: string) => {
    const { value: newStatus } = await Swal.fire({
      title: `Update Status: ${eventTitle}`,
      input: 'select',
      inputOptions: {
        upcoming: 'Upcoming',
        ongoing: 'Ongoing',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
      inputValue: currentStatus,
      showCancelButton: true,
      confirmButtonText: 'Update',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to select a status!';
        }
      },
    });

    if (newStatus && newStatus !== currentStatus) {
      try {
        await eventService.updateEventStatus(eventId, newStatus);
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Event status has been updated',
          timer: 1500,
          showConfirmButton: false,
        });
        if (user) fetchHostedEvents(user.id);
      } catch (error) {
        Swal.fire('Error', 'Failed to update status', 'error');
      }
    }
  };

  const handleViewParticipants = async (eventId: string, eventTitle: string) => {
    try {
      const response = await eventService.getEventParticipants(eventId);
      if (response.success && response.data) {
        const participants = response.data.participants;
        
        if (participants.length === 0) {
          await Swal.fire({
            icon: 'info',
            title: 'No Participants Yet',
            text: 'No one has joined this event yet.',
          });
          return;
        }

        const participantsHtml = participants.map((participant: any) => `
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px; text-align: left;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; flex-shrink: 0;">
              ${participant.profileImage ? `<img src="${participant.profileImage}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />` : participant.name.charAt(0)}
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #111827;">${participant.name}</div>
              <div style="font-size: 14px; color: #6b7280;">${participant.email}</div>
              ${participant.bio ? `<div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">${participant.bio}</div>` : ''}
            </div>
            <a href="/host/${participant._id || participant.id}" style="padding: 8px 16px; background: #3b82f6; color: white; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">View Profile</a>
          </div>
        `).join('');

        await Swal.fire({
          title: `Participants of "${eventTitle}"`,
          html: `
            <div style="max-height: 400px; overflow-y: auto; padding: 8px;">
              ${participantsHtml}
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-weight: 600; color: #111827;">
              Total Participants: ${response.data.totalParticipants}
            </div>
          `,
          width: '600px',
          confirmButtonText: 'Close',
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load participants', 'error');
    }
  };

  const handleViewRevenue = async (eventId: string, eventTitle: string) => {
    try {
      const response = await eventService.getEventRevenue(eventId);
      if (response.success && response.data) {
        const { totalRevenue, totalPayments, payments } = response.data;

        const paymentsHtml = payments.length > 0 ? payments.map((payment: any) => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: #10b981; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                ${payment.userId?.profileImage ? `<img src="${payment.userId.profileImage}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />` : payment.userId?.name?.charAt(0) || 'U'}
              </div>
              <div style="text-align: left;">
                <div style="font-weight: 600; color: #111827;">${payment.userId?.name || 'Unknown User'}</div>
                <div style="font-size: 12px; color: #6b7280;">${payment.userId?.email || ''}</div>
              </div>
            </div>
            <div style="font-weight: 700; color: #10b981; font-size: 16px;">
              ${formatCurrency(payment.amount)}
            </div>
          </div>
        `).join('') : '<p style="color: #6b7280; text-align: center; padding: 20px;">No payments yet</p>';

        await Swal.fire({
          title: `Revenue from "${eventTitle}"`,
          html: `
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
              <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Total Revenue</div>
              <div style="font-size: 36px; font-weight: 700;">${formatCurrency(totalRevenue)}</div>
              <div style="font-size: 14px; opacity: 0.9; margin-top: 8px;">from ${totalPayments} payment${totalPayments !== 1 ? 's' : ''}</div>
            </div>
            <div style="max-height: 300px; overflow-y: auto; padding: 8px;">
              ${paymentsHtml}
            </div>
          `,
          width: '600px',
          confirmButtonText: 'Close',
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load revenue data', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{user.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-semibold">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/profile/edit"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
              >
                <FiSettings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                <span className="text-gray-700">Edit Profile</span>
              </Link>
              <Link
                href="/events/create"
                className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-900 transition font-semibold text-sm sm:text-base"
              >
                <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Create Event</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Events</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Participants</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalParticipants}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <FiUsers className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {revenueLoading ? '...' : formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Upcoming</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full flex items-center justify-center">
                <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Completed</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.completedEvents}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Your Events</h2>

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
                className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
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
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    {/* Event Image */}
                    <div className="w-full sm:w-24 md:w-32 h-40 sm:h-24 md:h-32 rounded-lg overflow-hidden shrink-0">
                      {event.bannerImage ? (
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <span className="text-white text-3xl">🎉</span>
                        </div>
                      )}
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'upcoming' ? 'bg-gray-200 text-gray-800' :
                            event.status === 'ongoing' ? 'bg-gray-300 text-gray-900' :
                            event.status === 'completed' ? 'bg-gray-400 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 text-xs sm:text-sm">
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-semibold text-gray-900 truncate">{formatDate(event.date)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Participants</p>
                          <p className="font-semibold text-gray-900">
                            {event.currentParticipants}/{event.maxParticipants}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Category</p>
                          <p className="font-semibold text-gray-900 truncate">{event.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price</p>
                          <p className="font-semibold text-gray-900">
                            {event.isPaid ? formatCurrency(event.price) : 'Free'}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/events/${event._id}`}
                          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
                        >
                          <FiEye className="w-4 h-4 shrink-0" />
                          <span className="truncate">View</span>
                        </Link>
                        <button
                          onClick={() => handleViewParticipants(event._id, event.title)}
                          className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
                        >
                          <FiUsers className="w-4 h-4 shrink-0" />
                          <span className="hidden sm:inline">Participants</span>
                          <span className="sm:hidden">({event.currentParticipants})</span>
                        </button>
                        {event.isPaid && (
                          <button
                            onClick={() => handleViewRevenue(event._id, event.title)}
                            className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
                          >
                            <FiDollarSign className="w-4 h-4 shrink-0" />
                            <span className="truncate">Revenue</span>
                          </button>
                        )}
                        <Link
                          href={`/events/${event._id}/edit`}
                          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-600 text-gray-800 rounded-lg hover:bg-gray-50 transition text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
                        >
                          <FiEdit className="w-4 h-4 shrink-0" />
                          <span className="truncate">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleStatusChange(event._id, event.title, event.status)}
                          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-500 text-gray-700 rounded-lg hover:bg-gray-100 transition text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
                        >
                          <FiSettings className="w-4 h-4 shrink-0" />
                          <span className="truncate">Status</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-700 text-gray-800 rounded-lg hover:bg-gray-100 transition text-xs sm:text-sm flex-1 sm:flex-initial min-w-0"
                        >
                          <FiTrash2 className="w-4 h-4 shrink-0" />
                          <span className="truncate">Delete</span>
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
