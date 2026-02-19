import { describe, it, expect } from 'vitest';

// Mock types
interface QuestionAttempt {
  correct: boolean;
  hintUsed: boolean;
  questionId: string;
  attempts: number;
  hintsShown: number;
  timestamp: number;
}

interface GameSession {
  attempts: QuestionAttempt[];
  sessionId: string;
  rollNo: string;
  startedAt: number;
}

function generateSessions(count: number, attemptsPerSession: number): GameSession[] {
  const sessions: GameSession[] = [];
  for (let i = 0; i < count; i++) {
    const attempts: QuestionAttempt[] = [];
    for (let j = 0; j < attemptsPerSession; j++) {
      attempts.push({
        correct: Math.random() > 0.5,
        hintUsed: Math.random() > 0.8,
        questionId: `q_${j}`,
        attempts: 1,
        hintsShown: 0,
        timestamp: Date.now()
      });
    }
    sessions.push({
      sessionId: `s_${i}`,
      rollNo: '123',
      attempts,
      startedAt: Date.now()
    });
  }
  return sessions;
}

describe('Dashboard Performance Benchmark', () => {
  it('measures performance of stats calculation', () => {
    const sessionCount = 10000;
    const attemptsPerSession = 50;
    console.log(`Generating ${sessionCount} sessions with ${attemptsPerSession} attempts each...`);
    const sessions = generateSessions(sessionCount, attemptsPerSession);

    // Original Implementation
    const startOriginal = performance.now();

    const totalAttemptsOriginal = sessions.reduce((sum, s) => sum + s.attempts.length, 0);
    const totalCorrectOriginal = sessions.reduce(
        (sum, s) => sum + s.attempts.filter((a) => a.correct).length,
        0
      );
    const totalHintsOriginal = sessions.reduce(
        (sum, s) => sum + s.attempts.filter((a) => a.hintUsed).length,
        0
      );

    const endOriginal = performance.now();
    const timeOriginal = endOriginal - startOriginal;

    console.log(`Original Implementation Time: ${timeOriginal.toFixed(2)}ms`);

    // Optimized Implementation
    const startOptimized = performance.now();

    const { totalAttempts, totalCorrect, totalHints } = sessions.reduce(
      (acc, session) => {
        // Single pass over attempts
        for (const attempt of session.attempts) {
            acc.totalAttempts++;
            if (attempt.correct) acc.totalCorrect++;
            if (attempt.hintUsed) acc.totalHints++;
        }
        return acc;
      },
      { totalAttempts: 0, totalCorrect: 0, totalHints: 0 }
    );

    const endOptimized = performance.now();
    const timeOptimized = endOptimized - startOptimized;

    console.log(`Optimized Implementation Time: ${timeOptimized.toFixed(2)}ms`);
    console.log(`Improvement: ${(timeOriginal / timeOptimized).toFixed(2)}x`);

    // Verification
    expect(totalAttempts).toBe(totalAttemptsOriginal);
    expect(totalCorrect).toBe(totalCorrectOriginal);
    expect(totalHints).toBe(totalHintsOriginal);
  });
});
