// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrUvyoOmN3NE8Y4Ox-9k-sR7PJnm-l-nw",
  authDomain: "ytplayer21223.firebaseapp.com",
  projectId: "ytplayer21223",
  storageBucket: "ytplayer21223.firebasestorage.app",
  messagingSenderId: "713757895310",
  appId: "1:713757895310:web:99923a52bea23bb32577df"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();