// src/components/Loader.jsx
import { Quantum } from 'ldrs/react';
import 'ldrs/react/Quantum.css';

const Loader = () => {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#2D2D2D', // Optional backdrop
    }}>
      <Quantum size="100" speed="1.75" color="yellow" />
    </div>
  );
};

export default Loader;
