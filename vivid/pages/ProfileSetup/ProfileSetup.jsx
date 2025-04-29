import React, { useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import "./ProfileSetup.css";
import placeholderProfilePic from "../../src/assets/ProfilePic.png";

const ProfileSetup = () => {
  const { currentUser } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [mood, setMood] = useState("");
  const [interests, setInterests] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const db = getFirestore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      alert("You must be logged in to set up your profile.");
      return;
    }

    setIsSaving(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, {
        uid: currentUser.uid,
        name,
        bio,
        mood,
        interests,
        profilePic: profilePic || placeholderProfilePic,
      });
      alert("Profile setup complete!");
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <h2>Set Up Your Profile</h2>
      <form className="profile-form">
        <label>Upload Profile Picture</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Short Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="3"
        />

        <label>Select Mood</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
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

        <button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;