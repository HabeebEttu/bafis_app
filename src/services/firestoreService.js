import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const firestoreService = {
  create: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },
  getById: async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      } else {
        throw Error("Document not found");
      }
    } catch (error) {
      throw error;
    }
  },
  getAll: async (collectionName, conditions = []) => {
    try {
      let q = collection(db, collectionName);

      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw error;
    }
  },
  update: async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw error;
    }
  },
  delete: async (collectionName, id) => {
    try {
      await deleteDoc(doc(collectionName, id));
    } catch (error) {
      throw error;
    }
  },
  subscribe: (collectionName, conditions, callback) => {
    let q = collection(db, collectionName);

    if (conditions && conditions.length > 0) {
      q = query(q, ...conditions);
    }

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    });
  },
};
