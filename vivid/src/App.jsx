import React from 'react';
import NavBar from './Components/NavBar/NavBar';
import MainSection from './Components/MainSection/MainSection';
import PeopleCardsContainer from './Components/PeopleCardContainerfolder/PeopleCardsContainer'; 
function App() {
  return (
    <div className="App">
      <NavBar />
      <MainSection />
      <div className="PeopleCardContainer">
        <PeopleCardsContainer /> {/* Corrected component usage */}
      </div>
    </div>
  );
}

export default App;