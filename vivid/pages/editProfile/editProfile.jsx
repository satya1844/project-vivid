import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore"; // Use setDoc for updating
import { db } from "../../src/config/authConfig";
import "./editProfile.css";

const EditProfile = ({ onClose, userData, userId, onProfileUpdate }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [mood, setMood] = useState("");
  const [interests, setInterests] = useState([]);

  // Populate fields with user data when the component mounts
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setBio(userData.bio || "");
      setMood(userData.mood || "");
      setInterests(userData.interests || []);
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      // Update the user's document in Firestore
      const userDoc = doc(db, "users", userId); // Use the user's UID as the document ID
      const updatedData = {
        firstName,
        lastName,
        bio,
        mood,
        interests,
        timestamp: new Date(),
      };
      await setDoc(userDoc, updatedData);

      // Call the callback to update the parent component's state
      onProfileUpdate(updatedData);

      alert("Profile updated!");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Intro</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <label htmlFor="firstName">First name*</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last name*</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="bio">Short Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
          />

          <label htmlFor="mood">Select Mood</label>
          <select id="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">-- Select Mood --</option>
            <option value="Ready to Learn">Ready to Learn</option>
            <option value="Open to Connect">Open to Connect</option>
            <option value="Chilling Today">Chilling Today</option>
            <option value="Looking for Ideas">Looking for Ideas</option>
          </select>

          <label>Choose Interests</label>
          <div className="checkbox-group">
            {["🎨 Art", "🎶 Music", "📚 Reading", "💻 Coding"].map((interest) => (
              <label key={interest}>
                <input
                  type="checkbox"
                  checked={interests.includes(interest)}
                  onChange={() =>
                    setInterests((prev) =>
                      prev.includes(interest)
                        ? prev.filter((i) => i !== interest)
                        : [...prev, interest]
                    )
                  }
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
