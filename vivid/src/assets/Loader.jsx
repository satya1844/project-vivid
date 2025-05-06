// src/assets/Loader.jsx
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

const Loader = ({ size = "100", speed = "1.75", color = "yellow", fullScreen = true }) => {
  const containerStyle = fullScreen ? {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  } : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  };

  return (
    <div style={containerStyle}>
      <Quantum size={size} speed={speed} color={color} />
    </div>
  );
};

export default Loader;
