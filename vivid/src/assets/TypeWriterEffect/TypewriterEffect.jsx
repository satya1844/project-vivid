import React from "react";
import "./typewriter.css"; // Import the CSS file for styling

export default function TypewriterEffectSmooth() {
  const words = [
    { text: "Build" },
    { text: "awesome" },
    { text: "apps" },
    { text: "with" },
    { text: "Aceternity.", className: "blue-text" },
  ];

  return (
    <div className="typewriter-container">
      <p className="subtitle">The road to freedom starts from here</p>
      <Typewriter words={words} />
      <div className="button-container">
        <button className="join-button">Join now</button>
        <button className="signup-button">Signup</button>
      </div>
    </div>
  );
}

function Typewriter({ words }) {
  return (
    <div className="typewriter-line">
      <div className="typewriter-words">
        {words.map((word, i) => (
          <span key={i} className="word">
            {word.text.split("").map((char, j) => (
              <span key={j} className={`char ${word.className || ""}`}>
                {char}
              </span>
            ))}
            &nbsp;
          </span>
        ))}
      </div>
      <span className="cursor" />
    </div>
  );
}
