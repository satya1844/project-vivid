import React, { useState, useEffect } from 'react';
import PostCard from '../PostCard/PostCard';
import CreatePost from '../CreatePost/CreatePost';
import { getAllPosts } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import './PostFeed.css';
import Loader from '../../assets/Loader';

const PostFeed = ({ userId = null }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      let postsData;
      if (userId) {
        // If userId is provided, fetch only that user's posts
        postsData = await getPostsByUser(userId);
      } else {
        // Otherwise fetch all posts
        postsData = await getAllPosts();
      }
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  return (
    <div className="post-feed">
      {currentUser && !userId && (
        <CreatePost onPostCreated={handlePostCreated} />
      )}
      
      {loading ? (
        <div className="posts-loading">
          <Loader size="50" speed="1.75" color="yellow" fullScreen={false} />
        </div>
      ) : error ? (
        <div className="posts-error">{error}</div>
      ) : posts.length > 0 ? (
        posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onPostUpdate={fetchPosts}
          />
        ))
      ) : (
        <div className="no-posts">
          {userId ? 
            'This user hasn\'t posted anything yet.' : 
            'No posts yet. Be the first to post something!'}
        </div>
      )}
    </div>
  );
};

export default PostFeed;
