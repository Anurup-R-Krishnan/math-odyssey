import { render } from "@testing-library/react";
import { ObjectVisualizer } from "@/components/game/ObjectVisualizer";
import { describe, it } from "vitest";

describe("ObjectVisualizer Performance", () => {
  it("renders large number of items quickly", () => {
    const count = 500; // Large count to stress test
    const iterations = 10;
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      render(<ObjectVisualizer count={count} />);
      const end = performance.now();
      totalTime += (end - start);
    }

    const averageTime = totalTime / iterations;
    console.log(`Average render time for ${count} items: ${averageTime.toFixed(2)}ms`);
  });
});
