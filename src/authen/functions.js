import { GoogleAuthProvider, 
  FacebookAuthProvider,
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signOut,
} from "firebase/auth";
import { auth } from "../storage/firebase.js";

const googleAuthProvider = new GoogleAuthProvider();
const facebookAuthProvider = new FacebookAuthProvider();

const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error(err);
    }
  };

const signInWithFacebook = async () => {
  try {
    await signInWithPopup(auth, facebookAuthProvider);
  } catch (err) {
    console.error(err);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
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
