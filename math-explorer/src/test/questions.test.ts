import { describe, it, expect } from "vitest";
import {
  generateAdditionQuestion,
  generateSubtractionQuestion,
  generateMultiplicationQuestion,
  generatePatternQuestion,
  generateMicroPractice,
} from "@/data/questions";

describe("Question Generation", () => {
  describe("generateMultiplicationQuestion", () => {
    it("generates a valid multiplication question", () => {
      const q = generateMultiplicationQuestion(1);
      expect(q.type).toBe("multiplication");
      expect(q.operandA).toBeDefined();
      expect(q.operandB).toBeDefined();
      expect(q.answer).toBe(q.operandA! * q.operandB!);
      expect(q.options).toContain(q.answer);
      expect(q.options.length).toBe(4);
    });

    it("increases range with difficulty", () => {
      // Difficulty 1: 0-5
      const easy = generateMultiplicationQuestion(1);
      expect(easy.operandA).toBeGreaterThanOrEqual(0);
      expect(easy.operandA).toBeLessThanOrEqual(5);
      expect(easy.operandB).toBeGreaterThanOrEqual(0);
      expect(easy.operandB).toBeLessThanOrEqual(5);

      // Difficulty 2: 0-9
      const medium = generateMultiplicationQuestion(2);
      expect(medium.operandA).toBeGreaterThanOrEqual(0);
      expect(medium.operandA).toBeLessThanOrEqual(9);
      expect(medium.operandB).toBeGreaterThanOrEqual(0);
      expect(medium.operandB).toBeLessThanOrEqual(9);

      // Difficulty 3: 1-12
      const hard = generateMultiplicationQuestion(3);
      expect(hard.operandA).toBeGreaterThanOrEqual(1);
      expect(hard.operandA).toBeLessThanOrEqual(12);
      expect(hard.operandB).toBeGreaterThanOrEqual(1);
      expect(hard.operandB).toBeLessThanOrEqual(12);
    });
  });

  describe("generateAdditionQuestion", () => {
    it("generates a valid addition question", () => {
      const q = generateAdditionQuestion(1);
      expect(q.type).toBe("addition");
      expect(q.operandA).toBeDefined();
      expect(q.operandB).toBeDefined();
      expect(q.answer).toBe(q.operandA! + q.operandB!);
      expect(q.options).toContain(q.answer);
      expect(q.options.length).toBe(4);
    });

    it("increases range with difficulty", () => {
      const easy = generateAdditionQuestion(1);
      const hard = generateAdditionQuestion(5);
      // Hard questions can have larger operands
      expect(hard.operandA! + hard.operandB!).toBeLessThanOrEqual(70);
      expect(easy.operandA! + easy.operandB!).toBeGreaterThan(0);
    });
  });

  describe("generateSubtractionQuestion", () => {
    it("generates a valid subtraction question with non-negative answer", () => {
      const q = generateSubtractionQuestion(1);
      expect(q.type).toBe("subtraction");
      expect(q.operandA).toBeGreaterThan(q.operandB!);
      expect(q.answer).toBe(q.operandA! - q.operandB!);
      expect(Number(q.answer)).toBeGreaterThanOrEqual(0);
      expect(q.options).toContain(q.answer);
    });
  });

  describe("generatePatternQuestion", () => {
    it("generates a valid pattern question", () => {
      const q = generatePatternQuestion(1);
      expect(q.type).toBe("pattern");
      expect(q.patternSequence).toBeDefined();
      expect(q.patternSequence!.includes("?")).toBe(true);
      expect(q.options).toContain(q.answer);
      expect(q.options.length).toBe(4);
    });
  });

  describe("generateMicroPractice", () => {
    it("generates a question at reduced difficulty", () => {
      const original = generateAdditionQuestion(3);
      const micro = generateMicroPractice(original);
      expect(micro.type).toBe(original.type);
      expect(micro.difficulty).toBeLessThanOrEqual(original.difficulty);
    });
  });
});
