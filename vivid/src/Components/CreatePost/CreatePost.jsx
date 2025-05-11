import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../services/postService';
import './CreatePost.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/authConfig';

const CreatePost = ({ onPostCreated }) => {
  const { currentUser } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      setError('Please add some content or an image to your post');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get the latest user data from Firestore to ensure we have the current photoURL
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      // Upload image to Cloudinary if present
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'vivid_unsigned');
        
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/drvtmc9ps/image/upload',
          {
            method: 'POST',
            body: formData
          }
        );

        // In CreatePost.jsx, add this before creating the post
console.log("User photo URL being saved:", userData.photoURL || currentUser.photoURL || null);
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        imageUrl = data.secure_url;
      }
      
      // Create post data with the latest photoURL from Firestore
      const postData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || userData.firstName + ' ' + userData.lastName || 'Anonymous',
        userPhotoURL: userData.photoURL || currentUser.photoURL || null,
        title: title.trim(),
        content: content.trim(),
        imageUrl: imageUrl
      };
      
      const result = await createPost(postData);
      
      if (result.success) {
        // Clear form
        setContent('');
        setTitle('');
        setImage(null);
        setImagePreview(null);
        
        // Notify parent component
        if (onPostCreated) {
          onPostCreated();
        }
      } else {
        setError(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('An error occurred while creating your post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <h3 className="create-post-title">Create a Post</h3>
      
      {error && <div className="create-post-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="create-post-title-input"
          maxLength={100}
        />
        
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-content"
          rows={4}
        />
        
        {imagePreview && (
          <div className="create-post-image-preview">
            <img src={imagePreview} alt="Preview" />
            <button 
              type="button" 
              onClick={handleRemoveImage}
              className="create-post-remove-image"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="create-post-actions">
          <div className="create-post-upload">
            <label htmlFor="post-image" className="create-post-upload-label">
              <i className="fas fa-image"></i> Add Image
            </label>
            <input
              id="post-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="create-post-upload-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="create-post-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;