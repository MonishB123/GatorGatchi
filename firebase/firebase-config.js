// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwbxN0gdP63jjLBzQHW93EWDYq3vquZP8",
  authDomain: "gatorgachi.firebaseapp.com",
  projectId: "gatorgachi",
  storageBucket: "gatorgachi.firebasestorage.app",
  messagingSenderId: "341804889216",
  appId: "1:341804889216:web:2723ea4cd9cb51b1ade265",
  measurementId: "G-ZYDTM06V5Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-In Function
async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in:", result.user);
    return result.user;
  } catch (error) {
    console.error("Authentication error:", error);
  }
}

export { auth, db, googleSignIn };

console.log(firebase)