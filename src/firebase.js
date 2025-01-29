import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBMxODgoZjdyk-3J9J5i7uZSld2jSuBZP0",
  authDomain: "doctorappointmentsystem-695f7.firebaseapp.com",
  databaseURL: "https://doctorappointmentsystem-695f7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "doctorappointmentsystem-695f7",
  storageBucket: "doctorappointmentsystem-695f7.appspot.com",
  messagingSenderId: "264937624700",
  appId: "1:264937624700:web:79905d1d1d72ebd8aa25f9",
  measurementId: "G-WP62PZ3RNX",
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const database = getDatabase(app);

export { app, auth, googleProvider, database };
