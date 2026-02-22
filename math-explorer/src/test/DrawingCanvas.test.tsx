import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DrawingCanvas } from "@/components/game/DrawingCanvas";

// Mock canvas context
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    strokeStyle: "",
    lineWidth: 0,
    lineCap: "",
    lineJoin: "",
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    clearRect: vi.fn(),
  })) as any;
});

describe("DrawingCanvas", () => {
  it("renders canvas with placeholder text", () => {
    render(<DrawingCanvas onSubmit={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("Draw your answer here")).toBeInTheDocument();
  });

  it("submit button is disabled when canvas is empty", () => {
    render(<DrawingCanvas onSubmit={vi.fn()} onClear={vi.fn()} />);
    const submitBtn = screen.getByText("Submit Drawing");
    expect(submitBtn).toBeDisabled();
  });

  it("renders clear and submit buttons", () => {
    render(<DrawingCanvas onSubmit={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("Clear")).toBeInTheDocument();
    expect(screen.getByText("Submit Drawing")).toBeInTheDocument();
  });

  it("shows correct feedback styling when isCorrect is true", () => {
    render(<DrawingCanvas onSubmit={vi.fn()} onClear={vi.fn()} isCorrect={true} showFeedback={true} />);
    const canvas = screen.getByLabelText("Drawing canvas for answer");
    expect(canvas.className).toContain("border-secondary");
  });

  it("shows error feedback styling when isCorrect is false", () => {
    render(<DrawingCanvas onSubmit={vi.fn()} onClear={vi.fn()} isCorrect={false} showFeedback={true} />);
    const canvas = screen.getByLabelText("Drawing canvas for answer");
    expect(canvas.className).toContain("border-destructive");
  });
});
