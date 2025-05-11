
import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/authConfig";
import PeopleCard from "./PeopleCard";
import "./PeopleCardsContainer.css";
import placeholderProfilePic from "../../assets/ProfilePic.png"; // Add this import

const PeopleCardsContainer = () => {
  const [peopleData, setPeopleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPeopleData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeopleData();

    // Only set up scrolling if container exists and there's data
    if (containerRef.current && peopleData.length > 0) {
      const container = containerRef.current;
      const scrollInterval = setInterval(() => {
        if (container) {
          container.scrollBy({
            left: 1,
            behavior: 'smooth',
          });

          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        }
      }, 100);

      return () => clearInterval(scrollInterval);
    }
  }, [peopleData.length]);

  return (
    <div className="people-cards-container">
      <div className="people-cards-matter">
        <h2>Find your Buddy</h2>
        <p>
          Discover new passions and connect with like-minded people! Every hobby opens the door to a
          community waiting to welcome you.
        </p>
      </div>
      <div className="people-cards-section">
        <div className="cards-scroll">
          <div className="people-card-container" ref={containerRef}>
            {isLoading ? (
              <div className="loading-message">Loading users...</div>
            ) : peopleData.length > 0 ? (
              peopleData.map((person) => (
                <PeopleCard
                  key={person.id}
                  userId={person.id}
                  name={`${person.firstName || ''} ${person.lastName || ''}`.trim() || person.username || 'Anonymous'}
                  // Pass photoURL as the image prop
                  image={person.photoURL || placeholderProfilePic} 
                  interests={person.interests || []}
                  lookingToLearn={person.lookingToLearn || []}
                  openToCollab={person.openToCollab || []}
                />
              ))
            ) : (
              <div className="no-users-message">
                <p>No users found. Be the first to join!</p>
              </div>
            )}
          </div>
        </div>
        <div className="cta-section reduced-width">
          {/* Additional CTA content can go here */}
        </div>
      </div>
    </div>
  );
};

export default PeopleCardsContainer;
