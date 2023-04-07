// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRetorlqgWSKMVMgmuWuWin4emoTqsvaQ",
  authDomain: "reactiondb-fc2a9.firebaseapp.com",
  projectId: "reactiondb-fc2a9",
  storageBucket: "reactiondb-fc2a9.appspot.com",
  messagingSenderId: "465022459695",
  appId: "1:465022459695:web:42221fd6f3ed8292d4cbda",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
