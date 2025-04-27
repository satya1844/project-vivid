// src/Components/PostCard/PostCard.jsx

import React from 'react';
import './PostCard.css';
import PostFeed from '../PostFeed/PostFeed';

const PostCard = ({ post }) => {
  return (
    <div className="postcard">
      <div className="postcard-header">
        <img src={post.userAvatar} alt="User Avatar" className="avatar" />
        <div className="postcard-userinfo">
          <p className="username">{post.username}</p>
          <p className="post-time">{post.time}</p>
        </div>
      </div>

      <div className="postcard-content">
        <h3 className="post-title">{post.title}</h3>
        {post.image && (
          <img src={post.image} alt="Post content" className="post-image" />
        )}
        {post.text && (
          <p className="post-text">{post.text}</p>
        )}
      </div>

      
    </div>
  );
};

export default PostCard;
