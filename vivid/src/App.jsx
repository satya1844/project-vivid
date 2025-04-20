import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
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
  return (
    <>
      {/* Render NavBar only if the current path is not "/signup" */}
      {location.pathname !== '/signup' && <NavBar />}
      <Routes>
        <Route path="/" element={
          <>
            <MainSection />
            <PeopleCardsContainer />
            <CommunityCardsSection />
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link> | <Link to="/userdashboard">User Dashboard</Link>
            </div>
            <Ribbons />
          </>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/userdashboard" element={<UserdashBoard />} />
      </Routes>
    </>
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