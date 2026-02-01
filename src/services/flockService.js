import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { db } from "../firebase/config"

const collectionName = 'flock'
export const flockService = {
  createFlock: async (flockData) => {
    try {
      const flockRef = await addDoc(collection(db, collectionName), {
        ...flockData,
        initialQuantity: flockData.quantity,
        mortalityRate: 0,
        mortalityCount: 0,
        status: "pending",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Flock created with ID:", flockRef.id);
      return flockRef.id;
    } catch (error) {
      console.error("Error creating flock ", error);
      throw new Error("Failed to create flock" + error.message);
    }
  },
  getFlockById: async (flockId) => {
    try {
      const flockDoc = await getDoc(doc(db, collectionName, flockId));

      if (!flockDoc.exists()) {
        throw new Error("Flock not found");
      }

      return {
        id: flockDoc.id,
        ...flockDoc.data(),
      };
    } catch (error) {
      console.error("Error getting flock:", error);
      throw error;
    }
  },
  getAllFlocks: async () => {
    try {
      let q = collection(db, collectionName);
      q = query(q, orderBy("createdAt", "desc"));
      const querySnapShots = await getDocs(q);
      return querySnapShots.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Failed to get flocks");
      throw error;
    }
  },
  getActiveFlocks: async () => {
    try {
      let q = query(
        collection(db, collectionName),
        where("isActive", "==", true)
      );

      q = query(q, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting active flocks:", error);
      throw error;
    }
  },
  getFlocksByStatus: async (status) => {
    try {
      let q = query(
        collection(db, collectionName),
        where("status", "==", status)
      );

      q = query(q, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting flocks by status:", error);
      throw error;
    }
  },
  getFlockByBreed: async (breed) => {
    try {
      let q = query(
        collection(db, collectionName),
        where("breed", "==", breed)
      );
      q = query(q, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting flocks by breed:", error);
      throw error;
    }
  },
  updateFlock: async (flockId, updateData) => {
    try {
      const flockRef = doc(db, collectionName, flockId);
      await updateDoc(flockRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to update flock");
      throw error;
    }
  },
  updateFlockQuantity: async (flockId, newQuantity, reason = "") => {
    try {
      const flockDoc = await getDoc(doc(db, collectionName, flockId));

      if (!flockDoc.exists()) {
        throw new Error("Flock not found");
      }

      const flockData = flockDoc.data();
      const quantityChange = flockData.quantity - newQuantity;
      const newMortalityCount =
        flockData.mortalityCount + Math.abs(quantityChange);
      const newMortalityRate = (
        (newMortalityCount / flockData.initialQuantity) *
        100
      ).toFixed(2);

      await updateDoc(doc(db, collectionName, flockId), {
        quantity: newQuantity,
        mortalityCount: newMortalityCount,
        mortalityRate: parseFloat(newMortalityRate),
        lastUpdateReason: reason,
        updatedAt: serverTimestamp(),
      });

      console.log("Flock quantity updated");
    } catch (error) {
      console.error("Error updating flock quantity:", error);
      throw error;
    }
  },
  updateHealthStatus: async (flockId, healthStatus, notes = "") => {
    try {
      await updateDoc(doc(db, collectionName, flockId), {
        healthStatus,
        healthNotes: notes,
        lastHealthCheck: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Health status updated");
    } catch (error) {
      console.error("Error updating health status:", error);
      throw error;
    }
  },
  approveFlock: async (flockId, approvedBy) => {
    try {
      await updateDoc(doc(db, collectionName, flockId), {
        status: "approved",
        approvedBy: approvedBy,
        approvalDate: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Flock approved");
    } catch (error) {
      console.error("Error approving flock:", error);
      throw error;
    }
  },
  deactivateFlock: async (flockId, reason = "") => {
    try {
      await updateDoc(doc(db, collectionName, flockId), {
        isActive: false,
        deactivationReason: reason,
        deactivatedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Flock deactivated");
    } catch (error) {
      console.error("Error deactivating flock:", error);
      throw error;
    }
  },
  deleteFlock: async (flockId) => {
    try {
      await deleteDoc(doc(db, collectionName, flockId));
      console.log("Flock deleted permanently");
    } catch (error) {
      console.error("Error deleting flock:", error);
      throw error;
    }
  },
  getFlockStats: async () => {
    try {
      let q = collection(db, collectionName);


      const querySnapshot = await getDocs(q);
      const flocks = querySnapshot.docs.map((doc) => doc.data());

      const stats = {
        totalFlocks: flocks.length,
        activeFlocks: flocks.filter((f) => f.isActive).length,
        totalBirds: flocks.reduce((sum, f) => sum + (f.quantity || 0), 0),
        averageMortalityRate: (
          flocks.reduce((sum, f) => sum + (f.mortalityRate || 0), 0) /
          flocks.length
        ).toFixed(2),
        flocksByBreed: {},
        flocksByStatus: {
          pending: 0,
          approved: 0,
          rejected: 0,
        },
      };
      flocks.forEach((flock) => {
        if (flock.breed) {
          stats.flocksByBreed[flock.breed] =
            (stats.flocksByBreed[flock.breed] || 0) + 1;
        }
        if (flock.status) {
          stats.flocksByStatus[flock.status] =
            (stats.flocksByStatus[flock.status] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error getting flock stats:", error);
      throw error;
    }
  },subscribeToFlocks: ( callback) => {
    try {
      let q = collection(db, collectionName);
      
      
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const flocks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(flocks);
      });
    } catch (error) {
      console.error('Error subscribing to flocks:', error);
      throw error;
    }
  },
  subscribeToFlock: (flockId, callback) => {
    try {
      return onSnapshot(doc(db, collectionName, flockId), (docSnapshot) => {
        if (docSnapshot.exists()) {
          callback({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          });
        } else {
          callback(null);
        }
      });
    } catch (error) {
      console.error('Error subscribing to flock:', error);
      throw error;
    }
  }

};
