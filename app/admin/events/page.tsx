'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiCalendar, 
  FiSearch, 
  FiTrash2,
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiEye,
} from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { adminService } from '@/lib/admin';
import Swal from 'sweetalert2';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function ManageEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    isApproved: '',
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
  });

  const categories = [
    'Concerts',
    'Sports',
    'Hiking',
    'Tech Meetups',
    'Gaming',
    'Food & Dining',
    'Arts & Culture',
    'Networking',
    'Workshops',
    'Other',
  ];

  useEffect(() => {
    const currentUser = authService.getSavedUser();
    if (!currentUser || currentUser.role !== 'Admin') {
      router.push('/dashboard/admin');
      return;
    }
    fetchEvents();
  }, [filters.page, filters.status, filters.category, filters.isApproved]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      };
      
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.isApproved !== '') params.isApproved = filters.isApproved;

      const response = await adminService.getAllEvents(params);
      if (response.success && response.data) {
        setEvents(response.data.events);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    const result = await Swal.fire({
      title: 'Delete Event?',
      text: `Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.forceDeleteEvent(eventId);
        if (response.success) {
          Swal.fire('Deleted!', 'Event has been deleted', 'success');
          fetchEvents();
        }
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete event';
        Swal.fire('Error', message, 'error');
      }
    }
  };

  const handleApprove = async (eventId: string, eventTitle: string) => {
    const result = await Swal.fire({
      title: 'Approve Event?',
      text: `Approve "${eventTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      confirmButtonColor: '#10b981',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.approveEvent(eventId);
        if (response.success) {
          Swal.fire('Approved!', 'Event has been approved', 'success');
          fetchEvents();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to approve event', 'error');
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
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FiCalendar className="text-3xl text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600">View, approve, and manage all events on the platform</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select
              value={filters.isApproved}
              onChange={(e) => setFilters({ ...filters, isApproved: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Approval Status</option>
              <option value="true">Approved</option>
              <option value="false">Pending Approval</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={fetchEvents}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>

          {/* Events List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No events found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Event</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Host</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Approval</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Participants</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {events.map((event) => (
                      <tr key={event._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.category}</p>
                            <p className="text-xs text-gray-500">{event.location}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{event.hostId?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{event.hostId?.email || ''}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {formatDate(event.date)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {event.isApproved ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <FiCheckCircle /> Approved
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-orange-600 text-sm">
                              <FiXCircle /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {event.currentParticipants}/{event.maxParticipants}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/events/${event._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Event"
                            >
                              <FiEye />
                            </Link>
                            {!event.isApproved && (
                              <button
                                onClick={() => handleApprove(event._id, event.title)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                title="Approve Event"
                              >
                                <FiCheckCircle />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteEvent(event._id, event.title)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Event"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-gray-900">
                    Page {filters.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page >= pagination.totalPages}
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
