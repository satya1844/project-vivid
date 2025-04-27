import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import MainSection from './Components/MainSection/MainSection';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/signupPage/SignUp';
import UserdashBoard from '../pages/UserdashBoard/UserdashBoard';
import Ribbons from '../ReactBits/Ribbons/Ribbons';
import FollowCursor from './assets/Cursor';
import PeopleCardsContainer from '../src/Components/PeopleCardContainerfolder/PeopleCardsContainer';
import CommunityCardsSection from '../src/Components/CommunityCards/CommunityCardsSection';
import NavBar from '../src/Components/NavBar/NavBar';
import Footer from '../src/Components/Footer/footer';

import EditProfile from '../../vivid/pages/editProfile/editProfile';



function LoginPageWithRedirect() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/userdashboard'); // Redirect to user dashboard after login
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}

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
              < Footer />
              
            </>
          }
        />
        <Route path="/login" element={<LoginPageWithRedirect />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/userdashboard" element={<UserdashBoard />} />
        <Route path="/editProfile" element={<EditProfile />} />
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
