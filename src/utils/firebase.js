// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxsTPWLS39ik1PLi8q2mWJjOX47mf7xDQ",
  authDomain: "ltd-resort.firebaseapp.com",
  projectId: "ltd-resort",
  storageBucket: "ltd-resort.appspot.com",
  messagingSenderId: "488848402002",
  appId: "1:488848402002:web:681115cae44fb86542618b"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore to get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }