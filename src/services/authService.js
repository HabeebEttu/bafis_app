import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export const authService = {
  register: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: userData.fullName,
      });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        fullName: userData.fullName,
        role: userData.role || "operation_staff",
        farmLocation: userData.farmLocation || "",
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      return {
        ...userCredential.user,
        userData: userDoc.data(),
      };
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  },

  // Get current user data
  getCurrentUserData: async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      return userDoc.data();
    } catch (error) {
      throw error;
    }
  },
};
