import React from 'react';
import NavBar from './Components/NavBar/NavBar';
import MainSection from './Components/MainSection/MainSection';
import PeopleCard from './Components/PeopleCardContainer/PeopleCard'; // Corrected import

function App() {
  return (
    <div className="App">
      <NavBar />
      <MainSection />
      <div className="PeopleCardContainer">
        <PeopleCard /> {/* Corrected component usage */}
      </div>
    </div>
  );
}

export default App;