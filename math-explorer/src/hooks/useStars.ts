import { useState, useEffect, useCallback } from "react";

const STARS_KEY = "neuromath_total_stars";

export function useStars() {
  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STARS_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem(STARS_KEY, stars.toString());
  }, [stars]);

  const addStar = useCallback(() => {
    setStars((prev) => prev + 1);
  }, []);

  const resetStars = useCallback(() => {
    setStars(0);
  }, []);

  return { stars, addStar, resetStars };
}
