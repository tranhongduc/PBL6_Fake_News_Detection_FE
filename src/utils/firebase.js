// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwoMsuup3EVKD-MVvH9m8tXPWyao0drCU",
  authDomain: "pbl6-8431d.firebaseapp.com",
  projectId: "pbl6-8431d",
  storageBucket: "pbl6-8431d.appspot.com",
  messagingSenderId: "973008108841",
  appId: "1:973008108841:web:c097efc8004aeceb314b38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore to get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }