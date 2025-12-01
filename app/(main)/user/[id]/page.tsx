'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiUsers,
} from 'react-icons/fi';
import { userService } from '@/lib/users';
import { User } from '@/types';
import { formatDate } from '@/utils/helpers';
import Swal from 'sweetalert2';

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getUser(params.id as string);
      if (response.success && response.data) {
        setUser(response.data.user);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load user profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <Link href="/events" className="text-blue-600 hover:text-blue-700">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl overflow-hidden flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="w-16 h-16" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-3">
                <FiMail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              
              <div className="mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  user.role === 'Host' ? 'bg-green-100 text-green-800' :
                  user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user.role}
                </span>
              </div>

              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}

              {user.interests && user.interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>Member since {formatDate(user.createdAt, 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-3">
              <FiUser className="w-5 h-5 text-blue-600" />
              <span><strong>Name:</strong> {user.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-blue-600" />
              <span><strong>Email:</strong> {user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiCalendar className="w-5 h-5 text-blue-600" />
              <span><strong>Joined:</strong> {formatDate(user.createdAt, 'EEEE, MMMM dd, yyyy')}</span>
            </div>
            {user.role === 'Host' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href={`/host/${user.id}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <FiUsers />
                  <span>View Host Profile</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
