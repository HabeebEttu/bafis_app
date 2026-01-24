import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
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
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error(
          "User profile not found. Please contact administrator."
        );
      }

      const userData = userDoc.data();
      if (!userData.isActive) {
        await signOut(auth);
        throw new Error(
          "Your account has been deactivated. Please contact administrator."
        );
      }
      await setDoc(
        userDocRef,
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      return {
        user,
        userData,
      };
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          throw new Error("Invalid email address.");
        case "auth/user-disabled":
          throw new Error("This account has been disabled.");
        case "auth/user-not-found":
          throw new Error("No account found with this email.");
        case "auth/wrong-password":
          throw new Error("Incorrect password.");
        case "auth/too-many-requests":
          throw new Error("Too many failed attempts. Please try again later.");
        case "auth/network-request-failed":
          throw new Error("Network error. Please check your connection.");
        default:
          throw error;
      }
    }
  },
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
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};
