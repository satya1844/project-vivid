import React, { useState, useEffect } from "react";
import { updateGroup } from "../../services/groupService";
import "./GroupEditModal.css";

const GroupEditModal = ({ group, onClose, onUpdate }) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [type, setType] = useState("");
  const [rules, setRules] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with group data
  useEffect(() => {
    if (group) {
      setName(group.name || "");
      setBio(group.bio || "");
      setType(group.type || "");
      setRules(group.rules || "");
      setIsPublic(group.isPublic !== false); // Default to true if not specified
      setImagePreview(group.groupPic || "");
    }
  }, [group]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Prepare updated data
      const updatedData = {
        name,
        bio,
        type,
        rules,
        isPublic
      };

      // Call the update function
      const result = await updateGroup(group.id, updatedData, imageFile);

      if (result.success) {
        // Merge the updated data with the original group data
        const updatedGroup = {
          ...group,
          ...updatedData,
          // Only update groupPic if we have a result from the server
          ...(result.groupPicURL && { groupPic: result.groupPicURL })
        };

        // If no new image was uploaded, keep the existing one
        if (!imageFile) {
          updatedGroup.groupPic = group.groupPic;
        }

        onUpdate(updatedGroup);
        onClose();
      } else {
        setError(result.error || "Failed to update group");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group-edit-modal-overlay" onClick={onClose}>
      <div className="group-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="group-edit-modal-header">
          <h2>Edit Group</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group Image</label>
            <div className="image-upload-container">
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Group preview" />
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="image-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Group Name*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Group Rules</label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows="3"
              placeholder="Set guidelines for your group members"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Public Group (visible to everyone)
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button" 
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupEditModal;