import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MultipleChoiceInput } from "@/components/game/MultipleChoiceInput";

describe("MultipleChoiceInput", () => {
  const mockOptions = [5, 10, 15, 20];
  const mockOnSelect = vi.fn();

  it("renders all options", () => {
    render(
      <MultipleChoiceInput
        options={mockOptions}
        selectedOption={null}
        correctAnswer={10}
        isCorrect={false}
        onSelect={mockOnSelect}
      />
    );

    mockOptions.forEach((opt) => {
      expect(screen.getByText(String(opt))).toBeInTheDocument();
    });
  });

  it("calls onSelect when option is clicked", () => {
    render(
      <MultipleChoiceInput
        options={mockOptions}
        selectedOption={null}
        correctAnswer={10}
        isCorrect={false}
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByText("10"));
    expect(mockOnSelect).toHaveBeenCalledWith(10);
  });

  it("shows correct styling when answer is correct", () => {
    render(
      <MultipleChoiceInput
        options={mockOptions}
        selectedOption={10}
        correctAnswer={10}
        isCorrect={true}
        onSelect={mockOnSelect}
      />
    );

    const correctBtn = screen.getByText("10").closest("button");
    expect(correctBtn?.className).toContain("animate-correct-glow");
  });

  it("shows error styling when answer is wrong", () => {
    render(
      <MultipleChoiceInput
        options={mockOptions}
        selectedOption={5}
        correctAnswer={10}
        isCorrect={false}
        onSelect={mockOnSelect}
      />
    );

    const wrongBtn = screen.getByText("5").closest("button");
    expect(wrongBtn?.className).toContain("animate-shake");
  });
});
