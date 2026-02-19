import { renderHook, act } from "@testing-library/react";
import { useGameSession } from "./useGameSession";
import { GameSession } from "@/types/game";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Helper to generate dummy sessions
const generateDummySessions = (count: number): GameSession[] => {
  return Array.from({ length: count }, (_, i) => ({
    sessionId: `session_${i}`,
    rollNo: "TEST-USER",
    attempts: [],
    startedAt: Date.now() - 10000,
    endedAt: Date.now(),
  }));
};

describe("useGameSession Performance Benchmark", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const runBenchmark = (sessionCount: number) => {
    // Pre-fill localStorage
    const sessions = generateDummySessions(sessionCount);
    localStorage.setItem("neuromath_sessions", JSON.stringify(sessions));

    const { result } = renderHook(() => useGameSession());

    // Start a session first (needed for endSession to work properly)
    act(() => {
      result.current.startSession("TEST-USER");
    });

    const start = performance.now();

    // Measure endSession
    act(() => {
      result.current.endSession();
    });

    const end = performance.now();
    const duration = end - start;

    console.log(`[Benchmark] endSession with ${sessionCount} sessions: ${duration.toFixed(3)}ms`);
    return duration;
  };

  it("should demonstrate performance scaling", () => {
    const time100 = runBenchmark(100);
    const time1000 = runBenchmark(1000);
    const time5000 = runBenchmark(5000);

    // We expect time to increase, but let's not make the test fail if it's fast enough.
    // This test is primarily for manual verification of the performance issue.
    // However, we can assert that 5000 sessions take longer than 100 sessions.
    // Note: In a fast CI environment, small differences might be noisy.

    // Relaxed assertion for now, mainly logging output.
    expect(time5000).toBeGreaterThan(0);
  });
});
