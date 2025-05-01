import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

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
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app); // Initialize Firestore
export default app;