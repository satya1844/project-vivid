import React, { useState } from "react";
import './editProfile.css'; // for the styling

const moods = [
  "Ready to Learn",
  "Open to Connect",
  "Chilling Today",
  "Looking for Ideas",
];

const interestOptions = [
  "🎨 Art",
  "🎶 Music",
  "📚 Reading",
  "💻 Coding",
  "🧘‍♀ Mindfulness",
  "🎮 Gaming",
];

const ProfileSetup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [mood, setMood] = useState("");
  const [interests, setInterests] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleInterestChange = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    alert("Profile Saved! 🚀");
    console.log({ name, bio, mood, interests });
  };

  return (
    <div className="profile-setup-container">
      <div className="preview-card">
        <h2>Live Preview</h2>
        {profilePic && <img src={profilePic} alt="Profile" />}
        <h3>{name || "Your Name"}</h3>
        <p>{bio || "A short bio will appear here..."}</p>
        <p className="mood">{mood && `🌟 ${mood}`}</p>
        <div className="tags">
          {interests.map((i, idx) => (
            <span key={idx} className="tag">{i}</span>
          ))}
        </div>
      </div>

      <form className="profile-form">
        <label>Upload Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Short Bio (max 2-3 lines)</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" />

        <label>Select Mood</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="">-- Select Mood --</option>
          {moods.map((m, idx) => (
            <option key={idx} value={m}>{m}</option>
          ))}
        </select>

        <label>Choose Interests</label>
        <div className="checkbox-group">
          {interestOptions.map((interest, idx) => (
            <label key={idx} className="checkbox-item">
              <input
                type="checkbox"
                checked={interests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
              />
              {interest}
            </label>
          ))}
        </div>

        <button type="button" onClick={handleSave}>Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
