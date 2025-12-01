'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiClock, FiArrowLeft } from 'react-icons/fi';
import { eventService } from '@/lib/events';
import { authService } from '@/lib/auth';
import { Event, User } from '@/types';
import { formatDate, formatCurrency, getDaysUntilEvent } from '@/utils/helpers';
import Swal from 'sweetalert2';
import EventComments from '@/components/EventComments';
import EventReviews from '@/components/EventReviews';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = authService.getSavedUser();
    setCurrentUser(user);
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEvent(params.id as string);
      if (response.success && response.data) {
        setEvent(response.data.event);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load event details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!currentUser) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to join this event',
        showCancelButton: true,
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    if (!event) return;

    // Check if event is paid
    if (event.isPaid && event.price > 0) {
      Swal.fire({
        icon: 'info',
        title: 'Payment Required',
        text: `This event requires a payment of ${formatCurrency(event.price)}`,
        showCancelButton: true,
        confirmButtonText: 'Proceed to Payment',
      }).then((result) => {
        if (result.isConfirmed) {
          // TODO: Implement Stripe payment
          Swal.fire('Info', 'Payment integration coming soon!', 'info');
        }
      });
      return;
    }

    setJoining(true);
    try {
      const response = await eventService.joinEvent(event._id);
      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Joined Successfully!',
          text: 'You have successfully joined this event',
          timer: 2000,
        });
        fetchEvent(); // Refresh event data
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to join event', 'error');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!event) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: 'Leave Event?',
      text: 'Are you sure you want to leave this event?',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
      confirmButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      try {
        await eventService.leaveEvent(event._id);
        await Swal.fire('Success', 'You have left the event', 'success');
        fetchEvent();
      } catch (error) {
        Swal.fire('Error', 'Failed to leave event', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <Link href="/events" className="text-blue-600 hover:text-blue-700">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const host = typeof event.hostId === 'object' ? event.hostId : null;
  const isParticipant = currentUser && event.participants.includes(currentUser.id);
  const isHost = currentUser && host && currentUser.id === host.id;
  const isFull = event.currentParticipants >= event.maxParticipants;
  const daysUntil = getDaysUntilEvent(event.date);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Events
        </Link>

        {/* Event Banner */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-6">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-8xl">🎉</span>
            </div>
          )}
          {/* Category Badge */}
          <div className="absolute top-4 right-4 bg-blue-600 px-4 py-2 rounded-full font-semibold">
            {event.category}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            {/* Host Info */}
            {host && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Hosted By</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      {host.profileImage ? (
                        <img
                          src={host.profileImage}
                          alt={host.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {host.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{host.name}</h3>
                      <p className="text-gray-600 text-sm">{host.bio || 'Event Host'}</p>
                    </div>
                  </div>
                  <Link
                    href={`/host/${host._id || host.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <FiCalendar className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-gray-600 text-sm">
                      {formatDate(event.date, 'EEEE, MMMM dd, yyyy')}
                    </p>
                    <p className="text-gray-600 text-sm">{event.time}</p>
                    {daysUntil > 0 && (
                      <p className="text-blue-600 text-sm font-semibold mt-1">
                        {daysUntil} days to go
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-600 text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiUsers className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Participants</p>
                    <p className="text-gray-600 text-sm">
                      {event.currentParticipants} / {event.maxParticipants} joined
                    </p>
                    {isFull && <p className="text-red-600 text-sm font-semibold">Event Full</p>}
                  </div>
                </div>

                {event.isPaid && (
                  <div className="flex items-start gap-3">
                    <FiDollarSign className="text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Price</p>
                      <p className="text-gray-600 text-sm">{formatCurrency(event.price)}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <FiClock className="text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isHost ? (
                <div className="space-y-2">
                  <Link
                    href={`/events/${event._id}/edit`}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center block"
                  >
                    Edit Event
                  </Link>
                  <p className="text-sm text-gray-600 text-center">You are hosting this event</p>
                </div>
              ) : isParticipant ? (
                <button
                  onClick={handleLeaveEvent}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Leave Event
                </button>
              ) : (
                <button
                  onClick={handleJoinEvent}
                  disabled={joining || isFull || event.status !== 'upcoming'}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joining ? 'Joining...' : isFull ? 'Event Full' : 'Join Event'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <EventComments eventId={event._id} />
        </div>

        {/* Reviews Section */}
        {host && (
          <div className="mt-8">
            <EventReviews 
              eventId={event._id} 
              eventStatus={event.status} 
              hostId={host._id || host.id} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
