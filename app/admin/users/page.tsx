'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUsers, 
  FiSearch, 
  FiShield, 
  FiTrash2, 
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiArrowLeft,
  FiEye,
} from 'react-icons/fi';
import { authService } from '@/lib/auth';
import { adminService } from '@/lib/admin';
import Swal from 'sweetalert2';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  hostedEvents: number;
  joinedEvents: number;
  createdAt: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: '',
    page: 1,
    limit: 10,
  });
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
    fetchUsers();
  }, [filters.page, filters.role, filters.isActive]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      };
      
      if (filters.role) params.role = filters.role;
      if (filters.isActive !== '') params.isActive = filters.isActive;
      if (filters.search) params.search = filters.search;

      const response = await adminService.getAllUsers(params);
      if (response.success && response.data) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchUsers();
  };

  const handleToggleStatus = async (userId: string, userName: string, currentStatus: boolean) => {
    const action = currentStatus ? 'block' : 'unblock';
    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `Are you sure you want to ${action} ${userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      confirmButtonColor: currentStatus ? '#dc2626' : '#10b981',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.toggleUserStatus(userId);
        if (response.success) {
          Swal.fire('Success', `User ${action}ed successfully`, 'success');
          fetchUsers();
        }
      } catch (error) {
        Swal.fire('Error', `Failed to ${action} user`, 'error');
      }
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      try {
        const response = await adminService.deleteUser(userId);
        if (response.success) {
          Swal.fire('Deleted', 'User deleted successfully', 'success');
          fetchUsers();
        }
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to delete user';
        Swal.fire('Error', message, 'error');
      }
    }
  };

  const handleChangeRole = async (userId: string, userName: string, currentRole: string) => {
    const { value: newRole } = await Swal.fire({
      title: `Change Role for ${userName}`,
      input: 'select',
      inputOptions: {
        User: 'User',
        Host: 'Host',
        Admin: 'Admin',
      },
      inputValue: currentRole,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to select a role!';
        }
        return null;
      },
    });

    if (newRole && newRole !== currentRole) {
      try {
        const response = await adminService.updateUserRole(userId, newRole);
        if (response.success) {
          Swal.fire('Success', 'User role updated successfully', 'success');
          fetchUsers();
        }
      } catch (error) {
        Swal.fire('Error', 'Failed to update user role', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FiUsers className="text-3xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage all users, roles, and permissions</p>
            </div>
          </div>

          {/* Filters */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Roles</option>
                <option value="User">User</option>
                <option value="Host">Host</option>
                <option value="Admin">Admin</option>
              </select>
              <select
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Blocked</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Events</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Joined</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'Host' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {user.isActive ? (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <FiCheckCircle /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 text-sm">
                              <FiXCircle /> Blocked
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-gray-900">{user.hostedEvents}</td>
                        <td className="px-4 py-4 text-gray-900">{user.joinedEvents}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={user.role === 'Host' ? `/host/${user.id}` : `/user/${user.id}`}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="View Profile"
                            >
                              <FiEye />
                            </Link>
                            <button
                              onClick={() => handleChangeRole(user.id, user.name, user.role)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Change Role"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user.id, user.name, user.isActive)}
                              className={`p-2 rounded-lg transition ${
                                user.isActive 
                                  ? 'text-orange-600 hover:bg-orange-50' 
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={user.isActive ? 'Block User' : 'Unblock User'}
                            >
                              <FiShield />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete User"
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
