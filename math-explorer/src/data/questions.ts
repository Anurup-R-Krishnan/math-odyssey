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
  let a, b;
  // Tiered difficulty
  if (difficulty === 1) {
    // Single digit, sum <= 10
    a = Math.floor(Math.random() * 6); // 0-5
    b = Math.floor(Math.random() * (11 - a)); // so a+b <= 10
  } else if (difficulty === 2) {
    // Single digit, sum 10-18
    a = Math.floor(Math.random() * 10); // 0-9
    b = Math.floor(Math.random() * 10); // 0-9
  } else {
    // Double digit included
    const max = 10 + difficulty * 5;
    a = Math.floor(Math.random() * max) + 1;
    b = Math.floor(Math.random() * max) + 1;
  }

  const answer = a + b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const d = answer + Math.floor(Math.random() * 7) - 3;
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

  if (difficulty === 1) {
    // Minuend up to 10
    a = Math.floor(Math.random() * 10) + 1; // 1-10
    b = Math.floor(Math.random() * a);     // 0 to a-1 (result > 0)
  } else if (difficulty === 2) {
    // Minuend up to 20
    a = Math.floor(Math.random() * 11) + 10; // 10-20
    b = Math.floor(Math.random() * 10);      // single digit subtractor
  } else {
    // Harder
    const max = 15 + difficulty * 5;
    a = Math.floor(Math.random() * max) + 5;
    b = Math.floor(Math.random() * a);
  }

  const answer = a - b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const d = answer + Math.floor(Math.random() * 7) - 3;
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

  if (difficulty === 1) {
    patternType = Math.random() > 0.5 ? "ABAB" : "AABB";
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
    patternSequence: sequence,
    difficulty,
  };
}

export function generateMultiplicationQuestion(difficulty: number): Question {
  let a, b;
  if (difficulty === 1) {
    a = Math.floor(Math.random() * 6); // 0-5
    b = Math.floor(Math.random() * 6); // 0-5
  } else if (difficulty === 2) {
    a = Math.floor(Math.random() * 10); // 0-9
    b = Math.floor(Math.random() * 10); // 0-9
  } else {
    a = Math.floor(Math.random() * 12) + 1; // 1-12
    b = Math.floor(Math.random() * 12) + 1; // 1-12
  }
  const answer = a * b;

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const d = answer + Math.floor(Math.random() * 10) - 5;
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
  if (difficulty === 1) {
    // Simple division, answer < 6
    b = Math.floor(Math.random() * 5) + 1; // 1-5
    answer = Math.floor(Math.random() * 6); // 0-5
    a = answer * b;
  } else {
    // Up to 10
    b = Math.floor(Math.random() * 9) + 1; // 1-9
    answer = Math.floor(Math.random() * 10); // 0-9
    a = answer * b;
  }

  const distractors = new Set<number>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const d = answer + Math.floor(Math.random() * 7) - 3;
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
  const denominator = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1; // Proper fraction

  const answer = `${numerator}/${denominator}`;

  const distractors = new Set<string>();
  distractors.add(answer);
  while (distractors.size < 4) {
    const dDenom = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
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
  return generateQuestion(original.type, Math.max(1, original.difficulty - 1));
}
