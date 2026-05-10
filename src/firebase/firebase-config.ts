// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';


// Your web app's Firebase configuration
// measurementId enables Google Analytics — replace with the value from your
// Firebase console (Project settings → General → Your apps → Web app).
export const firebaseConfig = {
  apiKey: "AIzaSyDiFCbMXhIzCNLLt9yj9TDlSc2dHDycGKA",
  authDomain: "scoreboard-sandbox-fc7ac.firebaseapp.com",
  projectId: "scoreboard-sandbox-fc7ac",
  storageBucket: "scoreboard-sandbox-fc7ac.appspot.com",
  messagingSenderId: "250510473364",
  appId: "1:250510473364:web:949028b386fe4ac2da9c81",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE);
