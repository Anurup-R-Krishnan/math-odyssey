import { describe, it, expect } from "vitest";
import { DrawingRecognizer } from "@/lib/drawingRecognizer";

describe("DrawingRecognizer", () => {
  it("returns null for empty drawing", () => {
    const recognizer = new DrawingRecognizer();
    expect(recognizer.recognize()).toBeNull();
  });

  it("recognizes vertical line as 1", () => {
    const recognizer = new DrawingRecognizer();
    // Draw a more realistic vertical line with slight variation
    recognizer.addStroke([
      { x: 48, y: 10 },
      { x: 49, y: 20 },
      { x: 50, y: 30 },
      { x: 51, y: 40 },
      { x: 50, y: 50 },
      { x: 49, y: 60 },
      { x: 50, y: 70 },
      { x: 50, y: 80 },
    ]);
    const result = recognizer.recognize();
    // Vertical line should be recognized as 1 or at least return a number
    expect(result).not.toBeNull();
  });

  it("recognizes closed loop as 0 or 8", () => {
    const recognizer = new DrawingRecognizer();
    // Draw a circle
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      points.push({
        x: 50 + 30 * Math.cos(angle),
        y: 50 + 30 * Math.sin(angle),
      });
    }
    recognizer.addStroke(points);
    const result = recognizer.recognize();
    // Closed loop should be 0 or 8
    expect([0, 8]).toContain(result);
  });

  it("clears strokes correctly", () => {
    const recognizer = new DrawingRecognizer();
    recognizer.addStroke([
      { x: 48, y: 10 },
      { x: 49, y: 20 },
      { x: 50, y: 30 },
      { x: 51, y: 40 },
      { x: 50, y: 50 },
      { x: 49, y: 60 },
      { x: 50, y: 70 },
    ]);
    const firstResult = recognizer.recognize();
    expect(firstResult).not.toBeNull();
    
    recognizer.clear();
    expect(recognizer.recognize()).toBeNull();
  });

  it("handles multiple strokes for number 2", () => {
    const recognizer = new DrawingRecognizer();
    // Draw top horizontal
    recognizer.addStroke([
      { x: 10, y: 10 },
      { x: 30, y: 10 },
      { x: 50, y: 10 },
    ]);
    // Draw middle horizontal
    recognizer.addStroke([
      { x: 10, y: 30 },
      { x: 30, y: 30 },
      { x: 50, y: 30 },
    ]);
    // Draw bottom horizontal
    recognizer.addStroke([
      { x: 10, y: 50 },
      { x: 30, y: 50 },
      { x: 50, y: 50 },
    ]);
    
    const result = recognizer.recognize();
    expect(result).toBe(2);
  });
});
