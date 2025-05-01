import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../src/config/authConfig";
import "./editProfile.css";
import Loader from "../../src/assets/Loader"; // Import the Loader component

const EditProfile = ({ onClose, userData, userId, onProfileUpdate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(""); // New email field
  const [bio, setBio] = useState("");
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [lookingToLearn, setLookingToLearn] = useState([]);
  const [openToCollab, setOpenToCollab] = useState([]);
  const [bannerImage, setBannerImage] = useState(""); // New banner image field
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });

  useEffect(() => {
    if (!userData) {
      console.error("Error: userData is null or undefined.");
      return;
    }

    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");
    setEmail(userData.email || ""); // Pre-fill email
    setBio(userData.bio || "");
    setMood(userData.mood || "");
    setLocation(userData.location || "");
    setSkills(userData.skills || []);
    setInterests(userData.interests || []);
    setLookingToLearn(userData.lookingToLearn || []);
    setOpenToCollab(userData.openToCollab || []);
    setBannerImage(userData.bannerImage || ""); // Pre-fill banner image
    setSocialLinks(userData.socialLinks || {
      github: "",
      linkedin: "",
      instagram: "",
      twitter: "",
    });
    setIsLoading(false); // Stop loading once data is pre-filled
  }, [userData]);

  const handleSave = async () => {
    try {
      if (!userData) {
        console.error("Error: userData is null or undefined.");
        alert("Failed to update profile. Please try again.");
        return;
      }

      const userDoc = doc(db, "users", userId);

      const updatedData = {};
      if (firstName !== userData.firstName) updatedData.firstName = firstName;
      if (lastName !== userData.lastName) updatedData.lastName = lastName;
      if (email !== userData.email) updatedData.email = email; // Update email
      if (bio !== userData.bio) updatedData.bio = bio;
      if (mood !== userData.mood) updatedData.mood = mood;
      if (location !== userData.location) updatedData.location = location;
      if (JSON.stringify(skills) !== JSON.stringify(userData.skills)) updatedData.skills = skills;
      if (JSON.stringify(interests) !== JSON.stringify(userData.interests)) updatedData.interests = interests;
      if (JSON.stringify(lookingToLearn) !== JSON.stringify(userData.lookingToLearn)) updatedData.lookingToLearn = lookingToLearn;
      if (JSON.stringify(openToCollab) !== JSON.stringify(userData.openToCollab)) updatedData.openToCollab = openToCollab;
      if (bannerImage !== userData.bannerImage) updatedData.bannerImage = bannerImage; // Update banner image
      if (JSON.stringify(socialLinks) !== JSON.stringify(userData.socialLinks)) updatedData.socialLinks = socialLinks;

      console.log("User ID:", userId);
      console.log("Updated Data:", updatedData);

      if (Object.keys(updatedData).length > 0) {
        updatedData.timestamp = new Date();
        await updateDoc(userDoc, updatedData);

        onProfileUpdate({ ...userData, ...updatedData });
        alert("Profile updated!");
      } else {
        alert("No changes made.");
      }

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return <Loader />; // Show the Loader while data is being pre-filled
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Form Fields */}
          <label htmlFor="firstName">First Name*</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label htmlFor="lastName">Last Name*</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label htmlFor="email">Email*</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label htmlFor="skills">Skills (comma-separated)</label>
          <input
            id="skills"
            type="text"
            value={skills.join(", ")}
            onChange={(e) => setSkills(e.target.value.split(",").map((skill) => skill.trim()))}
          />

          <label htmlFor="interests">Interests (comma-separated)</label>
          <input
            id="interests"
            type="text"
            value={interests.join(", ")}
            onChange={(e) => setInterests(e.target.value.split(",").map((interest) => interest.trim()))}
          />

          <label htmlFor="lookingToLearn">Looking to Learn (comma-separated)</label>
          <input
            id="lookingToLearn"
            type="text"
            value={lookingToLearn.join(", ")}
            onChange={(e) => setLookingToLearn(e.target.value.split(",").map((item) => item.trim()))}
          />

          <label htmlFor="openToCollab">Open to Collaborate (comma-separated)</label>
          <input
            id="openToCollab"
            type="text"
            value={openToCollab.join(", ")}
            onChange={(e) => setOpenToCollab(e.target.value.split(",").map((item) => item.trim()))}
          />

          <label htmlFor="bannerImage">Banner Image URL</label>
          <input
            id="bannerImage"
            type="text"
            value={bannerImage}
            onChange={(e) => setBannerImage(e.target.value)}
            placeholder="Enter the URL of your banner image"
          />

          <h3>Social Links</h3>
          <label htmlFor="github">GitHub</label>
          <input
            id="github"
            type="text"
            value={socialLinks.github}
            onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
          />

          <label htmlFor="linkedin">LinkedIn</label>
          <input
            id="linkedin"
            type="text"
            value={socialLinks.linkedin}
            onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
          />

          <label htmlFor="instagram">Instagram</label>
          <input
            id="instagram"
            type="text"
            value={socialLinks.instagram}
            onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
          />

          <label htmlFor="twitter">Twitter</label>
          <input
            id="twitter"
            type="text"
            value={socialLinks.twitter}
            onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
          />
        </div>

        <div className="modal-footer">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
