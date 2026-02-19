import { useState, useEffect, useCallback } from "react";

const FOCUS_KEY = "neuromath_focus_mode";

export function useFocusMode() {
  const [focusMode, setFocusModeState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(FOCUS_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem(FOCUS_KEY, String(focusMode));
    if (focusMode) {
      document.documentElement.classList.add("focus-mode");
    } else {
      document.documentElement.classList.remove("focus-mode");
    }
  }, [focusMode]);

  const toggleFocusMode = useCallback(() => {
    setFocusModeState((prev) => !prev);
  }, []);

  const shouldAnimate = !focusMode && !prefersReducedMotion;

  return { focusMode, toggleFocusMode, shouldAnimate, prefersReducedMotion };
}
