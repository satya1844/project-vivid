import React, { useState } from 'react';
import { likePost, unlikePost, deletePost } from '../../services/postService';
import './PostActions.css';

const PostActions = ({ post, currentUser, onToggleComments, onPostUpdate }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const isLiked = post.likes && post.likes.includes(currentUser?.uid);
  const likeCount = post.likes ? post.likes.length : 0;
  const commentCount = post.commentCount || 0;
  const isAuthor = currentUser?.uid === post.userId;
  
  const handleLikeToggle = async () => {
    if (!currentUser) return;
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikePost(post.id, currentUser.uid);
      } else {
        await likePost(post.id, currentUser.uid);
      }
      
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };
  
  const handleDeletePost = async () => {
    if (!currentUser || !isAuthor) return;
    if (isDeleting) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      
      if (onPostUpdate) {
        onPostUpdate();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="post-actions">
      <div className="post-actions-stats">
        {likeCount > 0 && (
          <span className="post-stat">
            <i className="fas fa-heart"></i> {likeCount}
          </span>
        )}
        
        {commentCount > 0 && (
          <span className="post-stat">
            <i className="fas fa-comment"></i> {commentCount}
          </span>
        )}
      </div>
      
      <div className="post-actions-buttons">
        <button 
          className={`post-action-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLikeToggle}
          disabled={isLiking || !currentUser}
        >
          <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
          <span>Like</span>
        </button>
        
        <button 
          className="post-action-button"
          onClick={onToggleComments}
        >
          <i className="far fa-comment"></i>
          <span>Comment</span>
        </button>
        
        {isAuthor && (
          <div className="post-options">
            <button 
              className="post-action-button options-button"
              onClick={toggleOptions}
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>
            
            {showOptions && (
              <div className="post-options-dropdown">
                <button 
                  className="post-option-item delete-option"
                  onClick={handleDeletePost}
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
    </div>
  );
};

export default PostActions;