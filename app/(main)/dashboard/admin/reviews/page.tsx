'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { websiteReviewService } from '@/lib/websiteReviews';
import { WebsiteReview } from '@/types';
import { FiStar, FiCheck, FiX, FiTrash2, FiClock } from 'react-icons/fi';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<WebsiteReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [filter, page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'pending') {
        response = await websiteReviewService.getPendingReviews({ page, limit: 10 });
      } else if (filter === 'all') {
        response = await websiteReviewService.getAllReviews({ page, limit: 10 });
      } else {
        response = await websiteReviewService.getAllReviews({
          page,
          limit: 10,
          status: filter,
        });
      }

      if (response.success && response.data) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch reviews',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: 'Approve Review?',
      text: 'This review will be visible to all users.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setProcessingId(id);
    try {
      const response = await websiteReviewService.approveReview(id);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: 'Review has been approved successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        fetchReviews();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to approve review',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const result = await Swal.fire({
      title: 'Reject Review?',
      text: 'This review will be marked as rejected.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setProcessingId(id);
    try {
      const response = await websiteReviewService.rejectReview(id);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Rejected!',
          text: 'Review has been rejected.',
          timer: 2000,
          showConfirmButton: false,
        });
        fetchReviews();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to reject review',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: 'This action cannot be undone!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    setProcessingId(id);
    try {
      const response = await websiteReviewService.deleteReview(id);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Review has been deleted permanently.',
          timer: 2000,
          showConfirmButton: false,
        });
        fetchReviews();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete review',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusColors[status as keyof typeof statusColors]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Website Reviews Management</h1>
          <p className="text-gray-600 mt-2">Manage user reviews for the website</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilter('pending');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiClock className="inline mr-2" />
              Pending
            </button>
            <button
              onClick={() => {
                setFilter('approved');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'approved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiCheck className="inline mr-2" />
              Approved
            </button>
            <button
              onClick={() => {
                setFilter('rejected');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'rejected'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiX className="inline mr-2" />
              Rejected
            </button>
            <button
              onClick={() => {
                setFilter('all');
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Reviews
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {review.name?.charAt(0).toUpperCase() || review.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{review.name || 'Unknown User'}</h3>
                      <p className="text-gray-500 text-sm">{review.email || 'No email'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <FiStar key={i} className="w-4 h-4 fill-current text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(review.status)}</div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 italic">&quot;{review.comment}&quot;</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review._id)}
                        disabled={processingId === review._id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FiCheck />
                        {processingId === review._id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(review._id)}
                        disabled={processingId === review._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <FiX />
                        {processingId === review._id ? 'Processing...' : 'Reject'}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={processingId === review._id}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
                  >
                    <FiTrash2 />
                    {processingId === review._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
