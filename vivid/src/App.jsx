import React from 'react';
import NavBar from './Components/NavBar/NavBar';
import MainSection from './Components/MainSection/MainSection';
import PeopleCardsContainer from './Components/PeopleCardContainerfolder/PeopleCardsContainer'; 
import { Content } from './Components/CAT/cat';



function App() {
  return (
    <div className="App">
      <NavBar />
      <MainSection />
      <div className="PeopleCardContainer">
        <PeopleCardsContainer /> {/* Corrected component usage */}
      </div>

      <Content />
    </div>
  );
}

export default App;