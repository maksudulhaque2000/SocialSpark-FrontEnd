'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { 
  FiCalendar, 
  FiUsers, 
  FiStar, 
  FiArrowRight, 
  FiMapPin, 
  FiClock,
  FiTrendingUp,
  FiAward,
  FiHeart,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { eventService } from '@/lib/events';
import { userService } from '@/lib/users';
import { statsService } from '@/lib/stats';
import { websiteReviewService } from '@/lib/websiteReviews';
import { Event, User, WebsiteReview } from '@/types';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { EventCardSkeleton, HostCardSkeleton, ReviewCardSkeleton } from '@/components/SkeletonLoader';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [topHosts, setTopHosts] = useState<User[]>([]);
  const [websiteReviews, setWebsiteReviews] = useState<WebsiteReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalHosts: 0,
    eventsThisMonth: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch platform statistics
    try {
      const statsResponse = await statsService.getStats();
      if (statsResponse.success && statsResponse.data) {
        setStats({
          totalEvents: statsResponse.data.totalEvents,
          totalUsers: statsResponse.data.totalUsers,
          totalHosts: statsResponse.data.totalHosts,
          eventsThisMonth: statsResponse.data.eventsThisMonth,
        });
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error?.message || error);
      // Set default stats if API fails
      setStats({
        totalEvents: 0,
        totalUsers: 0,
        totalHosts: 0,
        eventsThisMonth: 0,
      });
    }

    // Fetch all events (not just upcoming)
    try {
      const [featuredResponse, upcomingResponse, popularResponse] = await Promise.all([
        eventService.getEvents({ limit: 3, status: 'upcoming', sortBy: 'createdAt', sortOrder: 'desc' }),
        eventService.getEvents({ limit: 6, status: 'upcoming', sortBy: 'date', sortOrder: 'asc' }),
        eventService.getEvents({ limit: 8, status: 'upcoming', sortBy: 'participants', sortOrder: 'desc' })
      ]);
      
      if (featuredResponse.success && featuredResponse.data) {
        setFeaturedEvents(featuredResponse.data.events);
      }
      
      if (upcomingResponse.success && upcomingResponse.data) {
        setUpcomingEvents(upcomingResponse.data.events);
      }

      if (popularResponse.success && popularResponse.data) {
        setPopularEvents(popularResponse.data.events);
      }
    } catch (error: any) {
      console.error('Error fetching events:', error?.message || error);
    }

    // Fetch top hosts
    try {
      const hostsResponse = await userService.getTopHosts();
      if (hostsResponse.success && hostsResponse.data) {
        setTopHosts(hostsResponse.data.hosts.slice(0, 4));
      }
    } catch (error: any) {
      console.error('Error fetching top hosts:', error?.message || error);
    }

    // Fetch approved website reviews
    try {
      const reviewsResponse = await websiteReviewService.getApprovedReviews({ limit: 20 });
      if (reviewsResponse.success && reviewsResponse.data) {
        setWebsiteReviews(reviewsResponse.data.reviews);
      }
    } catch (error: any) {
      console.error('Error fetching reviews:', error?.message || error);
      // Reviews are optional, so just set empty array
      setWebsiteReviews([]);
    }

    setLoading(false);
  };

  const categories = [
    { name: 'Concerts', icon: '🎵', color: 'from-gray-50 to-gray-100' },
    { name: 'Sports', icon: '⚽', color: 'from-green-50 to-emerald-100' },
    { name: 'Hiking', icon: '🏔️', color: 'from-blue-50 to-cyan-100' },
    { name: 'Tech Meetups', icon: '💻', color: 'from-purple-50 to-indigo-5=100' },
    { name: 'Gaming', icon: '🎮', color: 'from-orange-50 to-red-100' }
  ];

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Auto-slide effect for reviews carousel
  useEffect(() => {
    if (websiteReviews.length <= 3) return; // Don't auto-slide if 3 or fewer reviews
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, websiteReviews.length - 3);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [websiteReviews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, websiteReviews.length - 3);
      return prev >= maxSlide ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, websiteReviews.length - 3);
      return prev <= 0 ? maxSlide : prev - 1;
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to submit a review',
      });
      return;
    }

    if (reviewForm.comment.length < 10) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Review must be at least 10 characters',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await websiteReviewService.createReview({
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Review submitted successfully! It will be published after admin approval.',
          timer: 3000,
        });
        setShowReviewModal(false);
        setReviewForm({ rating: 5, comment: '' });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to submit review',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Connect. Collaborate. Create Memories.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find partners for events, activities, and social experiences
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/events"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
                >
                  Browse Events
                  <FiArrowRight className="ml-2" />
                </Link>
                {user.role === 'Host' ? (
                  <Link
                    href="/events/create"
                    className="bg-transparent border-2 border-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
                  >
                    Create Event
                    <FiCalendar className="ml-2" />
                  </Link>
                ) : user.role === 'Admin' ? (
                  <Link
                    href="/admin/events"
                    className="bg-transparent border-2 border-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
                  >
                    Admin Dashboard
                    <FiAward className="ml-2" />
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/user"
                    className="bg-transparent border-2 border-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
                  >
                    My Dashboard
                    <FiUsers className="ml-2" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/events"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
                >
                  Browse Events
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  href="/register"
                  className="bg-transparent border-2 border-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {loading ? '...' : stats.totalEvents}+
              </div>
              <p className="text-gray-600">Active Events</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {loading ? '...' : stats.totalUsers}+
              </div>
              <p className="text-gray-600">Happy Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {loading ? '...' : stats.totalHosts}+
              </div>
              <p className="text-gray-600">Trusted Hosts</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {loading ? '...' : stats.eventsThisMonth}+
              </div>
              <p className="text-gray-600">Events This Month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/events?category=${category.name}`}
                className={`bg-gradient-to-br ${category.color} p-6 rounded-lg shadow-md hover:shadow-xl transition text-center text-white transform hover:scale-105`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Find Events</h3>
              <p className="text-gray-600">Browse through various events and activities in your area</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Join & Connect</h3>
              <p className="text-gray-600">Connect with like-minded people who share your interests</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Create Memories</h3>
              <p className="text-gray-600">Attend events and build lasting friendships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Link href="/events" className="text-blue-600 hover:text-blue-700 flex items-center">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No featured events at the moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="h-48 bg-gradient-to-br from-amber-50 to-purple-100 relative overflow-hidden">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                        {categories.find(c => c.name === event.category)?.icon || '🎉'}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition">{event.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <FiMapPin className="mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <FiClock className="mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold">{formatCurrency(event.price)}</span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <FiUsers className="mr-1" />
                        {event.participants.length}/{event.maxParticipants}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Hosts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Top Rated Hosts</h2>
          {loading ? (
            <div className="grid md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <HostCardSkeleton key={i} />
              ))}
            </div>
          ) : topHosts.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-8">
              {topHosts.map((host) => (
                <Link
                  key={host._id}
                  href={`/host/${host._id}`}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition transform hover:scale-105 bg-gradient-to-br from-amber-50 to-purple-100"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl overflow-hidden">
                    {host.profileImage ? (
                      <img src={host.profileImage} alt={host.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      host.name?.charAt(0).toUpperCase() || 'H'
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{host.name || 'Host'}</h3>
                  <p className="text-gray-600 text-sm mb-3 capitalize">{host.role}</p>
                  <div className="flex items-center justify-center text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm font-semibold">
                    {(host as any).eventCount || 0} Events Hosted
                  </p>
                  {host.bio && (
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2">{host.bio}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No hosts available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            {user && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Write a Review
              </button>
            )}
          </div>
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <ReviewCardSkeleton key={i} />
              ))}
            </div>
          ) : websiteReviews.length > 0 ? (
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
                >
                  {websiteReviews.map((review) => (
                    <div key={review._id} className="w-full md:w-1/3 flex-shrink-0 px-4">
                      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 h-full">
                        <div className="flex items-center mb-4">
                          <div className="text-4xl mr-4">
                            {review.userId && typeof review.userId === 'object' && review.userId.profileImage ? (
                              <img
                                src={review.userId.profileImage}
                                alt={review.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                                {review.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold">{review.name || 'User'}</h4>
                            <p className="text-blue-100 text-sm">User</p>
                          </div>
                        </div>
                        <div className="flex mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <FiStar key={i} className="fill-current text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-blue-50 italic">&quot;{review.comment}&quot;</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {websiteReviews.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white p-3 rounded-full transition"
                    aria-label="Previous reviews"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white p-3 rounded-full transition"
                    aria-label="Next reviews"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Slide Indicators */}
              {websiteReviews.length > 3 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.max(0, websiteReviews.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentSlide === index 
                          ? 'bg-white w-8' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-blue-100">No reviews yet. Be the first to share your experience!</p>
              {user && (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="mt-4 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Write a Review
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Popular Events by Category */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Most Popular Events</h2>
            <Link href="/events" className="text-blue-600 hover:text-blue-700 flex items-center">
              Explore More <FiArrowRight className="ml-2" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : popularEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="h-40 bg-gradient-to-br from-amber-50 to-purple-100 relative overflow-hidden">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-5xl">
                        {categories.find(c => c.name === event.category)?.icon || '🎉'}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-purple-600 flex items-center">
                      <FiTrendingUp className="mr-1" />
                      Popular
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition line-clamp-1">{event.title}</h3>
                    <div className="flex items-center text-gray-600 text-xs mb-2">
                      <FiMapPin className="mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs mb-3">
                      <FiClock className="mr-1 flex-shrink-0" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold text-lg">{formatCurrency(event.price)}</span>
                      <span className="text-gray-500 text-xs flex items-center">
                        <FiUsers className="mr-1" />
                        {event.participants.length}/{event.maxParticipants}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Popular Events Yet</h3>
              <p className="text-gray-600">Check back soon for trending events!</p>
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <FiStar
                        className={`w-8 h-8 ${
                          star <= reviewForm.rating
                            ? 'fill-current text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={4}
                  placeholder="Share your experience with SocialSpark..."
                  required
                  minLength={10}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewForm.comment.length}/500 characters (minimum 10)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || reviewForm.comment.length < 10}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewForm({ rating: 5, comment: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcoming Events Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Link href="/events" className="text-blue-600 hover:text-blue-700 flex items-center">
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-48 md:h-auto bg-gray-300"></div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="md:w-1/4 h-48 md:h-auto bg-gradient-to-br from-amber-50 to-purple-100 relative">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                        {categories.find(c => c.name === event.category)?.icon || '🎉'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-xl group-hover:text-blue-600 transition">{event.title}</h3>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FiClock className="mr-2 text-blue-600" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiMapPin className="mr-2 text-blue-600" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiUsers className="mr-2 text-blue-600" />
                        {event.participants.length}/{event.maxParticipants} Joined
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(event.price)}</span>
                      <span className="text-blue-600 font-semibold flex items-center group-hover:translate-x-2 transition">
                        View Details <FiArrowRight className="ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Upcoming Events</h3>
              <p className="text-gray-600 mb-6">Check back later for exciting new events!</p>
              <Link
                href="/events"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse All Events <FiArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {user ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
              <p className="text-xl mb-8 text-blue-100">Discover exciting events and make lasting memories</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/events"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
                >
                  Explore All Events
                  <FiArrowRight className="ml-2" />
                </Link>
                {user.role === 'Host' && (
                  <Link
                    href="/events/create"
                    className="bg-transparent border-2 border-gray-300 text-black px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
                  >
                    Create New Event
                    <FiCalendar className="ml-2" />
                  </Link>
                )}
                {user.role === 'Admin' && (
                  <Link
                    href="/admin/events"
                    className="bg-transparent border-2 border-gray-300 text-black px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
                  >
                    Manage Events
                    <FiAward className="ml-2" />
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 text-blue-100">Join thousands of people making real connections</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition inline-flex items-center justify-center"
                >
                  Create Your Account
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  href="/events"
                  className="bg-transparent border-2 border-gray-300 text-black px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
                >
                  Browse Events
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose SocialSpark?</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We make it easy to discover, join, and create amazing social experiences
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition">
                <FiAward className="w-8 h-8 text-blue-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Hosts</h3>
              <p className="text-gray-600">All hosts are verified to ensure safe and quality events</p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition">
                <FiHeart className="w-8 h-8 text-purple-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-gray-600">Connect with like-minded people who share your interests</p>
            </div>
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition">
                <FiCalendar className="w-8 h-8 text-green-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Planning</h3>
              <p className="text-gray-600">Create and manage events with our intuitive platform</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition">
                <FiTrendingUp className="w-8 h-8 text-orange-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growing Network</h3>
              <p className="text-gray-600">Join a rapidly growing community of event enthusiasts</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
