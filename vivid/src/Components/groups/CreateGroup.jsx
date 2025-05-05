import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createGroup } from "../../services/groupService";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css";

const CreateGroup = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    type: "",
    rules: "Be respectful, no spam",
    isPublic: true
  });
  
  const [groupImage, setGroupImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file is too large. Please select an image under 5MB.");
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setError("Please select an image file (JPEG, PNG, etc).");
        return;
      }
      
      setGroupImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("You must be logged in to create a group");
      return;
    }
    
    if (!formData.name.trim()) {
      setError("Group name is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await createGroup(
        {
          ...formData,
          admin: currentUser.uid
        },
        groupImage
      );
      
      if (result.success) {
        navigate(`/groups/${result.groupId}`);
      } else {
        setError(result.error || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-container">
      <h2>Create a New Group</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Group Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bio">Description</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Group Type/Category</label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., Music, Sports, Technology"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="rules">Group Rules</label>
          <textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            Make this group public
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="groupImage">Group Image</label>
          <input
            type="file"
            id="groupImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Group preview" />
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="create-button"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Group"}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;