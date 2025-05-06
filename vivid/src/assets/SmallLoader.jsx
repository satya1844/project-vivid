// src/assets/SmallLoader.jsx
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

const SmallLoader = ({ size = "50", speed = "1.75", color = "yellow" }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Quantum size={size} speed={speed} color={color} />
    </div>
  );
};

export default SmallLoader;