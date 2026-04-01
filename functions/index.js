/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({maxInstances: 10});

// ==================== FLOCK MANAGEMENT FUNCTIONS ====================

/**
 * Approve a flock batch
 */
exports.approveFlock = onCall(async (request) => {
  const {flockId, adminId} = request.data;

  if (!flockId || !adminId) {
    throw new Error("Missing required fields: flockId or adminId");
  }

  try {
    await db.collection("flocks").doc(flockId).update({
      status: "approved",
      approvedBy: adminId,
      approvalDate: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true, message: "Flock approved successfully"};
  } catch (error) {
    throw new Error(`Failed to approve flock: ${error.message}`);
  }
});

/**
 * Reject a flock batch
 */
exports.rejectFlock = onCall(async (request) => {
  const {flockId, reason} = request.data;

  if (!flockId) {
    throw new Error("Missing flockId");
  }

  try {
    await db.collection("flocks").doc(flockId).update({
      status: "rejected",
      rejectionReason: reason,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {success: true, message: "Flock rejected successfully"};
  } catch (error) {
    throw new Error(`Failed to reject flock: ${error.message}`);
  }
});

// ==================== FEED MANAGEMENT FUNCTIONS ====================

/**
 * Create feed purchase order and update inventory
 */
exports.createFeedPurchaseOrder = onCall(async (request) => {
  const {
    feedType,
    quantity,
    pricePerUnit,
    supplier,
    expectedDeliveryDate,
    notes,
    userId,
  } = request.data;

  if (!feedType || !quantity || !pricePerUnit || !supplier) {
    throw new Error("Missing required fields");
  }

  try {
    const totalPrice = quantity * pricePerUnit;

    const docRef = await db.collection("feedPurchases").add({
      feedType,
      quantity,
      pricePerUnit,
      totalPrice,
      supplier,
      expectedDeliveryDate,
      notes,
      status: "pending",
      createdBy: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      orderId: docRef.id,
      message: "Purchase order created successfully",
    };
  } catch (error) {
    throw new Error(`Failed to create purchase order: ${error.message}`);
  }
});

/**
 * Update purchase order status and inventory
 */
exports.updatePurchaseOrderStatus = onCall(async (request) => {
  const {orderId, status} = request.data;

  if (!orderId || !status) {
    throw new Error("Missing required fields: orderId or status");
  }

  try {
    const orderDoc = await db.collection("feedPurchases").doc(orderId).get();

    if (!orderDoc.exists) {
      throw new Error("Purchase order not found");
    }

    const orderData = orderDoc.data();

    // If order is being completed, update inventory
    if (status === "completed") {
      const inventory = await db
          .collection("feedInventory")
          .where("feedType", "==", orderData.feedType)
          .limit(1)
          .get();

      if (!inventory.empty) {
        const inventoryDoc = inventory.docs[0];
        const currentQty = inventoryDoc.data().quantity || 0;

        await inventoryDoc.ref.update({
          quantity: currentQty + orderData.quantity,
          lastRestocked: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Create new inventory record if it doesn't exist
        await db.collection("feedInventory").add({
          feedType: orderData.feedType,
          quantity: orderData.quantity,
          reorderLevel: 100,
          maxCapacity: 500,
          pricePerUnit: orderData.pricePerUnit,
          lastRestocked: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    await db.collection("feedPurchases").doc(orderId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: "Purchase order status updated successfully",
    };
  } catch (error) {
    throw new Error(
        `Failed to update purchase order status: ${error.message}`,
    );
  }
});

// ==================== MORTALITY TRACKING FUNCTIONS ====================

/**
 * Record mortality and update flock quantity
 */
exports.recordMortalityAndUpdateFlock = onCall(async (request) => {
  const {flockId, count, cause, notes, userId} = request.data;

  if (!flockId || !count) {
    throw new Error("Missing required fields: flockId or count");
  }

  try {
    // Record mortality
    const mortalityRef = await db.collection("mortality").add({
      flockId,
      count,
      cause,
      notes,
      recordedBy: userId,
      recordedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update flock quantity and mortality stats
    const flockDoc = await db.collection("flocks").doc(flockId).get();

    if (!flockDoc.exists) {
      throw new Error("Flock not found");
    }

    const flockData = flockDoc.data();
    const newQuantity = Math.max(0, flockData.quantity - count);
    const newMortalityCount = (flockData.mortalityCount || 0) + count;
    const mortalityRate = (
      (newMortalityCount / (flockData.initialQuantity || 1)) *
      100
    ).toFixed(2);

    await db.collection("flocks").doc(flockId).update({
      quantity: newQuantity,
      mortalityCount: newMortalityCount,
      mortalityRate: parseFloat(mortalityRate),
      lastMortalityRecord: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      mortalityId: mortalityRef.id,
      message: "Mortality recorded and flock updated successfully",
    };
  } catch (error) {
    throw new Error(`Failed to record mortality: ${error.message}`);
  }
});

// ==================== ANALYTICS FUNCTIONS ====================

/**
 * Generate daily analytics report
 */
exports.generateDailyAnalytics = onCall(async (request) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all active flocks
    const flocksSnapshot = await db
        .collection("flocks")
        .where("isActive", "==", true)
        .get();

    const analytics = {
      date: today,
      flocks: {},
      summary: {
        totalFlocks: 0,
        totalBirds: 0,
        totalMortality: 0,
        totalFeedConsumption: 0,
      },
    };

    for (const flockDoc of flocksSnapshot.docs) {
      const flockData = flockDoc.data();
      const flockId = flockDoc.id;

      // Get today's mortality
      const mortalitySnapshot = await db
          .collection("mortality")
          .where("flockId", "==", flockId)
          .where("recordedAt", ">=", today)
          .get();

      const dailyMortality = mortalitySnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().count || 0),
          0,
      );

      // Get today's feed consumption
      const feedSnapshot = await db
          .collection("feedConsumption")
          .where("flockId", "==", flockId)
          .where("recordedAt", ">=", today)
          .get();

      const dailyFeedConsumption = feedSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().quantityConsumed || 0),
          0,
      );

      analytics.flocks[flockId] = {
        batchNumber: flockData.batchNumber,
        mortality: dailyMortality,
        feedConsumption: dailyFeedConsumption,
        currentQuantity: flockData.quantity,
        healthStatus: flockData.healthStatus,
      };

      analytics.summary.totalFlocks++;
      analytics.summary.totalBirds += flockData.quantity;
      analytics.summary.totalMortality += dailyMortality;
      analytics.summary.totalFeedConsumption += dailyFeedConsumption;
    }

    // Store analytics report
    await db.collection("analytics").add({
      ...analytics,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: "Daily analytics generated successfully",
      analytics,
    };
  } catch (error) {
    throw new Error(`Failed to generate analytics: ${error.message}`);
  }
});

// ==================== TRIGGERS ====================

/**
 * Auto-alert when mortality rate exceeds threshold
 */
exports.checkHighMortalityRate = onDocumentWritten(
    "flocks/{docId}",
    async (event) => {
      const data = event.data.after.data();

      if (!data || !data.isActive) {
        return;
      }

      const mortalityThreshold = 5; // Alert if mortality rate exceeds 5%

      if (data.mortalityRate > mortalityThreshold) {
      // Create alert
        await db.collection("alerts").add({
          type: "high_mortality",
          flockId: event.params.docId,
          batchNumber: data.batchNumber,
          mortalityRate: data.mortalityRate,
          severity: data.mortalityRate > 10 ? "critical" : "warning",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);

/**
 * Auto-alert when feed inventory is low
 */
exports.checkLowInventory = onDocumentWritten(
    "feedInventory/{docId}",
    async (event) => {
      const data = event.data.after.data();

      if (!data) {
        return;
      }

      if (data.quantity < data.reorderLevel) {
      // Create alert
        await db.collection("alerts").add({
          type: "low_inventory",
          feedType: data.feedType,
          currentQuantity: data.quantity,
          reorderLevel: data.reorderLevel,
          severity:
          data.quantity < data.reorderLevel / 2 ? "critical" : "warning",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    },
);
