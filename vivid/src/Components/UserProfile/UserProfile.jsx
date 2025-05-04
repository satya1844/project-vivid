import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/authConfig';
import { useAuth } from '../../context/AuthContext';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';
import Loader from '../../assets/Loader';
import profileRectangle from '../../assets/user-profile-rectangle.svg';
import placeholderProfilePic from '../../assets/ProfilePic.png';
import './UserProfile.css';

import ellipse85 from '../../assets/Ellipse-85-b.svg';
import ellipse86 from '../../assets/Ellipse-86.svg';

const truncateText = (text, wordLimit) => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

function UserProfile() {
  const { userId } = useParams(); // Get userId from URL parameters
  const { currentUser } = useAuth(); // Get current user
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('none'); // 'none', 'pending', 'connected'
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const userDoc = doc(db, "users", userId);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            console.log("No such user!");
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Check connection status
  useEffect(() => {
    const checkConnectionStatus = async () => {
      if (!currentUser || !userId || currentUser.uid === userId) {
        return; // Don't check if viewing own profile or not logged in
      }

      try {
        // Check if there's a pending request
        const requestsQuery = query(
          collection(db, "connectionRequests"),
          where("from", "in", [currentUser.uid, userId]),
          where("to", "in", [currentUser.uid, userId])
        );

        const requestsSnapshot = await getDocs(requestsQuery);
        
        if (!requestsSnapshot.empty) {
          const request = requestsSnapshot.docs[0].data();
          if (request.status === "pending") {
            setConnectionStatus("pending");
            return;
          } else if (request.status === "accepted") {
            setConnectionStatus("connected");
            return;
          }
        }

        // Check if they're already connected
        const connectionsQuery = query(
          collection(db, "connections"),
          where("users", "array-contains", currentUser.uid)
        );

        const connectionsSnapshot = await getDocs(connectionsQuery);
        
        for (const doc of connectionsSnapshot.docs) {
          const connection = doc.data();
          if (connection.users.includes(userId)) {
            setConnectionStatus("connected");
            return;
          }
        }

        setConnectionStatus("none");
      } catch (error) {
        console.error("Error checking connection status:", error);
        setConnectionStatus("none");
      }
    };

    checkConnectionStatus();
  }, [currentUser, userId]);

  const handleConnect = async () => {
    if (!currentUser) {
      alert("You must be logged in to connect with others.");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Create a connection request
      await addDoc(collection(db, "connectionRequests"), {
        from: currentUser.uid,
        to: userId,
        status: "pending",
        timestamp: new Date()
      });

      setConnectionStatus("pending");
      alert("Connection request sent!");
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Failed to send connection request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <img 
        src="../../src/assets/Rectangle-34.svg" 
        alt="Rectangle Decoration" 
        className="rectangle-small-34"
      />
      <img 
        src="../../src/assets/profile-container.svg" 
        alt="Rectangle Decoration" 
        className="profile-container"
      />
      {/* Profile Section */}
      <div className="profile-section">
        <h1 className="name">{userData?.firstName} {userData?.lastName}</h1>
        <p className="about">
          {truncateText(userData?.bio || "No bio available.", 50)}
        </p>
        <p className="location">{userData?.location || "Location not specified"}</p>
        <p className="email">{userData?.email}</p>
        
        {/* Connect Button - Only show if not viewing own profile */}
        {currentUser && currentUser.uid !== userId && (
          <button 
            className={`connect-button ${connectionStatus}`}
            onClick={handleConnect}
            disabled={connectionStatus !== 'none' || isProcessing}
          >
            {connectionStatus === 'none' && 'Connect'}
            {connectionStatus === 'pending' && 'Request Pending'}
            {connectionStatus === 'connected' && 'Connected'}
          </button>
        )}
        
        <div>
          <img src={profileRectangle} alt="Profile Section" className="profile-section-image" />
        </div>
        
        {/* Profile Image */}
        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            <img 
              src={userData?.photoURL || placeholderProfilePic} 
              alt="Profile"
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderProfilePic;
              }}
            />
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

      {/* Change these lines */}
      <div className="circle-blob yellow-blob"></div>
      <div className="circle-blob purple-blob"></div>
      
      {/* Remove these lines */}
      {/* Decorative Ellipses */}
      {/* <img src={ellipse85} alt="Ellipse Decoration" className="ellipse-85" /> */}
      {/* <img src={ellipse86} alt="Ellipse Decoration" className="ellipse-86" /> */}

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
              <span className="tag">No skills listed</span>
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
              <span className="tag">No interests listed</span>
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
              <span className="tag">Nothing listed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;