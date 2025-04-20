import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import MainSection from './Components/MainSection/MainSection';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/signupPage/SignUp';
import UserdashBoard from '../pages/UserdashBoard/UserdashBoard';
import Ribbons from '../ReactBits/Ribbons/Ribbons';
import FollowCursor from './assets/Cursor';
import PeopleCardsContainer from '../src/Components/PeopleCardContainerfolder/PeopleCardsContainer';
import CommunityCardsSection from '../src/Components/CommunityCards/CommunityCardsSection';
import NavBar from '../src/Components/NavBar/NavBar';

function Layout() {
  const location = useLocation();

  const getPageClass = () => {
    if (location.pathname === '/signup') return 'signup-page';
    if (location.pathname === '/login') return 'login-page';
    if (location.pathname === '/userdashboard') return 'dashboard-page';
    return 'home-page';
  };

  return (
    <div className={`page-wrapper ${getPageClass()}`}>
      {/* Only show NavBar when not on login or signup pages */}
      {location.pathname !== '/signup' && location.pathname !== '/login' && <NavBar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainSection />
              <PeopleCardsContainer />
              <CommunityCardsSection />
              <Ribbons />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/userdashboard" element={<UserdashBoard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <FollowCursor />
      <Layout />
    </Router>
  );
}

export default App;
