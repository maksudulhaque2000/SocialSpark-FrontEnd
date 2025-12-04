'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiFilter, FiCalendar, FiMapPin, FiUsers, FiList, FiGrid } from 'react-icons/fi';
import { eventService } from '@/lib/events';
import { Event } from '@/types';
import { formatDate, formatCurrency } from '@/utils/helpers';
import Swal from 'sweetalert2';
import EventCalendar from '@/components/EventCalendar';
import { EventCardSkeleton } from '@/components/SkeletonLoader';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const categories = [
    'All',
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

  // Read category from URL on mount
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchEvents();
  }, [filters.page, filters.category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventService.getEvents(
        filters.category === 'All' ? { ...filters, category: '' } : filters
      );
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category: category === 'All' ? '' : category, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Events</h1>
            <p className="text-gray-600">Find your next adventure</p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              title="Grid View"
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              title="List View"
            >
              <FiList className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-3 rounded-lg transition ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              title="Calendar View"
            >
              <FiCalendar className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <FiFilter className="text-gray-600" />
              <span className="font-semibold text-gray-700">Categories:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    (filters.category === category || (category === 'All' && !filters.category))
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' ? (
          <EventCalendar events={events} loading={loading} />
        ) : (
          <>
            {/* Events Grid/List */}
            {loading ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
              }>
                {[...Array(6)].map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No events found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {events.map((event) => viewMode === 'grid' ? (
                    /* Grid View Card */
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {event.bannerImage ? (
                      <img
                        src={event.bannerImage}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                        <span className="text-white text-4xl">🎉</span>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                      {event.category}
                    </div>
                    {/* Price Badge */}
                    {event.isPaid && (
                      <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {formatCurrency(event.price)}
                      </div>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-600" />
                        <span>{formatDate(event.date)} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-red-600" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-green-600" />
                        <span>
                          {event.currentParticipants}/{event.maxParticipants} participants
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                      {event.currentParticipants >= event.maxParticipants && (
                        <span className="text-red-600 text-xs font-semibold">FULL</span>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                /* List View Card */
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Event Image */}
                    <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 overflow-hidden relative">
                      {event.bannerImage ? (
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                          <span className="text-white text-4xl">🎉</span>
                        </div>
                      )}
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {event.category}
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                          {event.title}
                        </h3>
                        {event.isPaid && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold ml-2 flex-shrink-0">
                            {formatCurrency(event.price)}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                      <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-blue-600 flex-shrink-0" />
                          <span>{formatDate(event.date)} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-red-600 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiUsers className="text-green-600 flex-shrink-0" />
                          <span>
                            {event.currentParticipants}/{event.maxParticipants} participants
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {event.status}
                          </span>
                          {event.currentParticipants >= event.maxParticipants && (
                            <span className="text-red-600 text-xs font-semibold">FULL</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                      disabled={!pagination.hasPrevPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-gray-900">
                      Page {filters.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                      disabled={!pagination.hasNextPage}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
