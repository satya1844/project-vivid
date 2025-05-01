import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyAclVAnEDRqr7flIb1AkD4_ZeZS5X_Rrt0",
  authDomain: "vivid-connect.firebaseapp.com",
  projectId: "vivid-connect",
  storageBucket: "vivid-connect.firebasestorage.app",
  messagingSenderId: "825797303909",
  appId: "1:825797303909:web:99cd36205f92d4ee98b08c",
  measurementId: "G-GPBTH54MRN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Create Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Google Sign In function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Create a user document in Firestore if it doesn't exist
    const userDoc = doc(db, "users", result.user.uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      await setDoc(userDoc, {
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ')[1] || '',
        email: result.user.email,
        createdAt: new Date(),
        lastLogin: new Date()
      });
    }
    
    return result.user;
  } catch (error) {
    console.error("Error in Google sign in:", error);
    throw error;
  }
};

export { 
  auth, 
  db, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
};

export default app;