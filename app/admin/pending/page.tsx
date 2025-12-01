'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiCalendar, 
  FiSearch, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrash2,
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiUsers,
} from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { adminService } from '@/lib/admin';
import Swal from 'sweetalert2';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function PendingEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    const currentUser = authService.getSavedUser();
    if (!currentUser || currentUser.role !== 'Admin') {
      router.push('/dashboard/admin');
      return;
    }
    fetchPendingEvents();
  }, [page]);

  const fetchPendingEvents = async () => {
    setLoading(true);
    try {
      const response = await adminService.getPendingEvents({ page, limit: 10 });
      if (response.success && response.data) {
        setEvents(response.data.events);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load pending events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId: string, eventTitle: string) => {
    const result = await Swal.fire({
      title: 'Approve Event?',
      text: `Are you sure you want to approve "${eventTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      confirmButtonColor: '#10b981',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.approveEvent(eventId);
        if (response.success) {
          Swal.fire('Approved!', 'Event has been approved and is now visible to users', 'success');
          fetchPendingEvents();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to approve event', 'error');
      }
    }
  };

  const handleReject = async (eventId: string, eventTitle: string) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject Event',
      text: `Why are you rejecting "${eventTitle}"?`,
      input: 'textarea',
      inputPlaceholder: 'Enter rejection reason...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#dc2626',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to provide a reason!';
        }
        return null;
      },
    });

    if (reason) {
      try {
        const response = await adminService.rejectEvent(eventId, reason);
        if (response.success) {
          Swal.fire('Rejected', 'Event has been rejected', 'success');
          fetchPendingEvents();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to reject event', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft />
            <span>Back to Dashboard</span>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3">
              <FiClock className="text-3xl text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pending Event Approvals</h1>
                <p className="text-gray-600">Review and approve new events before they go live</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No pending events waiting for approval</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
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
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                              Pending Approval
                            </span>
                          </div>
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                            {event.category}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiCalendar className="text-blue-600" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiClock className="text-purple-600" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiMapPin className="text-red-600" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiUsers className="text-green-600" />
                            <span>{event.maxParticipants} max</span>
                          </div>
                        </div>

                        {/* Host Info */}
                        {event.hostId && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <span className="font-semibold">Host:</span>
                            <span>{event.hostId.name}</span>
                            <span className="text-gray-400">({event.hostId.email})</span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-lg font-bold text-gray-900">
                            {event.isPaid ? formatCurrency(event.price) : 'Free Event'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Created {formatDate(event.createdAt)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleApprove(event._id, event.title)}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                          >
                            <FiCheckCircle />
                            Approve Event
                          </button>
                          <button
                            onClick={() => handleReject(event._id, event.title)}
                            className="flex items-center gap-2 px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-semibold"
                          >
                            <FiXCircle />
                            Reject Event
                          </button>
                          <Link
                            href={`/events/${event._id}`}
                            className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-gray-900">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
