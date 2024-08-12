import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth} from 'firebase/auth';
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optionalfirebase login
const firebaseConfig = {
  apiKey: "AIzaSyByM1kgnceCYkrThrZ7xlrbXzu3GO2FEMI",
  authDomain: "pantrypath.firebaseapp.com",
  databaseURL: "https://pantrypath-default-rtdb.firebaseio.com",
  projectId: "pantrypath",
  storageBucket: "pantrypath.appspot.com",
  messagingSenderId: "139963117451",
  appId: "1:139963117451:web:7d5ea1539bfa2a364e898e",
  measurementId: "G-YCYTYYBRN3"
};

let app;
let auth;
let firestore;
let analytics;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use existing app instance if already initialized
}

if (typeof window !== 'undefined') {
  auth = getAuth(app);
  firestore = getFirestore(app);
  
  // Check if analytics is supported before initializing
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { auth, firestore, analytics };