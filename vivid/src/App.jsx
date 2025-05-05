import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './ProtectedRouteComponent';
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
import Explore from '../pages/Explore/Explore';
import ProfileSetup from "../pages/ProfileSetup/ProfileSetup";
import UserProfile from '../src/Components/UserProfile/UserProfile'; // Import the UserProfile component
import CommunityDetailPage from '../pages/CommunityDetailPage/CommunityDetailPage';
import { Toaster } from 'react-hot-toast';
import Loader from './assets/Loader'; // Import the Loader component
// Add this import at the top with other imports
import ChatPage from '../pages/chat/ChatPage';
// Add this import near the top with other imports
import './ChatLayout.css';


function LoginPageWithRedirect() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return <LoginPage />;
}

function Layout() {
  const location = useLocation();

  const getPageClass = () => {
    if (location.pathname === '/signup') return 'signup-page';
    if (location.pathname === '/login') return 'login-page';
    if (location.pathname === '/userdashboard') return 'dashboard-page';
    if (location.pathname === '/chat') return 'chat-page'; // Add this line
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
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<LoginPageWithRedirect />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/userdashboard" element={<UserdashBoard />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/profileSetup" element={<ProfileSetup />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/community/:id" element={<CommunityDetailPage />} />
        <Route path="/userprofile/:userId" element={<UserProfile />} />
        
        {/* Add the new people route */}
        <Route path="/people" element={<Navigate to="/explore" replace />} />
        
        {/* Add the new chat route */}
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Separate component to use hooks after AuthProvider is mounted
function AppContent() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
          duration: 4000,
        }}
      />
      <Layout />
    </>
  );
}

export default App;
