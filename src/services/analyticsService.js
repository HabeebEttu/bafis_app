import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { flockService } from "./flockService";
import { feedService } from "./feedService";
import { mortalityService } from "./mortalityService";

export const analyticsService = {
  // Get overall dashboard metrics
  getDashboardMetrics: async () => {
    try {
      const flockStats = await flockService.getFlockStats();
      const feedStats = await feedService.getFeedStats();

      const metrics = {
        flocks: flockStats,
        feed: feedStats,
        lastUpdated: new Date(),
      };

      return metrics;
    } catch (error) {
      console.error("Error getting dashboard metrics:", error);
      throw error;
    }
  },

  // Get flock health overview
  getFlockHealthOverview: async () => {
    try {
      const flocks = await flockService.getAllFlocks();
      const healthData = [];

      for (const flock of flocks) {
        if (flock.isActive) {
          const mortalityStats = await mortalityService.getMortalityStats(
            flock.id
          );

          healthData.push({
            id: flock.id,
            batchNumber: flock.batchNumber,
            breed: flock.breed,
            quantity: flock.quantity,
            healthStatus: flock.healthStatus,
            mortalityRate: flock.mortalityRate,
            avgDailyMortality: mortalityStats.avgDailyMortality,
            location: flock.location,
            age: flock.age,
          });
        }
      }

      return healthData;
    } catch (error) {
      console.error("Error getting flock health overview:", error);
      throw error;
    }
  },

  // Get performance metrics for a specific flock
  getFlockPerformanceMetrics: async (flockId) => {
    try {
      const flock = await flockService.getFlockById(flockId);
      const mortalityStats = await mortalityService.getMortalityStats(flockId);
      const feedConsumption = await feedService.getFeedConsumptionByFlock(
        flockId
      );

      const avgFeedConsumption =
        feedConsumption.length > 0
          ? (feedConsumption.reduce((sum, f) => sum + (f.quantityConsumed || 0), 0) /
            feedConsumption.length).toFixed(2)
          : 0;

      return {
        flockId,
        batchNumber: flock.batchNumber,
        breed: flock.breed,
        totalBirds: flock.initialQuantity,
        remainingBirds: flock.quantity,
        mortalityRate: flock.mortalityRate,
        totalMortality: mortalityStats.totalMortality,
        avgDailyMortality: mortalityStats.avgDailyMortality,
        avgFeedConsumption,
        healthStatus: flock.healthStatus,
        age: flock.age,
        createdAt: flock.createdAt,
      };
    } catch (error) {
      console.error("Error getting flock performance metrics:", error);
      throw error;
    }
  },

  // Get feed consumption analytics for a flock
  getFeedConsumptionAnalytics: async (flockId, days = 30) => {
    try {
      const consumption = await feedService.getFeedConsumptionHistory(
        flockId,
        days
      );

      if (consumption.length === 0) {
        return {
          flockId,
          totalConsumption: 0,
          avgDailyConsumption: 0,
          trend: [],
        };
      }

      const totalConsumption = consumption.reduce(
        (sum, c) => sum + (c.quantityConsumed || 0),
        0
      );
      const avgDailyConsumption = (
        totalConsumption / consumption.length
      ).toFixed(2);

      // Group by date for trend
      const trend = {};
      consumption.forEach((c) => {
        const date = new Date(c.recordedAt.toDate()).toISOString().split("T")[0];
        trend[date] = (trend[date] || 0) + (c.quantityConsumed || 0);
      });

      return {
        flockId,
        totalConsumption: totalConsumption.toFixed(2),
        avgDailyConsumption,
        trend: Object.entries(trend).map(([date, quantity]) => ({
          date,
          quantity: parseFloat(quantity).toFixed(2),
        })),
      };
    } catch (error) {
      console.error("Error getting feed consumption analytics:", error);
      throw error;
    }
  },

  // Get mortality trend for a flock
  getMortalityTrendAnalytics: async (flockId, days = 30) => {
    try {
      const summary = await mortalityService.getDailyMortalitySummary(
        flockId,
        days
      );

      const causesBreakdown = {};
      summary.forEach((day) => {
        Object.entries(day.causes).forEach(([cause, count]) => {
          causesBreakdown[cause] = (causesBreakdown[cause] || 0) + count;
        });
      });

      return {
        flockId,
        period: `Last ${days} days`,
        daily: summary,
        causesBreakdown,
        totalMortality: summary.reduce((sum, day) => sum + day.count, 0),
      };
    } catch (error) {
      console.error("Error getting mortality trend analytics:", error);
      throw error;
    }
  },

  // Get inventory turnover analytics
  getInventoryTurnoverAnalytics: async () => {
    try {
      const inventory = await feedService.getFeedInventory();
      const purchases = await feedService.getPurchaseOrders();

      const analysis = {
        totalItems: inventory.length,
        items: [],
        summary: {
          highTurnover: 0,
          normalTurnover: 0,
          lowTurnover: 0,
          overstock: 0,
          understock: 0,
        },
      };

      inventory.forEach((item) => {
        const itemPurchases = purchases.filter(
          (p) => p.feedType === item.feedType && p.status === "completed"
        );
        const turnoverRate =
          itemPurchases.length > 0
            ? (item.quantity / (itemPurchases.reduce((sum, p) => sum + (p.quantity || 0), 0) + 1))
              .toFixed(2)
            : 0;

        const status =
          item.quantity > item.maxCapacity
            ? "overstock"
            : item.quantity < item.reorderLevel
              ? "understock"
              : "normal";

        analysis.items.push({
          feedType: item.feedType,
          quantity: item.quantity,
          reorderLevel: item.reorderLevel,
          maxCapacity: item.maxCapacity,
          turnoverRate,
          status,
        });

        if (turnoverRate > 0.7) analysis.summary.highTurnover++;
        else if (turnoverRate > 0.3) analysis.summary.normalTurnover++;
        else analysis.summary.lowTurnover++;

        if (status === "overstock") analysis.summary.overstock++;
        if (status === "understock") analysis.summary.understock++;
      });

      return analysis;
    } catch (error) {
      console.error("Error getting inventory turnover analytics:", error);
      throw error;
    }
  },
};
