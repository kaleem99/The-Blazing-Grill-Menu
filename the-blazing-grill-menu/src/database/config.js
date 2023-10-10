// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmYar9MBNc_6Z0-jrjQixRslC2Fo_yyVI",
  authDomain: "blazing-grills.firebaseapp.com",
  projectId: "blazing-grills",
  storageBucket: "blazing-grills.appspot.com",
  messagingSenderId: "35396218725",
  appId: "1:35396218725:web:3cd15729d528388e22fb8c",
  measurementId: "G-L31CDZM39Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export { db, storage, auth };
export default app;
