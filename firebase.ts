import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRVo75cdtfrk2n8fA9JskTuVBtFXpDBOQ",
  authDomain: "idt-builder-230929.firebaseapp.com",
  projectId: "idt-builder-230929",
  storageBucket: "idt-builder-230929.appspot.com",
  messagingSenderId: "958173274610",
  appId: "1:958173274610:web:fc3326d378b86b3f190b6b",
  measurementId: "G-GM9SXYR8S9",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
