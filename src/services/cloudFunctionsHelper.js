import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

/**
 * Integration helper for using Cloud Functions in components
 */

export const cloudFunctions = {
  // Flock Management
  approveFlock: async (flockId, adminId) => {
    const approveFlock = httpsCallable(functions, "approveFlock");
    return approveFlock({ flockId, adminId });
  },

  rejectFlock: async (flockId, reason) => {
    const rejectFlock = httpsCallable(functions, "rejectFlock");
    return rejectFlock({ flockId, reason });
  },

  // Feed Management
  createFeedPurchaseOrder: async (orderData) => {
    const createOrder = httpsCallable(functions, "createFeedPurchaseOrder");
    return createOrder(orderData);
  },

  updatePurchaseOrderStatus: async (orderId, status) => {
    const updateStatus = httpsCallable(functions, "updatePurchaseOrderStatus");
    return updateStatus({ orderId, status });
  },

  // Mortality Tracking
  recordMortalityAndUpdateFlock: async (mortalityData) => {
    const recordMortality = httpsCallable(functions, "recordMortalityAndUpdateFlock");
    return recordMortality(mortalityData);
  },

  // Analytics
  generateDailyAnalytics: async () => {
    const generateAnalytics = httpsCallable(functions, "generateDailyAnalytics");
    return generateAnalytics();
  },
};
