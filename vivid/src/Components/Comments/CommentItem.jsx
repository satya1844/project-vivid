import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteComment } from '../../services/commentService';
import { formatDistanceToNow } from 'date-fns';
import './CommentItem.css';

const CommentItem = ({ comment, currentUser, onCommentDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Format the timestamp
  const formattedTime = comment.createdAt ? 
    formatDistanceToNow(new Date(comment.createdAt.toDate()), { addSuffix: true }) : 
    'Just now';
  
  const isAuthor = currentUser?.uid === comment.userId;
  
  const handleDeleteComment = async () => {
    if (!currentUser || !isAuthor) return;
    if (isDeleting) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      
      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="comment-item">
      <Link to={`/userprofile/${comment.userId}`} className="comment-user-link">
        {comment.userPhotoURL ? (
          <img src={comment.userPhotoURL} alt="User avatar" className="comment-avatar" />
        ) : (
          <div className="comment-avatar-placeholder">
            {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'A'}
          </div>
        )}
      </Link>
      
      <div className="comment-content">
        <div className="comment-header">
          <Link to={`/userprofile/${comment.userId}`} className="comment-username-link">
            <span className="comment-username">{comment.userName || 'Anonymous'}</span>
          </Link>
          <span className="comment-time">{formattedTime}</span>
        </div>
        
        <p className="comment-text">{comment.content}</p>
      </div>
      
      {isAuthor && (
        <div className="comment-options">
          <button 
            className="comment-options-button"
            onClick={toggleOptions}
            aria-label="Comment options"
          >
            <i className="fas fa-ellipsis-h"></i>
          </button>
          
          {showOptions && (
            <div className="comment-options-dropdown">
              <button 
                className="comment-option-item delete-option"
                onClick={handleDeleteComment}
                disabled={isDeleting}
              >
                <i className="fas fa-trash"></i>
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;