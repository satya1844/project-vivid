import React from "react";
import NavBar from "./Components/NavBar/NavBar";
import MainSection from "./Components/MainSection/MainSection";
import PeopleCardsContainer from "./Components/PeopleCardContainerfolder/PeopleCardsContainer";
import { Content } from "./Components/CAT/cat";
import CommunityCardsSection from "./Components/CommunityCards/CommunityCardsSection";
import SignUp from "./Components/signupPage/SignUp";
import LoginPage from "./Components/LoginPage/LoginPage";

function App() {
  return (
    <div className="App">
      <NavBar />
      <MainSection />
      <PeopleCardsContainer />
      <Content />
      <div className="auth-pages">
        <SignUp />
        <LoginPage />
      </div>
    </div>
  );
}

export default App;