import React, { useState } from "react";
import "./editProfile.css";

const EditProfile = ({ onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [mood, setMood] = useState("");
  const [interests, setInterests] = useState([]);

  const handleSave = () => {
    // Save logic here
    alert("Profile updated!");
    onClose(); // Close the modal
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Edit Intro</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
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

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
