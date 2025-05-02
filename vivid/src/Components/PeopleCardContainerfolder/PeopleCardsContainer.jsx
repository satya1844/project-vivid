
import React, { useEffect, useRef } from "react";
import peopleData from "./peopleData";
import PeopleCard from "./PeopleCard";
import "./PeopleCardsContainer.css";

const PeopleCardsContainer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const scrollInterval = setInterval(() => {
      if (container) {
        container.scrollBy({
          left: 1, // Scroll 1 pixel at a time
          behavior: 'smooth', // Smooth scrolling behavior
        });

        // Reset scroll when reaching the end
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollLeft = 0;
        }
      }
    }, 100); // Adjust speed by changing the interval time

    return () => clearInterval(scrollInterval);
  }, []);

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
          <div className="people-card-container" ref={containerRef}> {/* Added ref for auto-scrolling */}
            {peopleData.map((person, index) => (
              <PeopleCard
                key={index}
                name={person.name}
                image={person.image}
                description={person.description}
              />
            ))}
          </div>
        </div>
        <div className="cta-section reduced-width">
          
          
        </div>
      </div>
    </div>
  );
};

export default PeopleCardsContainer;
