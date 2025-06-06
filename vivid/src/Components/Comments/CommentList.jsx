import React, { useState, useEffect } from 'react';
import { getCommentsByPost, createComment } from '../../services/commentService';
import CommentItem from './CommentItem';
import './CommentList.css';

const CommentList = ({ postId, currentUser, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(true); // Add mounted state to prevent memory leaks
  useEffect(() => {
    setMounted(true);
    const fetchComments = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        const commentsData = await getCommentsByPost(postId);
        if (mounted) {
          setComments(commentsData || []);
          setError('');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (mounted) {
          setError('Failed to load comments');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (postId) {
      fetchComments();
    }

    return () => setMounted(false);
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      const commentData = {
        postId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhotoURL: currentUser.photoURL || null,
        content: newComment.trim()
      };
      
      const result = await createComment(commentData);
      
      if (result.success) {
        setNewComment('');
        const updatedComments = await getCommentsByPost(postId);
        setComments(updatedComments);
        if (onCommentAdded) onCommentAdded();
      } else {
        setError(result.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('An error occurred while posting your comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-section">      {currentUser && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="comment-input-container">
            {currentUser.photoURL ? (              <img 
                src={currentUser.photoURL} 
                alt="Your avatar" 
                className="comment-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  const placeholder = document.createElement('div');
                  placeholder.className = 'comment-avatar-placeholder';
                  placeholder.textContent = currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A';
                  e.target.parentElement.replaceChild(placeholder, e.target);
                }}
              />
            ) : (
              <div className="comment-avatar-placeholder">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="comment-input"
              disabled={submitting}
            />
          </div>
          
          {error && <div className="comment-error">{error}</div>}
          
          <button 
            type="submit" 
            className="comment-submit"
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      )}
      
      <div className="comments-list">
        {loading ? (
          <div className="comments-loading">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map(comment => (            <CommentItem 
              key={comment.id} 
              comment={{...comment, postId}} 
              currentUser={currentUser}
              onCommentDeleted={async () => {
                const updatedComments = await getCommentsByPost(postId);
                setComments(updatedComments);
                if (onCommentAdded) onCommentAdded();
              }}
            />
          ))
        ) : (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  );
};

export default CommentList;