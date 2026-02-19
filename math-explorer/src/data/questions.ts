import { Question } from "@/types/game";

const PATTERN_COLORS = ["red", "blue", "green", "yellow", "purple"];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function generateAdditionQuestion(difficulty: number): Question {
  const maxVal = 5 + difficulty * 3;
  const a = Math.floor(Math.random() * maxVal) + 1;
  const b = Math.floor(Math.random() * maxVal) + 1;
  const answer = a + b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const d = answer + Math.floor(Math.random() * 5) - 2;
    if (d > 0 && d !== answer) distractors.add(d);
  }

  return {
    id: generateId(),
    type: "addition",
    prompt: `What is ${a} + ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    options: shuffleArray([...distractors]),
    difficulty,
  };
}

export function generateSubtractionQuestion(difficulty: number): Question {
  const maxVal = 5 + difficulty * 3;
  const b = Math.floor(Math.random() * maxVal) + 1;
  const a = b + Math.floor(Math.random() * maxVal) + 1;
  const answer = a - b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const d = answer + Math.floor(Math.random() * 5) - 2;
    if (d >= 0 && d !== answer) distractors.add(d);
  }

  return {
    id: generateId(),
    type: "subtraction",
    prompt: `What is ${a} - ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    options: shuffleArray([...distractors]),
    difficulty,
  };
}

export function generatePatternQuestion(difficulty: number): Question {
  const patternLength = Math.min(3 + Math.floor(difficulty / 2), 5);
  const basePattern = PATTERN_COLORS.slice(0, patternLength);
  const sequence = [...basePattern, ...basePattern].slice(0, patternLength * 2);
  const answer = basePattern[0];

  const distractors = new Set<string>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const c = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];
    distractors.add(c);
  }

  return {
    id: generateId(),
    type: "pattern",
    prompt: "What color comes next in the pattern?",
    answer,
    options: shuffleArray([...distractors]),
    patternSequence: [...sequence, "?"],
    difficulty,
  };
}

export function generateQuestion(
  type: "addition" | "subtraction" | "pattern",
  difficulty: number
): Question {
  switch (type) {
    case "addition":
      return generateAdditionQuestion(difficulty);
    case "subtraction":
      return generateSubtractionQuestion(difficulty);
    case "pattern":
      return generatePatternQuestion(difficulty);
  }
}

export function generateMicroPractice(original: Question): Question {
  return generateQuestion(original.type, Math.max(1, original.difficulty - 1));
}
