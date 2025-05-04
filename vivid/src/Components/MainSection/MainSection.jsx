import React, { useRef, useEffect } from 'react';
import Typed from 'typed.js';
import './MainSection.css';
import heroImage from '../../assets/hero-image.png';
import VariableProximity from '../../assets/VariableProximity/VariableProximity';
import DotOrnament from '../../assets/DotOrnament.svg';

function MainSection() {
  const containerRef = useRef(null);
  const typedH1Ref = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedH1Ref.current, {
      strings: [
        "Trade Skills, Share Passions, <span class='highlight'>Find Your Tribe</span>"
      ],
      typeSpeed: 30,
      backSpeed: 30,
      backDelay: 10000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      onComplete: () => {
        const cursor = document.querySelector('.typed-cursor');
        if (cursor) {
          cursor.style.display = 'none'; // Hide the cursor after typing
        }
      },
    });

    return () => {
      typed.destroy(); // Cleanup to avoid memory leaks
    };
  }, []);

  return (
    <section className="main-section">
      <div className="container">
        {/* Decorative SVGs */}
        {/* <img src="../../src/assets/Rectangle-34.svg" alt="Rectangle Decoration" className="rectangle-34" /> */}
        <img src="../../src/assets/Rectangle-25.svg" alt="Rectangle Decoration" className="rectangle-25" />
        <img src="../../src/assets/Ellipse-85-b.svg" alt="Ellipse Decoration" className="ellipse-85" />
        <img src="../../src/assets/Ellipse-86.svg" alt="Ellipse Decoration" className="ellipse-86" />
        
        {/* Text + Image Flex Row */}
        <div className="hero-row">
          <div className="hero-dot-ornament">
            <img src={DotOrnament} alt="Dot Ornament" className="DotOrnament" />
          </div>
          <div className="hero-text">
            <h1 className="typewriter">
              <span ref={typedH1Ref} />
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
