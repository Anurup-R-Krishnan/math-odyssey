import { Question } from "@/types/game";

const PATTERN_COLORS = ["red", "blue", "green", "yellow", "purple"];

const QUESTION_CONFIG = {
  ADDITION: {
    EASY: { MAX_OPERAND_A_EXCLUSIVE: 6, MAX_SUM_INCLUSIVE: 10 },
    MEDIUM: { MAX_OPERAND_EXCLUSIVE: 10 },
    HARD: { BASE_MAX: 10, DIFFICULTY_SCALING_FACTOR: 5 },
    DISTRACTOR: { SPREAD: 7, OFFSET: 3, COUNT: 4 },
  },
  SUBTRACTION: {
    EASY: { MINUEND_MAX_EXCLUSIVE: 11, MINUEND_MIN: 1 }, // 1-10
    MEDIUM: { MINUEND_MAX_EXCLUSIVE: 21, MINUEND_MIN: 10, SUBTRAHEND_MAX_EXCLUSIVE: 10 }, // 10-20
    HARD: { BASE_MAX: 15, MINUEND_OFFSET: 5, DIFFICULTY_SCALING_FACTOR: 5 },
    DISTRACTOR: { SPREAD: 7, OFFSET: 3, COUNT: 4 },
  },
  MULTIPLICATION: {
    EASY: { MAX_OPERAND_EXCLUSIVE: 6 },
    MEDIUM: { MAX_OPERAND_EXCLUSIVE: 10 },
    HARD: { MAX_OPERAND_EXCLUSIVE: 13, MIN_OPERAND: 1 }, // 1-12
    DISTRACTOR: { SPREAD: 10, OFFSET: 5, COUNT: 4 },
  },
  DIVISION: {
    EASY: { DIVISOR_MAX_EXCLUSIVE: 6, DIVISOR_MIN: 1, QUOTIENT_MAX_EXCLUSIVE: 6 }, // 1-5, 0-5
    HARD: { DIVISOR_MAX_EXCLUSIVE: 10, DIVISOR_MIN: 1, QUOTIENT_MAX_EXCLUSIVE: 10 }, // 1-9, 0-9
    DISTRACTOR: { SPREAD: 5, OFFSET: 2, COUNT: 4 },
  },
  FRACTION: {
    DENOMINATORS: [2, 3, 4, 5, 6, 8],
    DISTRACTOR_COUNT: 4,
  },
  PATTERN: {
    TYPE_THRESHOLD: 0.5,
    DISTRACTOR_COUNT: 4,
  },
  MIN_DIFFICULTY: 1,
};

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
  let a, b;
  const { EASY, MEDIUM, HARD, DISTRACTOR } = QUESTION_CONFIG.ADDITION;

  // Tiered difficulty
  if (difficulty === 1) {
    // Single digit, sum <= 10
    a = Math.floor(Math.random() * EASY.MAX_OPERAND_A_EXCLUSIVE);
    b = Math.floor(Math.random() * (EASY.MAX_SUM_INCLUSIVE + 1 - a)); // so a+b <= 10
  } else if (difficulty === 2) {
    // Single digit, sum 10-18
    a = Math.floor(Math.random() * MEDIUM.MAX_OPERAND_EXCLUSIVE);
    b = Math.floor(Math.random() * MEDIUM.MAX_OPERAND_EXCLUSIVE);
  } else {
    // Double digit included
    const max = HARD.BASE_MAX + difficulty * HARD.DIFFICULTY_SCALING_FACTOR;
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
  }

  const answer = a + b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < DISTRACTOR.COUNT) {
    const d = answer + Math.floor(Math.random() * DISTRACTOR.SPREAD) - DISTRACTOR.OFFSET;
    if (d >= 0 && d !== answer) distractors.add(d);
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
  let a, b;
  const { EASY, MEDIUM, HARD, DISTRACTOR } = QUESTION_CONFIG.SUBTRACTION;

  if (difficulty === 1) {
    // Minuend up to 10
    // range = 11 - 1 = 10. Math.floor(random * 10) + 1 -> 1..10
    a = Math.floor(Math.random() * (EASY.MINUEND_MAX_EXCLUSIVE - EASY.MINUEND_MIN)) + EASY.MINUEND_MIN;
    b = Math.floor(Math.random() * a);     // 0 to a-1 (result > 0)
  } else if (difficulty === 2) {
    // Minuend up to 20
    // range = 21 - 10 = 11. Math.floor(random * 11) + 10 -> 10..20
    a = Math.floor(Math.random() * (MEDIUM.MINUEND_MAX_EXCLUSIVE - MEDIUM.MINUEND_MIN)) + MEDIUM.MINUEND_MIN;
    b = Math.floor(Math.random() * MEDIUM.SUBTRAHEND_MAX_EXCLUSIVE);      // single digit subtractor
  } else {
    // Harder
    const max = HARD.BASE_MAX + difficulty * HARD.DIFFICULTY_SCALING_FACTOR;
    a = Math.floor(Math.random() * max) + HARD.MINUEND_OFFSET;
    b = Math.floor(Math.random() * a);
  }

  const answer = a - b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < DISTRACTOR.COUNT) {
    const d = answer + Math.floor(Math.random() * DISTRACTOR.SPREAD) - DISTRACTOR.OFFSET;
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
  let patternType: "ABAB" | "AABB" | "ABC";
  const { TYPE_THRESHOLD, DISTRACTOR_COUNT } = QUESTION_CONFIG.PATTERN;

  if (difficulty === 1) {
    patternType = Math.random() > TYPE_THRESHOLD ? "ABAB" : "AABB";
  } else {
    patternType = "ABC";
  }

  let sequence: string[];
  let answer: string;

  // Pick colors
  const c1 = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];
  let c2 = c1;
  while (c2 === c1) c2 = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];
  let c3 = c1;
  if (patternType === "ABC") {
    while (c3 === c1 || c3 === c2) c3 = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];
  }

  if (patternType === "ABAB") {
    sequence = [c1, c2, c1, c2, c1, "?"];
    answer = c2;
  } else if (patternType === "AABB") {
    sequence = [c1, c1, c2, c2, c1, "?"];
    answer = c1;
  } else { // ABC
    sequence = [c1, c2, c3, c1, c2, "?"];
    answer = c3;
  }

  const distractors = new Set<string>();
  distractors.add(answer);
  while (distractors.size < DISTRACTOR_COUNT) {
    const c = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];
    distractors.add(c);
  }

  return {
    id: generateId(),
    type: "pattern",
    prompt: "What color comes next in the pattern?",
    answer,
    options: shuffleArray([...distractors]),
    patternSequence: sequence,
    difficulty,
  };
}

export function generateMultiplicationQuestion(difficulty: number): Question {
  let a, b;
  const { EASY, MEDIUM, HARD, DISTRACTOR } = QUESTION_CONFIG.MULTIPLICATION;

  if (difficulty === 1) {
    a = Math.floor(Math.random() * EASY.MAX_OPERAND_EXCLUSIVE); // 0-5
    b = Math.floor(Math.random() * EASY.MAX_OPERAND_EXCLUSIVE); // 0-5
  } else if (difficulty === 2) {
    a = Math.floor(Math.random() * MEDIUM.MAX_OPERAND_EXCLUSIVE); // 0-9
    b = Math.floor(Math.random() * MEDIUM.MAX_OPERAND_EXCLUSIVE); // 0-9
  } else {
    const range = HARD.MAX_OPERAND_EXCLUSIVE - HARD.MIN_OPERAND;
    a = Math.floor(Math.random() * range) + HARD.MIN_OPERAND; // 1-12
    b = Math.floor(Math.random() * range) + HARD.MIN_OPERAND; // 1-12
  }
  const answer = a * b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < DISTRACTOR.COUNT) {
    const d = answer + Math.floor(Math.random() * DISTRACTOR.SPREAD) - DISTRACTOR.OFFSET;
    if (d >= 0 && d !== answer) distractors.add(d);
  }

  return {
    id: generateId(),
    type: "multiplication",
    prompt: `What is ${a} × ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    options: shuffleArray([...distractors]),
    difficulty
  };
}

export function generateDivisionQuestion(difficulty: number): Question {
  let a, b, answer; // a / b = answer
  const { EASY, HARD, DISTRACTOR } = QUESTION_CONFIG.DIVISION;

  if (difficulty === 1) {
    // Simple division, answer < 6
    const bRange = EASY.DIVISOR_MAX_EXCLUSIVE - EASY.DIVISOR_MIN;
    b = Math.floor(Math.random() * bRange) + EASY.DIVISOR_MIN; // 1-5
    answer = Math.floor(Math.random() * EASY.QUOTIENT_MAX_EXCLUSIVE); // 0-5
    a = answer * b;
  } else {
    // Up to 10
    const bRange = HARD.DIVISOR_MAX_EXCLUSIVE - HARD.DIVISOR_MIN;
    b = Math.floor(Math.random() * bRange) + HARD.DIVISOR_MIN; // 1-9
    answer = Math.floor(Math.random() * HARD.QUOTIENT_MAX_EXCLUSIVE); // 0-9
    a = answer * b;
  }

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < DISTRACTOR.COUNT) {
    const d = answer + Math.floor(Math.random() * DISTRACTOR.SPREAD) - DISTRACTOR.OFFSET;
    if (d >= 0 && d !== answer) distractors.add(d);
  }

  return {
    id: generateId(),
    type: "division",
    prompt: `What is ${a} ÷ ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    options: shuffleArray([...distractors]),
    difficulty
  };
}

export function generateFractionQuestion(difficulty: number): Question {
  // Generate a fraction to identify
  // We represent it as keys for the frontend to render: numerator, denominator
  // For now, prompt asks to identify the visual representation.
  const { DENOMINATORS, DISTRACTOR_COUNT } = QUESTION_CONFIG.FRACTION;
  const denominator = DENOMINATORS[Math.floor(Math.random() * DENOMINATORS.length)];
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // Proper fraction

  const answer = `${numerator}/${denominator}`;

  const distractors = new Set<string>();
  distractors.add(answer);
  while (distractors.size < DISTRACTOR_COUNT) {
    const dDenom = DENOMINATORS[Math.floor(Math.random() * DENOMINATORS.length)];
    const dNum = Math.floor(Math.random() * (dDenom - 1)) + 1;
    const d = `${dNum}/${dDenom}`;
    if (d !== answer) distractors.add(d);
  }

  return {
    id: generateId(),
    type: "fraction",
    prompt: "What fraction is shown?",
    operandA: numerator,
    operandB: denominator, // Using operandA/B to store fraction parts for rendering
    answer,
    options: shuffleArray([...distractors]),
    difficulty
  };
}

export function generateQuestion(
  type: "addition" | "subtraction" | "multiplication" | "division" | "fraction" | "pattern",
  difficulty: number
): Question {
  switch (type) {
    case "addition":
      return generateAdditionQuestion(difficulty);
    case "subtraction":
      return generateSubtractionQuestion(difficulty);
    case "multiplication":
      return generateMultiplicationQuestion(difficulty);
    case "division":
      return generateDivisionQuestion(difficulty);
    case "fraction":
      return generateFractionQuestion(difficulty);
    case "pattern":
      return generatePatternQuestion(difficulty);
  }
}

export function generateMicroPractice(original: Question): Question {
  return generateQuestion(original.type, Math.max(QUESTION_CONFIG.MIN_DIFFICULTY, original.difficulty - 1));
}
