import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../hooks/useIsMobile";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
  });

  it("should return false when width is greater than breakpoint (768)", () => {
    // Mock matchMedia to return false (not mobile)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

     // Set innerWidth > 768
     Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true when width is less than breakpoint (768)", () => {
     // Mock matchMedia to return true (mobile)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Set innerWidth < 768
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should update when window resize triggers change event", () => {
      let changeHandler: (e: MediaQueryListEvent) => void = () => {};
      const addEventListenerMock = vi.fn((event, handler) => {
          if (event === 'change') {
              changeHandler = handler;
          }
      });

      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: addEventListenerMock,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      // Start with desktop
      Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 1024,
        });

      const { result } = renderHook(() => useIsMobile());
      expect(result.current).toBe(false);

      // Simulate resize to mobile
       Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 500,
        });

      act(() => {
          changeHandler({ matches: true } as MediaQueryListEvent);
      });

      expect(result.current).toBe(true);
  });
});
