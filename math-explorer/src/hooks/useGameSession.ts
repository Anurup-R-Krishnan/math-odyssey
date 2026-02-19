import { useState, useCallback, useEffect } from "react";
import {
  GameSession,
  QuestionAttempt,
  DifficultyState,
} from "@/types/game";
import { addSession, getAllSessions as getAllSessionsDB, migrateFromLocalStorage } from "@/lib/db";

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyState>({
    level: 1,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
  });

  useEffect(() => {
    // Attempt migration on mount
    migrateFromLocalStorage().catch((err) =>
      console.error("Migration failed:", err)
    );
  }, []);

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

      addSession(ended).catch((err) =>
        console.error("Failed to save session to DB:", err)
      );

      return ended;
    });
  }, []);

  const getAllSessions = useCallback(async (): Promise<GameSession[]> => {
    return await getAllSessionsDB();
  }, []);

  const exportCSV = useCallback(async (): Promise<string> => {
    const sessions = await getAllSessionsDB();
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
