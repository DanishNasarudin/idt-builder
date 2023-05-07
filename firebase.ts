import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm7Mm2rLNjllOjt_Xc5WCmIxBfZ7U9nHQ",
  authDomain: "idt-builder.firebaseapp.com",
  projectId: "idt-builder",
  storageBucket: "idt-builder.appspot.com",
  messagingSenderId: "443094553488",
  appId: "1:443094553488:web:542a73c94d3ffd44391915",
  measurementId: "G-63162QY891",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
