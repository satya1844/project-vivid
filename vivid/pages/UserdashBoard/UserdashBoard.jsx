import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../src/config/authConfig";
import './UserDashBoard.css';
import Loader from '../../src/assets/Loader';
import profileRectangle from '../../src/assets/profile-section-container.svg';

import profileBanner from '../../src/assets/placeholder-banner.png';
import placeholderProfilePic from '../../src/assets/ProfilePic.png';
import editPen from '../../src/assets/editPen.svg';
import EditProfile from '../../pages/editProfile/editProfile';
import { FaGithub, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa"; // Import social media icons

// Add this helper function at the top of your file
const truncateText = (text, wordLimit) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

function UserDashBoard() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define the missing states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [mood, setMood] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [lookingToLearn, setLookingToLearn] = useState([]);
  const [openToCollab, setOpenToCollab] = useState([]);
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser?.uid) {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
            console.log("Fetched userData:", userSnapshot.data()); // Debug log
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setBio(userData.bio || "");
      setMood(userData.mood || "");
      setLocation(userData.location || "");
      setSkills(userData.skills || []);
      setInterests(userData.interests || []);
      setLookingToLearn(userData.lookingToLearn || []);
      setOpenToCollab(userData.openToCollab || []);
      setSocialLinks(userData.socialLinks || {
        github: "",
        linkedin: "",
        instagram: "",
        twitter: "",
      });
      setIsLoading(false); // Data is loaded
    }
  }, [userData]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <img 
        src="../../src/assets/Rectangle-34.svg" 
        alt="Rectangle Decoration" 
        className="rectangle-34"
      />
      {/* Profile Section */}
      <div className="profile-section">
        <h1 className="name">{userData?.firstName} {userData?.lastName}</h1>
        {/* Add about section here */}
        <p className="about">
          {truncateText(userData?.bio || "No bio added yet.", 50)}
        </p>
        <p className="location">{userData?.location || "Puerto Rico"}</p>
        <p className="email">{userData?.email || "youremail@domain.com"}</p>
        <div>
          <img src={profileRectangle} alt="Profile Section" className="profile-section-image" />
        </div>
        
        {/* Profile Image with Edit Button */}
        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile"
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderProfilePic;
                }}
              />
            ) : (
              <div className="profile-placeholder">
                <img 
                  src={placeholderProfilePic}
                  alt="Default Profile"
                  className="profile-image"
                />
              </div>
            )}
            <button className="edit-button" onClick={handleEditClick}>
              <img src={editPen} alt="Edit" />
            </button>
          </div>
        </div>
  
        {/* Social Links */}
        <div className="socials">
          <h3>Socials:</h3>
          <div className="social-icons">
            {userData?.socialLinks?.github && (
              <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <FaGithub size={24} />
              </a>
            )}
            {userData?.socialLinks?.linkedin && (
              <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} />
              </a>
            )}
            {userData?.socialLinks?.instagram && (
              <a href={userData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} />
              </a>
            )}
            {userData?.socialLinks?.twitter && (
              <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div class="circle-blob yellow-blob"></div>
      <div class="circle-blob purple-blob"></div>


  
      {/* Skills, Interests, and Learning Grid */}
      <div className="info-grid">
        <div className="info-card">
          <h3>Skills</h3>
          <div className="tags">
            {userData?.skills?.length > 0 ? (
              userData.skills.map((skill, index) => (
                <span key={index} className="tag">{skill}</span>
              ))
            ) : (
              <span className="tag">No skills added</span>
            )}
          </div>
        </div>
  
        <div className="info-card">
          <h3>Interests</h3>
          <div className="tags">
            {userData?.interests?.length > 0 ? (
              userData.interests.map((interest, index) => (
                <span key={index} className="tag">{interest}</span>
              ))
            ) : (
              <span className="tag">No interests added</span>
            )}
          </div>
        </div>
  
        <div className="info-card">
          <h3>Looking to Learn</h3>
          <div className="tags">
            {userData?.lookingToLearn?.length > 0 ? (
              userData.lookingToLearn.map((item, index) => (
                <span key={index} className="tag">{item}</span>
              ))
            ) : (
              <span className="tag">Nothing to learn yet</span>
            )}
          </div>
        </div>
      </div>
  
      {/* Edit Profile Modal */}
      {isModalOpen && (
        <EditProfile
          onClose={handleCloseModal}
          userData={userData}
          userId={currentUser?.uid}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}

export default UserDashBoard;
