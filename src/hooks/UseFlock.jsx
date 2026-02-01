import { useState, useEffect } from "react";
import { flockService } from "../services/flockService";

export const useFlock = (flockId) => {
  const [flock, setFlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!flockId) {
      setLoading(false);
      return;
    }

    const unsubscribe = flockService.subscribeToFlock(
      flockId,
      (updatedFlock) => {
        setFlock(updatedFlock);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [flockId]);

  return { flock, loading, error };
};
