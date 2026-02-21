import { renderHook } from "@testing-library/react";
import { useGameSession } from "../hooks/useGameSession";
import { GameSession } from "../types/game";
import { describe, it, expect, beforeEach } from "vitest";

describe("useGameSession", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("handles corrupted data in localStorage by returning empty array", () => {
    localStorage.setItem("neuromath_sessions", "invalid-json");

    const { result } = renderHook(() => useGameSession());
    const sessions = result.current.getAllSessions();

    expect(sessions).toEqual([]);
  });

  it("handles valid data in localStorage", () => {
    const dummySession: GameSession = {
      sessionId: "session_123",
      rollNo: "123",
      attempts: [],
      startedAt: 1234567890,
    };
    localStorage.setItem("neuromath_sessions", JSON.stringify([dummySession]));

    const { result } = renderHook(() => useGameSession());
    const sessions = result.current.getAllSessions();

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toEqual(dummySession);
  });

  it("handles empty localStorage", () => {
    const { result } = renderHook(() => useGameSession());
    const sessions = result.current.getAllSessions();

    expect(sessions).toEqual([]);
  });
});
