import { render } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import MissionMap from "@/components/game/MissionMap";
import { Mission } from "@/types/game";
import React from "react";

// Mock MissionNode to isolate MissionMap performance
vi.mock("@/components/game/MissionNode", () => ({
  default: () => <div data-testid="mission-node" />,
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("MissionMap Performance Benchmark", () => {
  const createMissions = (count: number): Mission[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `mission-${i}`,
      title: `Mission ${i}`,
      type: "addition",
      status: i === 0 ? "active" : "locked",
      description: "Test mission",
      stars: 0,
    }));
  };

  it("benchmarks rendering with many missions", () => {
    const missionCount = 1000;
    const missions = createMissions(missionCount);
    const iterations = 50;

    // Warmup
    render(<MissionMap missions={missions.slice(0, 10)} />);

    const { rerender } = render(<MissionMap missions={missions} />);

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      // Rerender with SAME props to test memoization
      rerender(<MissionMap missions={missions} />);
    }

    const end = performance.now();
    const duration = end - start;
    const avgTime = duration / iterations;

    console.log(`\n--- Benchmark Results ---`);
    console.log(`Total time for ${iterations} renders of ${missionCount} missions: ${duration.toFixed(2)}ms`);
    console.log(`Average time per render: ${avgTime.toFixed(2)}ms`);
    console.log(`-------------------------\n`);

    // Basic assertion to ensure test passes
    expect(duration).toBeGreaterThan(0);
  }, 20000);
});
