'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiX, FiMessageCircle } from 'react-icons/fi';
import { conversationService } from '@/lib/conversations';
import { authService } from '@/lib/auth';
import { Conversation, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';

export default function MessageRequestsPage() {
  const [requests, setRequests] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getSavedUser();
    if (!user) {
      router.push('/login');
      return;
    }
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await conversationService.getRequests();
      if (response.success && response.data) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      Swal.fire('Error', 'Failed to load message requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (conversationId: string) => {
    try {
      setProcessing(conversationId);
      const response = await conversationService.acceptRequest(conversationId);
      
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Request Accepted',
          text: 'You can now chat with this user',
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Remove from requests list
        setRequests(requests.filter((r) => r._id !== conversationId));
        
        // Notify navbar to update request count
        window.dispatchEvent(new Event('unread-count-changed'));
        
        // Redirect to chat
        router.push(`/messages/${conversationId}`);
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
      Swal.fire('Error', 'Failed to accept message request', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (conversationId: string) => {
    try {
      setProcessing(conversationId);
      const response = await conversationService.rejectRequest(conversationId);
      
      if (response.success) {
        Swal.fire({
          icon: 'info',
          title: 'Request Rejected',
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Remove from requests list
        setRequests(requests.filter((r) => r._id !== conversationId));
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
      Swal.fire('Error', 'Failed to reject message request', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/messages"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <FiArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <FiMessageCircle className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Message Requests</h1>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {requests.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600 mb-6">
                You don&apos;t have any message requests at the moment.
              </p>
              <Link
                href="/messages"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Back to Messages
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requests.map((request) => {
                const sender = typeof request.requestedBy === 'object' 
                  ? request.requestedBy as User 
                  : null;
                
                if (!sender) return null;

                return (
                  <div key={request._id} className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <Link
                        href={`/user/${sender._id || sender.id}`}
                        className="shrink-0"
                      >
                        <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                          {sender.profileImage ? (
                            <img
                              src={sender.profileImage}
                              alt={sender.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(sender.name)
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/user/${sender._id || sender.id}`}
                          className="hover:underline"
                        >
                          <h3 className="text-lg font-semibold text-gray-900">
                            {sender.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600">{sender.role}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Sent {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleAccept(request._id)}
                          disabled={processing === request._id}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiCheck className="w-5 h-5" />
                          <span className="hidden sm:inline">Accept</span>
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={processing === request._id}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiX className="w-5 h-5" />
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
