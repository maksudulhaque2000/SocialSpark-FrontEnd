'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMessageCircle, FiUser, FiInbox } from 'react-icons/fi';
import { conversationService } from '@/lib/conversations';
import { authService } from '@/lib/auth';
import { Conversation, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = authService.getSavedUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationService.getConversations();
      if (response.success && response.data) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      Swal.fire('Error', 'Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation: Conversation): User | null => {
    if (!currentUser) return null;
    return conversation.participants.find(
      (p) => typeof p === 'object' && p._id !== currentUser.id && p.id !== currentUser.id
    ) as User || null;
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiMessageCircle className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            </div>
            <Link
              href="/messages/requests"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <FiInbox className="w-5 h-5" />
              <span>Message Requests</span>
            </Link>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {conversations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-6">
                Start a conversation by visiting a user&apos;s profile and sending them a message request.
              </p>
              <Link
                href="/events"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => {
                const otherUser = getOtherParticipant(conversation);
                if (!otherUser) return null;

                return (
                  <Link
                    key={conversation._id}
                    href={`/messages/${conversation._id}`}
                    className="block hover:bg-gray-50 transition p-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 overflow-hidden">
                        {otherUser.profileImage ? (
                          <img
                            src={otherUser.profileImage}
                            alt={otherUser.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getInitials(otherUser.name)
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {otherUser.name}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage
                              ? conversation.lastMessage.content
                              : 'No messages yet'}
                          </p>
                          {conversation.unreadCount && conversation.unreadCount > 0 && (
                            <span className="bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 ml-2">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
