import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const mortalityService = {
  // Record Mortality and Update Flock (Frontend)
  recordMortality: async (mortalityData) => {
    try {
      // 1. Record the mortality event
      const docRef = await addDoc(collection(db, "mortality"), {
        ...mortalityData,
        recordedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      // 2. Get the flock to update its stats
      const flockDoc = await getDoc(doc(db, "flocks", mortalityData.flockId));
      if (!flockDoc.exists()) {
        throw new Error("Flock not found");
      }

      const flockData = flockDoc.data();
      const count = mortalityData.count || 1;

      // 3. Calculate new stats
      const newQuantity = Math.max(0, flockData.quantity - count);
      const newMortalityCount = (flockData.mortalityCount || 0) + count;
      const mortalityRate = (
        (newMortalityCount / (flockData.initialQuantity || 1)) * 100
      ).toFixed(2);

      // 4. Update the flock
      await updateDoc(doc(db, "flocks", mortalityData.flockId), {
        quantity: newQuantity,
        mortalityCount: newMortalityCount,
        mortalityRate: parseFloat(mortalityRate),
        lastMortalityRecord: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Mortality recorded and flock updated successfully");
      return {
        mortalityId: docRef.id,
        success: true,
      };
    } catch (error) {
      console.error("Error recording mortality:", error);
      throw error;
    }
  },

  // Get mortality records for a flock
  getMortalityByFlock: async (flockId) => {
    try {
      const q = query(
        collection(db, "mortality"),
        where("flockId", "==", flockId),
        orderBy("recordedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting mortality records:", error);
      throw error;
    }
  },

  // Get mortality records within date range
  getMortalityHistory: async (flockId, startDate, endDate) => {
    try {
      const q = query(
        collection(db, "mortality"),
        where("flockId", "==", flockId),
        where("recordedAt", ">=", startDate),
        where("recordedAt", "<=", endDate),
        orderBy("recordedAt", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting mortality history:", error);
      throw error;
    }
  },

  // Get daily mortality summary
  getDailyMortalitySummary: async (flockId, days = 30) => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "mortality"),
        where("flockId", "==", flockId),
        where("recordedAt", ">=", startDate),
        orderBy("recordedAt", "asc")
      );

      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map((doc) => doc.data());

      // Group by date
      const summary = {};
      records.forEach((record) => {
        const date = new Date(record.recordedAt.toDate())
          .toISOString()
          .split("T")[0];
        if (!summary[date]) {
          summary[date] = {
            date,
            count: 0,
            causes: {},
          };
        }
        summary[date].count += record.count || 1;
        if (record.cause) {
          summary[date].causes[record.cause] =
            (summary[date].causes[record.cause] || 0) + (record.count || 1);
        }
      });

      return Object.values(summary);
    } catch (error) {
      console.error("Error getting daily mortality summary:", error);
      throw error;
    }
  },

  // Subscribe to mortality records
  subscribeMortalityByFlock: (flockId, callback) => {
    try {
      const q = query(
        collection(db, "mortality"),
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
      console.error("Error subscribing to mortality records:", error);
      throw error;
    }
  },

  // Get mortality statistics
  getMortalityStats: async (flockId) => {
    try {
      const records = await this.getMortalityByFlock(flockId);

      const stats = {
        totalMortality: records.reduce((sum, r) => sum + (r.count || 1), 0),
        recordCount: records.length,
        causes: {},
        avgDailyMortality: 0,
        mortalityTrend: [],
      };

      // Group by cause
      records.forEach((record) => {
        if (record.cause) {
          stats.causes[record.cause] =
            (stats.causes[record.cause] || 0) + (record.count || 1);
        }
      });

      // Calculate average daily mortality
      if (records.length > 0) {
        const daysSpan = Math.ceil(
          (new Date() - records[records.length - 1].recordedAt.toDate()) /
            (1000 * 60 * 60 * 24)
        );
        stats.avgDailyMortality = (stats.totalMortality / Math.max(daysSpan, 1)).toFixed(2);
      }

      return stats;
    } catch (error) {
      console.error("Error getting mortality stats:", error);
      throw error;
    }
  },

  // Update mortality record
  updateMortalityRecord: async (id, updateData) => {
    try {
      await updateDoc(doc(db, "mortality", id), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating mortality record:", error);
      throw error;
    }
  },
};
