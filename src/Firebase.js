// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmZFaIPeqJyQgt7MuvXF5qot2_6I_j_dA",
  authDomain: "next-step-d6df6.firebaseapp.com",
  projectId: "next-step-d6df6",
  storageBucket: "next-step-d6df6.firebasestorage.app",
  messagingSenderId: "490304033890",
  appId: "1:490304033890:web:e37eaa7fae29d24224ad3b",
  measurementId: "G-YRQJBBH45P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, googleProvider, analytics };