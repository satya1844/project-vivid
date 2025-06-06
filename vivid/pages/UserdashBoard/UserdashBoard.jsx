import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../src/context/AuthContext';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../src/config/authConfig";
import { FaGithub, FaInstagram, FaTwitter, FaLinkedin, FaUserFriends } from "react-icons/fa";

// Components
import Loader from '../../src/assets/Loader';
import EditProfile from '../../pages/editProfile/editProfile';
import PostFeed from '../../src/Components/PostFeed/PostFeed';

// Assets
import profileRectangle from '../../src/assets/user-section-image.svg';
import Rectangle34 from '../../src/assets/Rectangle-34.svg';
import profileBanner from '../../src/assets/placeholder-banner.png';
import placeholderProfilePic from '../../src/assets/ProfilePic.png';
import editPen from '../../src/assets/editPen.svg';

// Services
import { getUserConnections } from "../../src/services/connectionService";

// Styles
import './UserDashBoard.css';

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
  const [connections, setConnections] = useState([]);
  const [connectionProfiles, setConnectionProfiles] = useState([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);

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
            console.log("Fetched userData:", userSnapshot.data());
          } else {
            // Create a new user document if it doesn't exist
            const newUserData = {
              firstName: currentUser.displayName?.split(' ')[0] || '',
              lastName: currentUser.displayName?.split(' ')[1] || '',
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              bio: '',
              location: '',
              skills: [],
              interests: [],
              lookingToLearn: [],
              openToCollab: [],
              socialLinks: {
                github: '',
                linkedin: '',
                instagram: '',
                twitter: ''
              },
              createdAt: new Date()
            };

            await setDoc(userDoc, newUserData);
            setUserData(newUserData);
            console.log("Created new user document:", newUserData);
          }
        }
      } catch (error) {
        console.error("Error fetching/creating user data:", error);
      } finally {
        setIsLoading(false);
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

  // Fetch user connections
  // Replace the connections useEffect with this updated version
  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setIsLoadingConnections(true);
        const userConnections = await getUserConnections(currentUser.uid);
        setConnections(userConnections);
        
        // Extract the connected user IDs (excluding current user)
        const connectedUserIds = userConnections.flatMap(conn => 
          conn.users.filter(id => id !== currentUser.uid)
        );
        
        // Remove duplicate user IDs
        const uniqueUserIds = [...new Set(connectedUserIds)];
        
        // Fetch user profiles for each unique connection
        if (uniqueUserIds.length > 0) {
          const profiles = [];
          
          for (const userId of uniqueUserIds) {
            const userDoc = doc(db, "users", userId);
            const userSnapshot = await getDoc(userDoc);
            
            if (userSnapshot.exists()) {
              profiles.push({
                id: userId,
                ...userSnapshot.data()
              });
            }
          }
          
          setConnectionProfiles(profiles);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setIsLoadingConnections(false);
      }
    };

    fetchConnections();
  }, [currentUser]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <p>Please log in to view your dashboard</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <Loader />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      
      {/* Profile Section */}
      <div className="user-dashbard-profile-section">
        <h1 className="name">{userData?.firstName} {userData?.lastName}</h1>
        {/* Add about section here */}
        <p className="about">
          {truncateText(userData?.bio || "No bio added yet.", 50)}
        </p>        <p className="location">{userData?.location || "Puerto Rico"}</p>
        <p className="email">{userData?.email || "youremail@domain.com"}</p>
        <div className="decorative-images">
          <img 
            src={profileRectangle} 
            alt="Profile Section" 
            className="profile1-section-image" 
          />
          <img 
            src={Rectangle34}
            alt="Rectangle Decoration" 
            className="user-dashboard-rectangle-34"
            onError={(e) => {
              e.target.style.display = 'none';
              console.warn(`Decorative image failed to load: ${e.target.src}`);
            }}
          />
        </div>
        
        {/* Profile Image with Edit Button */}
        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            {/* Use userData.photoURL instead of currentUser.photoURL */}
            {userData?.photoURL ? (
              <img 
                src={userData.photoURL} 
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

      <div className="circle-blob yellow-blob"></div>
      <div className="circle-blob purple-blob"></div>


  
      {/* Skills, Interests, and Learning Grid */}
      <div className="info-grid">
        <div className="info-card skills-card">
          <h3>Skills</h3>
          <div className="tags figma-inspired-tags">
            {userData?.skills?.length > 0 ? (
              userData.skills.map((skill, index) => (
                <span key={index} className="tag figma-tag">{skill}</span>
              ))
            ) : (
              <span className="tag figma-tag empty-tag">No skills added</span>
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
      
      {/* Friends Section */}
      <div className="friends-section figma-friends-section">
        <div className="info-card">
          <h3><FaUserFriends /> Friends</h3>
          {isLoadingConnections ? (
            <p>Loading connections...</p>
          ) : connectionProfiles.length > 0 ? (
            <div className="friends-grid figma-friends-grid">
              {connectionProfiles.map(profile => (
                <div key={profile.id} className="friend-card-container figma-friend-card">
                  <Link 
                    to={`/userprofile/${profile.id}`} 
                    className="friend-card"
                  >
                    <div className="friend-avatar figma-avatar">
                      <img 
                        src={profile.photoURL || placeholderProfilePic} 
                        alt={`${profile.firstName} ${profile.lastName}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = placeholderProfilePic;
                        }}
                      />
                    </div>
                    <div className="friend-info">
                      <h4>{profile.firstName} {profile.lastName}</h4>
                      <p className="friend-location">{profile.location || "No location"}</p>
                    </div>
                  </Link>
                  <Link 
                    to="/chat" 
                    className="chat-button figma-button"
                    onClick={(e) => {
                      localStorage.setItem('selectedChatUser', profile.id);
                    }}
                  >
                    Message
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-friends-message">No connections yet</p>          )}
        </div>
      </div>

      {/* Posts Feed Section */}
      <div className="dashboard-content">
        <PostFeed />
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
