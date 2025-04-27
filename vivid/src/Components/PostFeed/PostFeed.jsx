import React from 'react';
import PostCard from '../PostCard/PostCard';
import './PostFeed.css';

const postData = [
  {
    id: 1,
    username: "John Doe",
    userAvatar: "https://via.placeholder.com/40",
    time: "2 hours ago",
    title: "My First Post",
    text: "This is my first post on the platform! Excited to be here!",
    image: "https://via.placeholder.com/500x300",
    likes: 15,
    comments: 5
  },
  {
    id: 2,
    username: "Jane Smith",
    userAvatar: "https://via.placeholder.com/40",
    time: "5 hours ago",
    title: "Amazing Discovery",
    text: "Just found this incredible new technology that could change everything!",
    image: "https://via.placeholder.com/500x300",
    likes: 32,
    comments: 8
  },
  // Add more posts as needed
];

const PostFeed = () => {
  return (
    <div className="post-feed">
      {postData.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
