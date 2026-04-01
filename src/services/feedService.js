import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const feedService = {
  // Feed Inventory Management
  createFeedInventory: async (inventoryData) => {
    try {
      const docRef = await addDoc(collection(db, "feedInventory"), {
        ...inventoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating feed inventory:", error);
      throw error;
    }
  },

  getFeedInventory: async () => {
    try {
      const q = query(
        collection(db, "feedInventory"),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting feed inventory:", error);
      throw error;
    }
  },

  getFeedInventoryById: async (id) => {
    try {
      const docSnap = await getDoc(doc(db, "feedInventory", id));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      }
      throw new Error("Feed inventory not found");
    } catch (error) {
      console.error("Error getting feed inventory:", error);
      throw error;
    }
  },

  updateFeedInventory: async (id, updateData) => {
    try {
      await updateDoc(doc(db, "feedInventory", id), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating feed inventory:", error);
      throw error;
    }
  },

  // Feed Consumption Tracking
  recordFeedConsumption: async (consumptionData) => {
    try {
      const docRef = await addDoc(collection(db, "feedConsumption"), {
        ...consumptionData,
        recordedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error recording feed consumption:", error);
      throw error;
    }
  },

  getFeedConsumptionByFlock: async (flockId) => {
    try {
      const q = query(
        collection(db, "feedConsumption"),
        where("flockId", "==", flockId),
        orderBy("recordedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting feed consumption:", error);
      throw error;
    }
  },

  getFeedConsumptionHistory: async (flockId, days = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const q = query(
        collection(db, "feedConsumption"),
        where("flockId", "==", flockId),
        where("recordedAt", ">=", startDate),
        orderBy("recordedAt", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting feed consumption history:", error);
      throw error;
    }
  },

  subscribeToFeedConsumption: (flockId, callback) => {
    try {
      const q = query(
        collection(db, "feedConsumption"),
        where("flockId", "==", flockId),
        orderBy("recordedAt", "desc")
      );
      return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(data);
      });
    } catch (error) {
      console.error("Error subscribing to feed consumption:", error);
      throw error;
    }
  },

  // Feed Purchase Orders
  createPurchaseOrder: async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, "feedPurchases"), {
        ...orderData,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating purchase order:", error);
      throw error;
    }
  },

  getPurchaseOrders: async () => {
    try {
      const q = query(
        collection(db, "feedPurchases"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting purchase orders:", error);
      throw error;
    }
  },

  getPurchaseOrdersByStatus: async (status) => {
    try {
      const q = query(
        collection(db, "feedPurchases"),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting purchase orders by status:", error);
      throw error;
    }
  },

  updatePurchaseOrder: async (id, updateData) => {
    try {
      await updateDoc(doc(db, "feedPurchases", id), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating purchase order:", error);
      throw error;
    }
  },

  // Dashboard Analytics
  getFeedStats: async () => {
    try {
      const inventory = await this.getFeedInventory();
      const purchases = await this.getPurchaseOrders();

      const stats = {
        totalInventory: inventory.reduce((sum, item) => sum + (item.quantity || 0), 0),
        totalValue: inventory.reduce((sum, item) => sum + (item.totalValue || 0), 0),
        lowStockItems: inventory.filter((item) => item.quantity < item.reorderLevel).length,
        pendingOrders: purchases.filter((p) => p.status === "pending").length,
        completedOrders: purchases.filter((p) => p.status === "completed").length,
        averagePricePerKg: inventory.length
          ? (inventory.reduce((sum, item) => sum + (item.pricePerUnit || 0), 0) / inventory.length).toFixed(2)
          : 0,
      };

      return stats;
    } catch (error) {
      console.error("Error getting feed stats:", error);
      throw error;
    }
  },
};
