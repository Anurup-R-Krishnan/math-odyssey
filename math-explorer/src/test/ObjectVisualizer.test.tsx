import { render, screen } from "@testing-library/react";
import { ObjectVisualizer } from "@/components/game/ObjectVisualizer";
import { describe, it, expect } from "vitest";

describe("ObjectVisualizer", () => {
  it("renders the correct number of items for small counts", () => {
    const count = 10;
    render(<ObjectVisualizer count={count} />);
    // Check if there are 10 items (dots)
    // The dots have aria-hidden="true" but we can select by class or structure
    // Since they are just divs, we can query by container
    const dots = document.querySelectorAll(".rounded-full");
    expect(dots.length).toBe(count);
  });

  it("renders the correct number of items for large counts (optimized path)", () => {
    const count = 100; // Above anticipated threshold
    render(<ObjectVisualizer count={count} />);
    const dots = document.querySelectorAll(".rounded-full");
    expect(dots.length).toBe(count);
  });

  it("applies group spacing correctly", () => {
    const count = 10;
    const groupSize = 5;
    render(<ObjectVisualizer count={count} groupSize={groupSize} />);
    const dots = document.querySelectorAll(".rounded-full");

    // Check that the 6th item (index 5) has the margin class
    // dots[0] is the first item (index 0)
    // dots[5] corresponds to i=5, which is a multiple of groupSize (5)
    // Wait, the logic is: i > 0 && i % groupSize === 0
    // So i=5 should have margin-left
    expect(dots[5].classList.contains("ml-2")).toBe(true);
    expect(dots[1].classList.contains("ml-2")).toBe(false);
  });

  it("handles fadeOut prop", () => {
    const count = 10;
    render(<ObjectVisualizer count={count} fadeOut={true} />);
    // Verification is tricky with framer-motion in JSDOM, but we can try checking styles or attributes
    // Ideally we'd verify the animation prop passed to motion.div, but that requires mocking
    // For now, let's just ensure it renders without error
    const dots = document.querySelectorAll(".rounded-full");
    expect(dots.length).toBe(count);
  });
});
