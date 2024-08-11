import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics' 
import { getFirestore } from 'firebase/firestore';
//import { getAuth, RecaptchaVerifier } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyCWhNS0QARkONhd19ti-e5ISEuMe5kUbkw",
  authDomain: "gestion-inventaires.firebaseapp.com",
  projectId: "gestion-inventaires",
  storageBucket: "gestion-inventaires.appspot.com",
  messagingSenderId: "875796714358",
  appId: "1:875796714358:web:cd5931d60df85c5ee52057",
  measurementId: "G-2WLSK370R6"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
//const auth = getAuth(app);


/*const recaptchaVerifier = new RecaptchaVerifier("sign-in-button", {
    "size": "invisible",
    "callback": function(response) {
        // reCAPTCHA solved, you can proceed with
        // phoneAuthProvider.verifyPhoneNumber(...).
        onSolvedRecaptcha();
    }}, auth);*/


export { firestore, analytics};
