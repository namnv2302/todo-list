import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBLVBhSMbLJUr0nbx_ToPvTdYdzVVWI8vo",
  authDomain: "todo-app-b6d1e.firebaseapp.com",
  projectId: "todo-app-b6d1e",
  storageBucket: "todo-app-b6d1e.appspot.com",
  messagingSenderId: "531388142844",
  appId: "1:531388142844:web:88c7698fe967a2f6d47379"
}; 

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

