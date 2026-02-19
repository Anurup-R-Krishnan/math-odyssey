import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast, toast, reducer, _resetStateForTests } from "../hooks/use-toast";

describe("useToast", () => {
  beforeEach(() => {
    _resetStateForTests();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("reducer", () => {
    it("ADD_TOAST adds a toast and respects limit", () => {
      const initialState = { toasts: [] };
      const action1 = {
        type: "ADD_TOAST" as const,
        toast: { id: "1", title: "Toast 1" },
      };

      const state1 = reducer(initialState, action1);
      expect(state1.toasts).toHaveLength(1);
      expect(state1.toasts[0]).toEqual(action1.toast);

      // Add another toast to test limit (limit is 1)
      const action2 = {
        type: "ADD_TOAST" as const,
        toast: { id: "2", title: "Toast 2" },
      };

      const state2 = reducer(state1, action2);
      expect(state2.toasts).toHaveLength(1);
      expect(state2.toasts[0]).toEqual(action2.toast); // Newest first
    });

    it("UPDATE_TOAST updates an existing toast", () => {
      const initialState = { toasts: [{ id: "1", title: "Original" }] };
      const action = {
        type: "UPDATE_TOAST" as const,
        toast: { id: "1", title: "Updated" },
      };

      const state = reducer(initialState, action);
      expect(state.toasts[0].title).toBe("Updated");
    });

    it("DISMISS_TOAST marks toast as closed", () => {
      // Note: DISMISS_TOAST has side effects (setTimeout) which we test in integration
      const initialState = { toasts: [{ id: "1", open: true }] };
      const action = {
        type: "DISMISS_TOAST" as const,
        toastId: "1",
      };

      const state = reducer(initialState, action);
      expect(state.toasts[0].open).toBe(false);
    });

    it("REMOVE_TOAST removes the toast", () => {
      const initialState = { toasts: [{ id: "1" }] };
      const action = {
        type: "REMOVE_TOAST" as const,
        toastId: "1",
      };

      const state = reducer(initialState, action);
      expect(state.toasts).toHaveLength(0);
    });

    it("REMOVE_TOAST removes all toasts if no ID provided", () => {
      const initialState = { toasts: [{ id: "1" }, { id: "2" }] };
      const action = {
        type: "REMOVE_TOAST" as const,
      };

      const state = reducer(initialState, action);
      expect(state.toasts).toHaveLength(0);
    });
  });

  describe("hook integration", () => {
    it("returns initial empty state", () => {
      const { result } = renderHook(() => useToast());
      expect(result.current.toasts).toEqual([]);
    });

    it("adds a toast via toast()", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: "Test Toast" });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe("Test Toast");
      expect(result.current.toasts[0].open).toBe(true);
    });

    it("dismisses a toast", () => {
      const { result } = renderHook(() => useToast());

      let toastId: string;
      act(() => {
        const t = toast({ title: "To Dismiss" });
        toastId = t.id;
      });

      expect(result.current.toasts[0].open).toBe(true);

      act(() => {
        result.current.dismiss(toastId!);
      });

      expect(result.current.toasts[0].open).toBe(false);

      // Fast forward time to trigger removal
      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it("dismisses all toasts if no ID provided", () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        toast({ title: "Toast 1" });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        result.current.dismiss();
      });

      expect(result.current.toasts[0].open).toBe(false);
    });

    it("updates a toast", () => {
      const { result } = renderHook(() => useToast());

      let updateFn: (props: any) => void;
      act(() => {
        const { update } = toast({ title: "Original" });
        updateFn = update;
      });

      expect(result.current.toasts[0].title).toBe("Original");

      act(() => {
        updateFn({ title: "Updated" });
      });

      expect(result.current.toasts[0].title).toBe("Updated");
    });

    it("automatically removes dismissed toast after delay", () => {
       const { result } = renderHook(() => useToast());

       act(() => {
         const { dismiss } = toast({ title: "Auto Remove" });
         dismiss();
       });

       expect(result.current.toasts[0].open).toBe(false);

       // TOAST_REMOVE_DELAY is 1000000
       act(() => {
           vi.advanceTimersByTime(1000000);
       });

       expect(result.current.toasts).toHaveLength(0);
    });
  });
});
