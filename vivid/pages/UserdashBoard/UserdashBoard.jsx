import React, { useState, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../src/config/authConfig"; // Firestore instance
import './UserDashBoard.css';

import profileBanner from '../../src/assets/placeholder-banner.png';
import placeholderProfilePic from '../../src/assets/ProfilePic.png';
import editPen from '../../src/assets/editPen.svg';
import EditProfile from '../editProfile/EditProfile'; // Import the EditProfile modal

function UserDashBoard() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [userData, setUserData] = useState(null); // State to store user data

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser?.uid) {
          const userDoc = doc(db, "users", currentUser.uid); // Assuming `uid` is the document ID
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data()); // Set the fetched data
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEditClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData); // Update the userData state with the new data
  };

  return (
    <div className="user-dash-board">
      {/* Profile Banner */}
      <div className="profile-banner">
        <img src={profileBanner} alt="Profile Banner" className="banner-img" />
        <div className="profile-pic-container">
          {/* Use the user's photoURL if it exists, otherwise use the placeholder */}
          <img
            src={currentUser?.photoURL || placeholderProfilePic}
            alt="Profile"
            className="profile-pic"
            onError={(e) => {
              e.target.src = placeholderProfilePic; // Fallback to placeholder if the image fails to load
            }}
          />
          <button className="edit-btn" onClick={handleEditClick}>
            <img src={editPen} alt="Edit" />
          </button>
        </div>
      </div>

      {/* User Info Section */}
      <div className="user-info-section">
        <h2 className="username">{userData?.firstName} {userData?.lastName}</h2>
        <p className="user-bio">{userData?.bio || "No bio available."}</p>
        <div className="user-meta">
          <p><strong>Genre:</strong> Indie Pop | Lo-fi | Hip-Hop | Classical Fusion</p>
          <p><strong>Based in:</strong> Hyderabad</p>
          <p><strong>Let’s jam or collab:</strong> vinay@gmail.com</p>
        </div>
      </div>

      {/* Hobbies Section */}
      <div className="hobbies-section">
        <div className="section-header">
          <h3>Hobbies | Interests</h3>
          <button className="edit-btn" onClick={handleEditClick}>
            <img src={editPen} alt="Edit" />
          </button>
        </div>
        <ul className="hobbies-list">
          {userData?.interests?.length > 0 ? (
            userData.interests.map((interest, index) => <li key={index}>{interest}</li>)
          ) : (
            <li>No hobbies or interests added yet.</li>
          )}
        </ul>
      </div>

      {/* Current Mood Section */}
      <div className="mood-section">
        <h3>Current Mood</h3>
        <p>{userData?.mood || "No mood selected."}</p>
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <EditProfile
          onClose={handleCloseModal}
          userData={userData}
          userId={currentUser?.uid} // Pass the user's UID
          onProfileUpdate={handleProfileUpdate} // Pass the callback
        />
      )}
    </div>
  );
}

export default UserDashBoard;
