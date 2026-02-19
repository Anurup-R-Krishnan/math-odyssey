import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameSession, LEVEL_UP_THRESHOLD, LEVEL_DOWN_THRESHOLD } from "../hooks/useGameSession";
import { QuestionAttempt } from "../types/game";

describe("useGameSession", () => {
  it("should initialize with default difficulty", () => {
    const { result } = renderHook(() => useGameSession());
    expect(result.current.difficulty).toEqual({
      level: 1,
      consecutiveCorrect: 0,
      consecutiveWrong: 0,
    });
  });

  it("should increase level after 5 consecutive correct answers", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("123", 1);
    });

    const attempt: QuestionAttempt = {
      questionId: "q1",
      attempts: 1,
      hintUsed: false,
      hintsShown: 0,
      correct: true,
      timestamp: Date.now(),
    };

    // correct answers up to threshold - 1
    for (let i = 0; i < LEVEL_UP_THRESHOLD - 1; i++) {
      act(() => {
        result.current.recordAttempt(attempt);
      });
      expect(result.current.difficulty.consecutiveCorrect).toBe(i + 1);
      expect(result.current.difficulty.level).toBe(1);
    }

    // 5th correct answer
    act(() => {
      result.current.recordAttempt(attempt);
    });

    expect(result.current.difficulty.level).toBe(2);
    expect(result.current.difficulty.consecutiveCorrect).toBe(0);
  });

  it("should decrease level after 3 consecutive wrong answers", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("123", 2); // Start at level 2
    });

    const attempt: QuestionAttempt = {
      questionId: "q1",
      attempts: 1,
      hintUsed: false,
      hintsShown: 0,
      correct: false,
      timestamp: Date.now(),
    };

    // wrong answers up to threshold - 1
    for (let i = 0; i < LEVEL_DOWN_THRESHOLD - 1; i++) {
      act(() => {
        result.current.recordAttempt(attempt);
      });
      expect(result.current.difficulty.consecutiveWrong).toBe(i + 1);
      expect(result.current.difficulty.level).toBe(2);
    }

    // 3rd wrong answer
    act(() => {
      result.current.recordAttempt(attempt);
    });

    expect(result.current.difficulty.level).toBe(1);
    expect(result.current.difficulty.consecutiveWrong).toBe(0);
  });
});
