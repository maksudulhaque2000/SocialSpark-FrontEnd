'use client';

import { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiHeart, FiAward, FiEdit, FiTrash2 } from 'react-icons/fi';
import { reviewService, Review } from '@/lib/reviews';
import { authService } from '@/lib/auth';
import { formatDate } from '@/utils/helpers';
import Swal from 'sweetalert2';

interface EventReviewsProps {
  eventId: string;
  eventStatus: string;
  hostId: string;
}

export default function EventReviews({ eventId, eventStatus, hostId }: EventReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    const user = authService.getSavedUser();
    setCurrentUser(user);
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getEventReviews(eventId);
      if (response.success && response.data) {
        // Handle both array and object with reviews property
        const reviewsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.reviews || [];
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      Swal.fire('Error', 'Please login to review', 'error');
      return;
    }

    if (comment.length < 10) {
      Swal.fire('Error', 'Review must be at least 10 characters', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await reviewService.createReview({
        eventId,
        hostId,
        rating,
        comment,
      });
      if (response.success) {
        setShowForm(false);
        setRating(5);
        setComment('');
        fetchReviews();
        Swal.fire('Success', 'Review posted successfully', 'success');
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to post review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (editComment.length < 10) {
      Swal.fire('Error', 'Review must be at least 10 characters', 'error');
      return;
    }

    try {
      const response = await reviewService.updateReview(reviewId, {
        rating: editRating,
        comment: editComment,
      });
      if (response.success) {
        setEditingId(null);
        fetchReviews();
        Swal.fire('Success', 'Review updated', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update review', 'error');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
      title: 'Delete Review?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete',
    });

    if (result.isConfirmed) {
      try {
        await reviewService.deleteReview(reviewId);
        fetchReviews();
        Swal.fire('Deleted', 'Review has been deleted', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete review', 'error');
      }
    }
  };

  const handleReaction = async (reviewId: string, type: any, currentUserReaction?: any) => {
    if (!currentUser) {
      Swal.fire('Error', 'Please login to react', 'error');
      return;
    }

    try {
      if (currentUserReaction?.type === type) {
        await reviewService.removeReaction(reviewId);
      } else {
        await reviewService.addReaction(reviewId, type);
      }
      fetchReviews();
    } catch (error) {
      Swal.fire('Error', 'Failed to update reaction', 'error');
    }
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FiThumbsUp className="w-4 h-4" />;
      case 'love':
        return <FiHeart className="w-4 h-4" />;
      case 'helpful':
        return <FiAward className="w-4 h-4" />;
      case 'insightful':
        return <FiStar className="w-4 h-4" />;
      default:
        return <FiThumbsUp className="w-4 h-4" />;
    }
  };

  const getReactionCount = (review: Review, type: string) => {
    return review.reactions?.filter((r) => r.type === type).length || 0;
  };

  const getUserReaction = (review: Review) => {
    if (!currentUser || !review.reactions) return null;
    return review.reactions.find((r) => r.userId && r.userId._id === currentUser.id);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition`}
          >
            <FiStar
              className={`w-5 h-5 ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const canReview = eventStatus === 'completed' && currentUser && currentUser.id !== hostId;
  const userHasReviewed = Array.isArray(reviews) && reviews.some((r) => r.userId && r.userId._id === currentUser?.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Reviews ({reviews.length})
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {renderStars(parseFloat(averageRating))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
              <span className="text-gray-600">out of 5</span>
            </div>
          )}
        </div>

        {canReview && !userHasReviewed && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Your Review</h4>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Comment (10-500 characters)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this event..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              rows={4}
              minLength={10}
              maxLength={500}
            />
            <p className="text-sm text-gray-600 mt-1">{comment.length}/500 characters</p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || comment.length < 10}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setRating(5);
                setComment('');
              }}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-600 py-8">
          No reviews yet. {canReview && !userHasReviewed && 'Be the first to review!'}
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const userReaction = getUserReaction(review);
            const isOwnReview = currentUser?.id === review.userId?._id;

            return (
              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    {review.userId?.profileImage ? (
                      <img
                        src={review.userId.profileImage}
                        alt={review.userId?.name || 'User'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-lg">
                        {review.userId?.name?.charAt(0) ?? 'U'}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.userId?.name || 'User'}</h4>
                        <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                      </div>
                      {isOwnReview && editingId !== review._id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(review._id);
                              setEditRating(review.rating);
                              setEditComment(review.comment);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-2"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === review._id ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-3">
                          <label className="block text-gray-700 mb-2 text-sm">Rating</label>
                          {renderStars(editRating, true, setEditRating)}
                        </div>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                          rows={3}
                          minLength={10}
                          maxLength={500}
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => handleUpdateReview(review._id)}
                            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {/* Reactions */}
                        <div className="flex gap-4">
                          {['like', 'love', 'helpful', 'insightful'].map((type) => {
                            const count = getReactionCount(review, type);
                            const isActive = userReaction?.type === type;

                            return (
                              <button
                                key={type}
                                onClick={() => handleReaction(review._id, type, userReaction)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
                                  isActive
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={type.charAt(0).toUpperCase() + type.slice(1)}
                              >
                                {getReactionIcon(type)}
                                {count > 0 && <span>{count}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
