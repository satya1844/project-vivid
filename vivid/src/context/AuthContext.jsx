import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '../config/authConfig'; // Import db
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, fullName = '') {
    try {
      // Create authentication record
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create a user document in Firestore
      const userDoc = doc(db, "users", result.user.uid);
      const userSnapshot = await getDoc(userDoc);
      
      if (!userSnapshot.exists()) {
        // Extract first and last name if provided
        let firstName = "";
        let lastName = "";
        
        if (fullName) {
          const nameParts = fullName.trim().split(' ');
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(' ') || "";
        }
        
        // Extract username from email if available
        const username = email.split('@')[0];
        
        await setDoc(userDoc, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          createdAt: new Date(),
          lastLogin: new Date()
        });
      }
      
      return result.user;
    } catch (error) {
      console.error("Error in signup:", error);
      throw error;
    }
  }

  function login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    return signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        console.error('Auth error:', error);
        throw error; // Important: Throw the error to be caught in the component
      });
  }

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.error('Password reset error:', error);
        throw error;
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    googleLogin,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}