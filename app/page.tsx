'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FiCalendar, 
  FiUsers, 
  FiStar, 
  FiArrowRight, 
  FiMapPin, 
  FiClock,
  FiTrendingUp,
  FiAward,
  FiHeart
} from 'react-icons/fi';
import { eventService } from '@/lib/events';
import { userService } from '@/lib/users';
import { Event, User } from '@/types';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [topHosts, setTopHosts] = useState<User[]>([]);
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
    try {
      // Fetch featured events (first 3)
      const eventsResponse = await eventService.getEvents({ limit: 6 });
      if (eventsResponse.success && eventsResponse.data) {
        setFeaturedEvents(eventsResponse.data.events.slice(0, 3));
        setUpcomingEvents(eventsResponse.data.events.slice(3, 6));
        
        // Mock stats (in real app, get from API)
        setStats({
          totalEvents: eventsResponse.data.events.length,
          totalUsers: 1250,
          totalHosts: 89,
          eventsThisMonth: 45
        });
      }

      // Fetch top hosts
      const hostsResponse = await userService.getTopHosts();
      if (hostsResponse.success && hostsResponse.data) {
        setTopHosts(hostsResponse.data.hosts.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Concerts', icon: '🎵', color: 'from-pink-500 to-rose-500' },
    { name: 'Sports', icon: '⚽', color: 'from-green-500 to-emerald-500' },
    { name: 'Hiking', icon: '🏔️', color: 'from-blue-500 to-cyan-500' },
    { name: 'Tech Meetups', icon: '💻', color: 'from-purple-500 to-indigo-500' },
    { name: 'Gaming', icon: '🎮', color: 'from-orange-500 to-red-500' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Event Enthusiast',
      image: '👩',
      text: 'SocialSpark helped me find amazing hiking partners. Made so many new friends!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Tech Meetup Host',
      image: '👨',
      text: 'Best platform for organizing tech events. The community is fantastic!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Sports Lover',
      image: '👩‍🦰',
      text: 'Found my regular basketball crew here. Highly recommend!',
      rating: 5
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Connect. Collaborate. Create Memories.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find partners for events, activities, and social experiences
            </p>
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
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
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
      <section className="py-16">
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
      <section className="py-16">
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
      <section className="py-16 bg-gray-50">
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
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-8">
              {topHosts.map((host) => (
                <div key={host._id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
                    {host.profileImage ? (
                      <img src={host.profileImage} alt={host.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      host.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{host.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{host.role}</p>
                  <div className="flex items-center justify-center text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm">
                    {host.hostedEvents?.length || 0} Events Hosted
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-blue-100 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-blue-50 italic">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <Link
                  key={event._id}
                  href={`/events/${event._id}`}
                  className="flex flex-col md:flex-row bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group"
                >
                  <div className="md:w-1/4 h-48 md:h-auto bg-gradient-to-br from-blue-400 to-purple-500 relative">
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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-flex items-center justify-center"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
