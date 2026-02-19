import { describe, it, expect } from "vitest";
import { getHintForAttempt, getRevealMessage, shouldRevealAnswer } from "@/data/hints";

describe("Hint Engine", () => {
  describe("getHintForAttempt", () => {
    it("returns hint1 on first incorrect attempt for addition", () => {
      const hint = getHintForAttempt("addition", 1);
      expect(hint).toBe("Try grouping into fives.");
    });

    it("returns hint2 on second incorrect attempt for addition", () => {
      const hint = getHintForAttempt("addition", 2);
      expect(hint).toBe("Count groups: see the grouping animation for the operands.");
    });

    it("returns null on third attempt (reveal trigger)", () => {
      const hint = getHintForAttempt("addition", 3);
      expect(hint).toBeNull();
    });

    it("returns hint1 for subtraction on first attempt", () => {
      const hint = getHintForAttempt("subtraction", 1);
      expect(hint).toBe("Start with the bigger group; remove the smaller group.");
    });

    it("returns hint2 for subtraction on second attempt", () => {
      const hint = getHintForAttempt("subtraction", 2);
      expect(hint).toBe("See the removed items fade out.");
    });

    it("returns hint1 for pattern on first attempt", () => {
      const hint = getHintForAttempt("pattern", 1);
      expect(hint).toBe("Look at the color sequence.");
    });

    it("returns hint2 for pattern on second attempt", () => {
      const hint = getHintForAttempt("pattern", 2);
      expect(hint).toBe("Which color repeats after two steps?");
    });

    it("returns null for attempt numbers beyond 3", () => {
      expect(getHintForAttempt("addition", 4)).toBeNull();
      expect(getHintForAttempt("addition", 10)).toBeNull();
    });
  });

  describe("getRevealMessage", () => {
    it("returns correct reveal message for addition", () => {
      expect(getRevealMessage("addition")).toBe(
        "Let's see how the groups come together."
      );
    });

    it("returns correct reveal message for subtraction", () => {
      expect(getRevealMessage("subtraction")).toBe(
        "Watch the items being taken away one by one."
      );
    });

    it("returns correct reveal message for pattern", () => {
      expect(getRevealMessage("pattern")).toBe(
        "Follow along as the pattern plays out."
      );
    });
  });

  describe("shouldRevealAnswer", () => {
    it("returns false for attempt 1", () => {
      expect(shouldRevealAnswer(1)).toBe(false);
    });

    it("returns false for attempt 2", () => {
      expect(shouldRevealAnswer(2)).toBe(false);
    });

    it("returns true for attempt 3", () => {
      expect(shouldRevealAnswer(3)).toBe(true);
    });

    it("returns true for attempts beyond 3", () => {
      expect(shouldRevealAnswer(4)).toBe(true);
      expect(shouldRevealAnswer(10)).toBe(true);
    });
  });
});
