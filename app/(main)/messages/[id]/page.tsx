'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSend, FiUser } from 'react-icons/fi';
import { conversationService } from '@/lib/conversations';
import { messageService } from '@/lib/messages';
import { authService } from '@/lib/auth';
import { Conversation, Message, User } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Swal from 'sweetalert2';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = authService.getSavedUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    fetchConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const [convResponse, messagesResponse] = await Promise.all([
        conversationService.getConversation(params.id as string),
        messageService.getMessages(params.id as string),
      ]);

      if (convResponse.success && convResponse.data) {
        setConversation(convResponse.data.conversation);
        const user = authService.getSavedUser();
        if (user) {
          const other = convResponse.data.conversation.participants.find(
            (p) => typeof p === 'object' && p._id !== user.id && p.id !== user.id
          ) as User;
          setOtherUser(other);
        }
      }

      if (messagesResponse.success && messagesResponse.data) {
        setMessages(messagesResponse.data.messages);
      }

      // Mark messages as read
      await messageService.markAsRead(params.id as string);
      
      // Notify navbar to update unread count
      window.dispatchEvent(new Event('unread-count-changed'));
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      Swal.fire('Error', 'Failed to load conversation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const response = await messageService.sendMessage(params.id as string, newMessage.trim());
      
      if (response.success && response.data) {
        setMessages([...messages, response.data.message]);
        setNewMessage('');
        
        // Notify navbar to update unread count (in case other user sends message simultaneously)
        window.dispatchEvent(new Event('unread-count-changed'));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      Swal.fire('Error', 'Failed to send message', 'error');
    } finally {
      setSending(false);
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

  if (!conversation || !otherUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversation Not Found</h2>
          <Link href="/messages" className="text-purple-600 hover:text-purple-700">
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/messages"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <FiArrowLeft className="w-6 h-6" />
          </Link>

          <Link
            href={`/user/${otherUser._id || otherUser.id}`}
            className="flex items-center gap-3 flex-1 hover:opacity-80 transition"
          >
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
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
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{otherUser.name}</h2>
              <p className="text-sm text-gray-500">{otherUser.role}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isSender = typeof message.senderId === 'object' 
                ? message.senderId._id === currentUser?.id || message.senderId.id === currentUser?.id
                : message.senderId === currentUser?.id;

              return (
                <div
                  key={message._id}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                      isSender
                        ? 'bg-purple-400 text-white'
                        : 'bg-white text-gray-900 shadow-md'
                    }`}
                  >
                    <p className="wrap-break-word">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isSender ? 'text-purple-100' : 'text-gray-500'
                      }`}
                    >
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
