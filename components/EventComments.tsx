'use client';

import { useState, useEffect } from 'react';
import { FiSend, FiThumbsUp, FiHeart, FiSmile, FiFrown, FiX } from 'react-icons/fi';
import { commentService, Comment } from '@/lib/comments';
import { authService } from '@/lib/auth';
import { formatDate } from '@/utils/helpers';
import Swal from 'sweetalert2';

interface EventCommentsProps {
  eventId: string;
}

export default function EventComments({ eventId }: EventCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const user = authService.getSavedUser();
    setCurrentUser(user);
    fetchComments();
  }, [eventId]);

  const fetchComments = async () => {
    try {
      const response = await commentService.getEventComments(eventId);
      if (response.success && response.data) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      Swal.fire('Error', 'Please login to comment', 'error');
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await commentService.createComment(eventId, newComment);
      if (response.success) {
        setNewComment('');
        fetchComments();
        Swal.fire('Success', 'Comment posted successfully', 'success');
      }
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const response = await commentService.updateComment(commentId, editText);
      if (response.success) {
        setEditingId(null);
        setEditText('');
        fetchComments();
        Swal.fire('Success', 'Comment updated', 'success');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to update comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Delete',
    });

    if (result.isConfirmed) {
      try {
        await commentService.deleteComment(commentId);
        fetchComments();
        Swal.fire('Deleted', 'Comment has been deleted', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete comment', 'error');
      }
    }
  };

  const handleReaction = async (commentId: string, type: any, currentUserReaction?: any) => {
    if (!currentUser) {
      Swal.fire('Error', 'Please login to react', 'error');
      return;
    }

    try {
      if (currentUserReaction?.type === type) {
        // Remove reaction if same type
        await commentService.removeReaction(commentId);
      } else {
        // Add or update reaction
        await commentService.addReaction(commentId, type);
      }
      fetchComments();
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
      case 'wow':
        return <FiSmile className="w-4 h-4" />;
      case 'sad':
        return <FiFrown className="w-4 h-4" />;
      default:
        return <FiThumbsUp className="w-4 h-4" />;
    }
  };

  const getReactionCount = (comment: Comment, type: string) => {
    return comment.reactions.filter((r) => r.type === type).length;
  };

  const getUserReaction = (comment: Comment) => {
    if (!currentUser) return null;
    return comment.reactions.find((r) => r.userId._id === currentUser.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {currentUser && (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              {currentUser.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt={currentUser.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-bold">
                  {currentUser.name?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-600 py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const userReaction = getUserReaction(comment);
            const isOwnComment = currentUser?.id === comment.userId._id;

            return (
              <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    {comment.userId.profileImage ? (
                      <img
                        src={comment.userId.profileImage}
                        alt={comment.userId.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-600 font-bold">
                        {comment.userId.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{comment.userId.name}</h4>
                        <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                      </div>
                      {isOwnComment && (
                        <div className="flex gap-2">
                          {editingId !== comment._id && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingId(comment._id);
                                  setEditText(comment.comment);
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {editingId === comment._id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                          rows={3}
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditText('');
                            }}
                            className="px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700 mb-3">{comment.comment}</p>

                        {/* Reactions */}
                        <div className="flex gap-4">
                          {['like', 'love', 'wow', 'sad'].map((type) => {
                            const count = getReactionCount(comment, type);
                            const isActive = userReaction?.type === type;

                            return (
                              <button
                                key={type}
                                onClick={() => handleReaction(comment._id, type, userReaction)}
                                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition ${
                                  isActive
                                    ? 'bg-blue-100 text-blue-600 font-semibold'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
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
