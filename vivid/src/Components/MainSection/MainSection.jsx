import React from 'react';
import { useRef } from 'react';
import './MainSection.css';
import heroImage from '../../assets/hero-image.png';
import VariableProximity from '../../assets/VariableProximity/VariableProximity';

function MainSection() {
  const containerRef = useRef(null);

  return (
    <section className="main-section">
      <div className="container">
        {/* Text + Image Flex Row */}
        <div className="hero-row">
          <div className="hero-text">
            <h1>
              <span className="black-text">Trade Skills, Share Passions, </span>
              <span className="highlight">Find Your Tribe</span>
            </h1>
            <p>
              Discover new hobbies, connect with fellow enthusiasts, and grow
              together – one trade at a time.
            </p>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Community sharing interests" />
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <h2>Turn Interests into <br /> Meaningful Connections!</h2>
          <div ref={containerRef} style={{ position: 'relative' }}>
            <VariableProximity
              label={
                "Step into a world where your interests connect you with like-minded " +
                "people! Join communities that match your passion, explore engaging " +
                "discussions, and share what excites you. Whether you're here to learn, " +
                "collaborate, or just meet new people — this is your space to grow and belong."
              }
              className="variable-proximity-demo"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={100}
              falloff="linear"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default MainSection;
