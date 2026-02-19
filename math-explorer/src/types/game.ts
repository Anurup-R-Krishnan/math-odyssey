export type ProblemType = "addition" | "subtraction" | "multiplication" | "division" | "fraction" | "pattern";

export interface Question {
  id: string;
  type: ProblemType;
  prompt: string;
  operandA?: number;
  operandB?: number;
  answer: number | string;
  options: (number | string)[];
  patternSequence?: string[];
  difficulty: number;
}

export interface HintTemplate {
  type: ProblemType;
  hint1: string;
  hint2: string;
  revealMessage: string;
}

export interface QuestionAttempt {
  questionId: string;
  attempts: number;
  hintUsed: boolean;
  hintsShown: number;
  correct: boolean;
  timestamp: number;
}

export interface GameSession {
  sessionId: string;
  rollNo: string;
  attempts: QuestionAttempt[];
  startedAt: number;
  endedAt?: number;
}

export interface DifficultyState {
  level: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
}

export type MissionStatus = "locked" | "active" | "completed";

export interface Mission {
  id: string;
  title: string;
  type: ProblemType;
  status: MissionStatus;
  description: string;
  stars: number; // 0-3
  initialLevel?: number;
  iconType?: "star" | "chest" | "crown" | "trophy";
}
