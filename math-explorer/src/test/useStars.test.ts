import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useStars } from "../hooks/useStars";

const STARS_KEY = "neuromath_total_stars";

describe("useStars", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should initialize with 0 stars when localStorage is empty", () => {
    const { result } = renderHook(() => useStars());
    expect(result.current.stars).toBe(0);
  });

  it("should initialize with saved stars from localStorage", () => {
    localStorage.setItem(STARS_KEY, "5");
    const { result } = renderHook(() => useStars());
    expect(result.current.stars).toBe(5);
  });

  it("should handle non-numeric values in localStorage gracefully (default to NaN but behavior check)", () => {
    // The current implementation uses parseInt which returns NaN for non-numeric strings
    localStorage.setItem(STARS_KEY, "invalid");
    const { result } = renderHook(() => useStars());
    expect(result.current.stars).toBeNaN();
  });

  it("should default to 0 if localStorage throws an error during initialization", () => {
    // Mock getItem to throw error
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage error");
    });

    const { result } = renderHook(() => useStars());
    expect(result.current.stars).toBe(0);

    getItemSpy.mockRestore();
  });

  it("should increment stars when addStar is called", () => {
    const { result } = renderHook(() => useStars());

    act(() => {
      result.current.addStar();
    });

    expect(result.current.stars).toBe(1);
    expect(localStorage.getItem(STARS_KEY)).toBe("1");
  });

  it("should reset stars when resetStars is called", () => {
    localStorage.setItem(STARS_KEY, "10");
    const { result } = renderHook(() => useStars());

    expect(result.current.stars).toBe(10);

    act(() => {
      result.current.resetStars();
    });

    expect(result.current.stars).toBe(0);
    expect(localStorage.getItem(STARS_KEY)).toBe("0");
  });

  it("should persist stars to localStorage when they change", () => {
    const { result } = renderHook(() => useStars());

    act(() => {
      result.current.addStar();
      result.current.addStar();
    });

    expect(localStorage.getItem(STARS_KEY)).toBe("2");
  });
});
