'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiUser,
  FiCalendar,
  FiUsers,
  FiStar,
  FiMapPin,
  FiMail,
  FiAward,
  FiTrendingUp,
  FiMessageCircle,
} from 'react-icons/fi';
import { userService } from '@/lib/users';
import { conversationService } from '@/lib/conversations';
import { authService } from '@/lib/auth';
import { HostProfile } from '@/lib/users';
import { User } from '@/types';
import { formatDate } from '@/utils/helpers';
import Swal from 'sweetalert2';

export default function HostProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'reviews'>('events');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversationStatus, setConversationStatus] = useState<{
    exists: boolean;
    status?: 'pending' | 'accepted' | 'rejected';
    conversationId?: string;
    isPending?: boolean;
  }>({ exists: false });
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    const savedUser = authService.getSavedUser();
    setCurrentUser(savedUser);
    fetchHostProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (currentUser && hostProfile && currentUser.id !== hostProfile.profile.id) {
      checkConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, hostProfile]);

  const fetchHostProfile = async () => {
    try {
      const response = await userService.getHostProfile(params.id as string);
      if (response.success && response.data) {
        setHostProfile(response.data as any);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load host profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkConversation = async () => {
    if (!hostProfile) return;
    
    try {
      const response = await conversationService.checkConversation(hostProfile.profile.id);
      if (response.success && response.data) {
        if (response.data.exists && response.data.conversation) {
          const conv = response.data.conversation;
          const requestedById = typeof conv.requestedBy === 'string' 
            ? conv.requestedBy 
            : (conv.requestedBy as User)._id || (conv.requestedBy as User).id;
          
          setConversationStatus({
            exists: true,
            status: conv.status,
            conversationId: conv._id,
            isPending: conv.status === 'pending' && requestedById === currentUser?.id,
          });
        }
      }
    } catch (error) {
      console.error('Failed to check conversation:', error);
    }
  };

  const handleSendMessageRequest = async () => {
    if (!hostProfile) return;
    
    try {
      setSendingRequest(true);
      const response = await conversationService.sendRequest(hostProfile.profile.id);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Request Sent',
          text: 'Message request sent successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        
        await checkConversation();
      } else {
        Swal.fire('Error', response.message || 'Failed to send message request', 'error');
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to send message request', 'error');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!hostProfile) return;
    
    try {
      setSendingRequest(true);
      const response = await conversationService.cancelRequest(hostProfile.profile.id);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Request Cancelled',
          text: 'Message request cancelled successfully',
          timer: 2000,
          showConfirmButton: false,
        });
        
        setConversationStatus({ exists: false });
      } else {
        Swal.fire('Error', response.message || 'Failed to cancel message request', 'error');
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to cancel message request', 'error');
    } finally {
      setSendingRequest(false);
    }
  };

  const handleMessageClick = () => {
    if (conversationStatus.conversationId) {
      router.push(`/messages/${conversationStatus.conversationId}`);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hostProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Host Not Found</h2>
          <Link href="/events" className="text-blue-600 hover:text-blue-700">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const { profile, statistics, events, reviews } = hostProfile;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl overflow-hidden flex-shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="w-16 h-16" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-3">
                <FiMail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              
              {profile.bio && (
                <p className="text-gray-700 mb-4">{profile.bio}</p>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}

              {/* Message Button - Only show for other users when logged in */}
              {currentUser && currentUser.id !== profile.id ? (
                <div className="mt-6">
                  {conversationStatus.status === 'accepted' ? (
                    <button
                      onClick={handleMessageClick}
                      className="inline-flex items-center gap-2 bg-purple-400 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition font-semibold"
                    >
                      <FiMessageCircle className="w-5 h-5" />
                      <span>Message</span>
                    </button>
                  ) : conversationStatus.isPending ? (
                    <button
                      onClick={handleCancelRequest}
                      disabled={sendingRequest}
                      className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiMessageCircle className="w-5 h-5" />
                      <span>{sendingRequest ? 'Cancelling...' : 'Cancel Message Request'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSendMessageRequest}
                      disabled={sendingRequest}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiMessageCircle className="w-5 h-5" />
                      <span>{sendingRequest ? 'Sending...' : 'Send Message'}</span>
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <FiCalendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.totalEvents}</p>
            <p className="text-sm text-gray-600">Total Events</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.totalParticipants}</p>
            <p className="text-sm text-gray-600">Total Participants</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <FiStar className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <FiAward className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{statistics.totalReviews}</p>
            <p className="text-sm text-gray-600">Reviews</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                  activeTab === 'events'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Events ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                  activeTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No events yet</p>
                ) : (
                  events.map((event) => (
                    <Link
                      key={event._id}
                      href={`/events/${event._id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-400 to-purple-500">
                          {event.bannerImage ? (
                            <img
                              src={event.bannerImage}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                              🎉
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              {formatDate(event.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <FiMapPin className="w-4 h-4" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <FiUsers className="w-4 h-4" />
                              {event.currentParticipants}/{event.maxParticipants}
                            </div>
                          </div>
                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              event.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : event.status === 'completed'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No reviews yet</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          {review.userId?.profileImage ? (
                            <img
                              src={review.userId.profileImage}
                              alt={review.userId?.name || 'User'}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 font-bold">
                              {review.userId?.name?.charAt(0) ?? 'U'}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.userId?.name || 'User'}</h4>
                              <p className="text-sm text-gray-500">
                                Event: {review.eventId?.title || 'Event'}
                              </p>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
