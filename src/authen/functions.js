import { GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signOut,
} from "firebase/auth";
import { getDocs, collection, query, where } from 'firebase/firestore';
import addDocument from '../services/addDocument';
import { db } from '../storage/firebase.js';
import { auth } from "../storage/firebase.js";
import { generateKeywords } from '../services/addDocument';

const googleAuthProvider = new GoogleAuthProvider();
const facebookAuthProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if (docs.docs.length === 0) {
        addDocument('users', {
          uid: user.uid,
          displayName: user.displayName,
          authProvider: "google",
          photoURL: user.photoURL,
          email: user.email,
          keywords: generateKeywords(user.displayName),
        })
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

const signInWithFacebook = async () => {
  try {
    await signInWithPopup(auth, facebookAuthProvider);
  } catch (err) {
    console.error(err);
  }
};

const registerWithEmailAndPassword = async (email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
          addDocument('users', {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            authProvider: "local",
            email,
          })
        } 
      } catch (err) {
        console.error(err);
        alert('Email account exists');
      }
}

const logInWithEmailAndPassword = async (email, password) => {
  try {
      await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
      console.error(error);
      alert('Incorrect account name or password')
  }
}

const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
    }
  };

const logout = () => {
    signOut(auth);
};

export { logInWithEmailAndPassword, 
  signInWithFacebook,
  signInWithGoogle,
  sendPasswordReset, 
  registerWithEmailAndPassword, 
  logout }
