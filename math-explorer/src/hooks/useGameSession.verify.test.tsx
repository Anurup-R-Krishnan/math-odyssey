import { renderHook, act, waitFor } from "@testing-library/react";
import { useGameSession } from "./useGameSession";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { _resetDBPromise } from "@/lib/db";

describe("useGameSession Persistence Verification", () => {
  const DB_NAME = "neuromath_db";

  beforeEach(() => {
    localStorage.clear();
    if (window.indexedDB.deleteDatabase) {
        window.indexedDB.deleteDatabase(DB_NAME);
    }
    _resetDBPromise();
  });

  afterEach(() => {
    if (window.indexedDB.deleteDatabase) {
        window.indexedDB.deleteDatabase(DB_NAME);
    }
    localStorage.clear();
    _resetDBPromise();
  });

  it("should save session to IndexedDB and retrieve it", async () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("USER-123");
    });

    const sessionId = result.current.session?.sessionId;
    expect(sessionId).toBeDefined();

    act(() => {
      result.current.endSession();
    });

    // Wait for async save to complete
    await waitFor(async () => {
      const sessions = await result.current.getAllSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].sessionId).toBe(sessionId);
      expect(sessions[0].rollNo).toBe("USER-123");
      expect(sessions[0].endedAt).toBeDefined();
    });
  });

  it("should migrate existing sessions from localStorage", async () => {
    // Seed localStorage
    const oldSession = {
      sessionId: "old_session_1",
      rollNo: "OLD-USER",
      attempts: [],
      startedAt: 1000,
      endedAt: 2000
    };
    localStorage.setItem("neuromath_sessions", JSON.stringify([oldSession]));

    const { result } = renderHook(() => useGameSession());

    // Wait for migration
    await waitFor(async () => {
       const sessions = await result.current.getAllSessions();
       expect(sessions).toHaveLength(1);
       expect(sessions[0].sessionId).toBe("old_session_1");
    });

    // Verify localStorage is cleared
    await waitFor(() => {
        expect(localStorage.getItem("neuromath_sessions")).toBeNull();
    });
  });
});
