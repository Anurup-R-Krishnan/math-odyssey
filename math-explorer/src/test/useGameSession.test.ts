import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useGameSession } from "../hooks/useGameSession";
import { QuestionAttempt } from "../types/game";

describe("useGameSession", () => {
  const mockDate = 1234567890;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useGameSession());

    expect(result.current.session).toBeNull();
    expect(result.current.difficulty).toEqual({
      level: 1,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
    });
  });

  it("should start a new session", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("test-roll");
    });

    expect(result.current.session).toEqual({
      sessionId: expect.stringContaining("session_"),
      rollNo: "test-roll",
      attempts: [],
      startedAt: mockDate,
    });

    expect(result.current.difficulty).toEqual({
      level: 1,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
    });
  });

  it("should record a correct attempt", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("test-roll");
    });

    const attempt: QuestionAttempt = {
      questionId: "q1",
      attempts: 1,
      hintUsed: false,
      hintsShown: 0,
      correct: true,
      timestamp: mockDate,
    };

    act(() => {
      result.current.recordAttempt(attempt);
    });

    expect(result.current.session?.attempts).toHaveLength(1);
    expect(result.current.session?.attempts[0]).toEqual(attempt);
    expect(result.current.difficulty.consecutiveCorrect).toBe(1);
    expect(result.current.difficulty.consecutiveWrong).toBe(0);
  });

  it("should level up after 5 consecutive correct answers", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("test-roll");
    });

    const attempt: QuestionAttempt = {
      questionId: "q1",
      attempts: 1,
      hintUsed: false,
      hintsShown: 0,
      correct: true,
      timestamp: mockDate,
    };

    // record 4 attempts
    for (let i = 0; i < 4; i++) {
      act(() => {
        result.current.recordAttempt(attempt);
      });
    }

    expect(result.current.difficulty.level).toBe(1);
    expect(result.current.difficulty.consecutiveCorrect).toBe(4);

    // record 5th attempt
    act(() => {
      result.current.recordAttempt(attempt);
    });

    expect(result.current.difficulty.level).toBe(2);
    expect(result.current.difficulty.consecutiveCorrect).toBe(0);
  });

  it("should record a wrong attempt", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("test-roll");
    });

    const attempt: QuestionAttempt = {
      questionId: "q1",
      attempts: 1,
      hintUsed: false,
      hintsShown: 0,
      correct: false,
      timestamp: mockDate,
    };

    act(() => {
      result.current.recordAttempt(attempt);
    });

    expect(result.current.difficulty.consecutiveWrong).toBe(1);
    expect(result.current.difficulty.consecutiveCorrect).toBe(0);
  });

  it("should level down after 3 consecutive wrong answers", () => {
    const { result } = renderHook(() => useGameSession());

    // Start at level 2
    act(() => {
      result.current.startSession("test-roll", 2);
    });

    const attempt: QuestionAttempt = {
      questionId: "q1",
      attempts: 1,
      hintUsed: false,
      hintsShown: 0,
      correct: false,
      timestamp: mockDate,
    };

    // record 2 attempts
    for (let i = 0; i < 2; i++) {
      act(() => {
        result.current.recordAttempt(attempt);
      });
    }

    expect(result.current.difficulty.level).toBe(2);
    expect(result.current.difficulty.consecutiveWrong).toBe(2);

    // record 3rd attempt
    act(() => {
      result.current.recordAttempt(attempt);
    });

    expect(result.current.difficulty.level).toBe(1);
    expect(result.current.difficulty.consecutiveWrong).toBe(0);
  });

  it("should not level down below level 1", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("test-roll", 1);
    });

    const attempt: QuestionAttempt = {
      questionId: "q1",
      attempts: 1,
      hintUsed: false,
      hintsShown: 0,
      correct: false,
      timestamp: mockDate,
    };

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.recordAttempt(attempt);
      });
    }

    expect(result.current.difficulty.level).toBe(1);
  });

  it("should end session and save to localStorage", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("test-roll");
    });

    act(() => {
      result.current.endSession();
    });

    expect(result.current.session?.endedAt).toBe(mockDate);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "neuromath_sessions",
      expect.stringContaining(result.current.session!.sessionId)
    );
  });

  it("should get all sessions from localStorage", () => {
    const mockSessions = [{ sessionId: "s1" }, { sessionId: "s2" }];
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSessions));

    const { result } = renderHook(() => useGameSession());

    const sessions = result.current.getAllSessions();
    expect(sessions).toEqual(mockSessions);
  });

  it("should export sessions to CSV format", () => {
    const mockSessions = [
      {
        sessionId: "s1",
        rollNo: "u1",
        attempts: [
          {
            questionId: "q1",
            attempts: 1,
            hintUsed: false,
            correct: true,
          },
        ],
      },
    ];
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(mockSessions));

    const { result } = renderHook(() => useGameSession());

    const csv = result.current.exportCSV();
    const expectedCSV =
      "rollNo,sessionId,questionId,attempts,hintUsed,correct\nu1,s1,q1,1,false,true";

    expect(csv).toBe(expectedCSV);
  });
});
