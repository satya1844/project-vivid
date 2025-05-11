import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PostActions from './PostActions';
import CommentList from '../Comments/CommentList';
import './PostCard.css';
import { formatDistanceToNow } from 'date-fns';
import placeholderProfilePic from '../../assets/ProfilePic.png'; // Import placeholder

const PostCard = ({ post, onPostUpdate }) => {
  const { currentUser } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  // Format the timestamp
  const formattedTime = post.createdAt ? 
    formatDistanceToNow(new Date(post.createdAt.toDate()), { addSuffix: true }) : 
    'Just now';
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="postcard">
      <div className="postcard-header">
        <Link to={`/userprofile/${post.userId}`} className="postcard-user-link">
          {post.userPhotoURL && !avatarError ? (
            <img 
              src={post.userPhotoURL} 
              alt="User Avatar" 
              className="avatar" 
              onError={(e) => {
                console.log("Avatar image failed to load:", post.userPhotoURL);
                setAvatarError(true);
                e.target.onerror = null;
                e.target.src = placeholderProfilePic; // Use the imported placeholder
              }}
            />
          ) : (
            <div className="avatar-placeholder">
              {post.userName ? post.userName.charAt(0).toUpperCase() : 'A'}
            </div>
          )}
        </Link>
        
        <div className="postcard-userinfo">
          <Link to={`/userprofile/${post.userId}`} className="username-link">
            <p className="username">{post.userName || 'Anonymous'}</p>
          </Link>
          <p className="post-time">{formattedTime}</p>
        </div>
      </div>

      <div className="postcard-content">
        {post.title && <h3 className="post-title">{post.title}</h3>}
        
        {post.content && (
          <p className="post-text">{post.content}</p>
        )}
        
        {post.imageUrl && (
          <div className="post-image-container">
            <img src={post.imageUrl} alt="Post content" className="post-image" />
          </div>
        )}
      </div>

      <PostActions 
        post={post} 
        currentUser={currentUser} 
        onToggleComments={toggleComments}
        onPostUpdate={onPostUpdate}
      />
      
      {showComments && (
        <CommentList 
          postId={post.id} 
          currentUser={currentUser}
          onCommentAdded={onPostUpdate}
        />
      )}
    </div>
  );
};

export default PostCard;
