import React, { createContext, useContext, useState, useEffect } from "react";
import { flockService } from "../services/flockService";
import { useAuth } from "./AuthContext";

const FlockContext = createContext();

export const useFlocks = () => {
  const context = useContext(FlockContext);
  if (!context) {
    throw new Error("useFlocks must be used within FlockProvider");
  }
  return context;
};

export const FlockProvider = ({ children }) => {
  const { userData } = useAuth();
  const [flocks, setFlocks] = useState([]);
  const [activeFlocks, setActiveFlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Fetch all flocks on mount
  useEffect(() => {
    

    const fetchFlocks = async () => {
      try {
        setLoading(true);
        const [allFlocks, activeOnly, flockStats] = await Promise.all([
          flockService.getAllFlocks(),
          flockService.getActiveFlocks(),
          flockService.getFlockStats(),
        ]);

        setFlocks(allFlocks);
        setActiveFlocks(activeOnly);
        setStats(flockStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching flocks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlocks();
  }, []);

  useEffect(() => {

    const unsubscribe = flockService.subscribeToFlocks(
      (updatedFlocks) => {
        setFlocks(updatedFlocks);
        setActiveFlocks(updatedFlocks.filter((f) => f.isActive));
      }
    );

    return () => unsubscribe();
  }, []);
  const createFlock = async (flockData) => {
    try {
      setError(null);
      const flockId = await flockService.createFlock({
        ...flockData,
        submittedBy: userData.uid,
      });

      return flockId;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateFlock = async (flockId, updateData) => {
    try {
      setError(null);
      await flockService.updateFlock(flockId, updateData);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getFlockById = async (flockId) => {
    try {
      return await flockService.getFlockById(flockId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const updateFlockQuantity = async (flockId, newQuantity, reason) => {
    try {
      setError(null);
      await flockService.updateFlockQuantity(flockId, newQuantity, reason);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const updateHealthStatus = async (flockId, healthStatus, notes) => {
    try {
      setError(null);
      await flockService.updateHealthStatus(flockId, healthStatus, notes);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const approveFlock = async (flockId) => {
    try {
      setError(null);
      await flockService.approveFlock(flockId, userData.uid);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const rejectFlock = async (flockId, reason) => {
    try {
      setError(null);
      await flockService.rejectFlock(flockId, userData.uid, reason);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const deactivateFlock = async (flockId, reason) => {
    try {
      setError(null);
      await flockService.deactivateFlock(flockId, reason);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const deleteFlock = async (flockId) => {
    try {
      setError(null);
      await flockService.deleteFlock(flockId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const getFlocksByStatus = async (status) => {
    try {
      return await flockService.getFlocksByStatus(status);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const getFlocksByBreed = async (breed) => {
    try {
      return await flockService.getFlocksByBreed(breed);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const refreshStats = async () => {
    try {
      const flockStats = await flockService.getFlockStats();
      setStats(flockStats);
    } catch (err) {
      console.error("Error refreshing stats:", err);
    }
  };

  const value = {
    flocks,
    activeFlocks,
    loading,
    error,
    stats,
    createFlock,
    updateFlock,
    getFlockById,
    updateFlockQuantity,
    updateHealthStatus,
    approveFlock,
    rejectFlock,
    deactivateFlock,
    deleteFlock,
    getFlocksByStatus,
    getFlocksByBreed,
    refreshStats,
  };

  return (
    <FlockContext.Provider value={value}>{children}</FlockContext.Provider>
  );
};
