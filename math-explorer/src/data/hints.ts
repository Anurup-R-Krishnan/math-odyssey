import { HintTemplate, ProblemType } from "@/types/game";

export const hintTemplates: Record<ProblemType, HintTemplate> = {
  addition: {
    type: "addition",
    hint1: "Try grouping into fives.",
    hint2: "Count groups: see the grouping animation for the operands.",
    revealMessage: "Let's see how the groups come together.",
  },
  subtraction: {
    type: "subtraction",
    hint1: "Start with the bigger group; remove the smaller group.",
    hint2: "See the removed items fade out.",
    revealMessage: "Watch the items being taken away one by one.",
  },
  pattern: {
    type: "pattern",
    hint1: "Look at the color sequence.",
    hint2: "Which color repeats after two steps?",
    revealMessage: "Follow along as the pattern plays out.",
  },
};

/**
 * Returns the appropriate hint for the given problem type and attempt number.
 * attempt 1 -> hint1
 * attempt 2 -> hint2
 * attempt >= 3 -> null (trigger reveal)
 */
export function getHintForAttempt(
  type: ProblemType,
  attemptNumber: number
): string | null {
  const template = hintTemplates[type];
  if (!template) return null;

  if (attemptNumber === 1) return template.hint1;
  if (attemptNumber === 2) return template.hint2;
  return null;
}

/**
 * Returns the reveal message for a given problem type.
 */
export function getRevealMessage(type: ProblemType): string {
  return hintTemplates[type]?.revealMessage ?? "Here is the answer.";
}

/**
 * Determines whether the answer reveal animation should trigger.
 */
export function shouldRevealAnswer(attemptNumber: number): boolean {
  return attemptNumber >= 3;
}
