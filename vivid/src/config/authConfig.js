// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAclVAnEDRqr7flIb1AkD4_ZeZS5X_Rrt0",
  authDomain: "vivid-connect.firebaseapp.com",
  projectId: "vivid-connect",
  storageBucket: "vivid-connect.firebasestorage.app",
  messagingSenderId: "825797303909",
  appId: "1:825797303909:web:99cd36205f92d4ee98b08c",
  measurementId: "G-GPBTH54MRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);