// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDiFCbMXhIzCNLLt9yj9TDlSc2dHDycGKA",

  authDomain: "scoreboard-sandbox-fc7ac.firebaseapp.com",

  projectId: "scoreboard-sandbox-fc7ac",

  storageBucket: "scoreboard-sandbox-fc7ac.appspot.com",

  messagingSenderId: "250510473364",

  appId: "1:250510473364:web:949028b386fe4ac2da9c81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
