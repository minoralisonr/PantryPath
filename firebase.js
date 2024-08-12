import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWhNS0QARkONhd19ti-e5ISEuMe5kUbkw",
  authDomain: "gestion-inventaires.firebaseapp.com",
  projectId: "gestion-inventaires",
  storageBucket: "gestion-inventaires.appspot.com",
  messagingSenderId: "875796714358",
  appId: "1:875796714358:web:cd5931d60df85c5ee52057",
  measurementId: "G-2WLSK370R6"
};

let app;
const db = getFirestore(app);
let analytics;
let firestore;
let auth;

if (typeof window !== 'undefined') {
  // Initialize Firebase only in the browser
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  firestore = getFirestore(app);
  auth = getAuth(app);
}

export { app, analytics, firestore, auth };