import { useState, useCallback, useEffect } from "react";
import {
  GameSession,
  QuestionAttempt,
  DifficultyState,
} from "@/types/game";

const SESSION_KEY = "neuromath_sessions";

function generateSessionId(): string {
  return `session_${Date.now()}_${crypto.randomUUID()}`;
}

function loadSessions(): GameSession[] {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: GameSession[]) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
}

export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyState>({
    level: 1,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
  });

  const startSession = useCallback((rollNo: string, initialLevel: number = 1) => {
    const newSession: GameSession = {
      sessionId: generateSessionId(),
      rollNo,
      attempts: [],
      startedAt: Date.now(),
    };
    setSession(newSession);
    setDifficulty({ level: initialLevel, consecutiveCorrect: 0, consecutiveWrong: 0 });
  }, []);

  const recordAttempt = useCallback(
    (attempt: QuestionAttempt) => {
      setSession((prev) => {
        if (!prev) return prev;
        return { ...prev, attempts: [...prev.attempts, attempt] };
      });

      setDifficulty((prev) => {
        if (attempt.correct) {
          const newCorrect = prev.consecutiveCorrect + 1;
          if (newCorrect >= 5) {
            return {
              level: prev.level + 1,
              consecutiveCorrect: 0,
              consecutiveWrong: 0,
            };
          }
          return { ...prev, consecutiveCorrect: newCorrect, consecutiveWrong: 0 };
        } else {
          const newWrong = prev.consecutiveWrong + 1;
          if (newWrong >= 3) {
            return {
              level: Math.max(1, prev.level - 1),
              consecutiveCorrect: 0,
              consecutiveWrong: 0,
            };
          }
          return { ...prev, consecutiveWrong: newWrong, consecutiveCorrect: 0 };
        }
      });
    },
    []
  );

  const endSession = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const ended = { ...prev, endedAt: Date.now() };
      const all = loadSessions();
      all.push(ended);
      saveSessions(all);
      return ended;
    });
  }, []);

  const getAllSessions = useCallback((): GameSession[] => {
    return loadSessions();
  }, []);

  const exportCSV = useCallback((): string => {
    const sessions = loadSessions();
    const rows = ["rollNo,sessionId,questionId,attempts,hintUsed,correct"];
    sessions.forEach((s) => {
      s.attempts.forEach((a) => {
        rows.push(
          `${s.rollNo},${s.sessionId},${a.questionId},${a.attempts},${a.hintUsed},${a.correct}`
        );
      });
    });
    return rows.join("\n");
  }, []);

  return {
    session,
    difficulty,
    startSession,
    recordAttempt,
    endSession,
    getAllSessions,
    exportCSV,
  };
}
