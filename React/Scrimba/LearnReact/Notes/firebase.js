import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCMNpDFE_h0ffpSOwhUuKw95ORW7Uho9xg",
  authDomain: "react-notes-baf98.firebaseapp.com",
  projectId: "react-notes-baf98",
  storageBucket: "react-notes-baf98.appspot.com",
  messagingSenderId: "57538628196",
  appId: "1:57538628196:web:4772948c5a4205ce7aed71"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")
