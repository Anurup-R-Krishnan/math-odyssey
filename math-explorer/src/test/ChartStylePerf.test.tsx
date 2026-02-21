import { render, cleanup } from "@testing-library/react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import React from "react";
import { vi } from "vitest";

// Mock Recharts to avoid ResizeObserver issues and rendering overhead
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: () => null,
  Legend: () => null,
}));

describe("ChartStyle Performance", () => {
  afterEach(() => {
    cleanup();
    // Verify cleanup
    expect(document.querySelectorAll("style").length).toBe(0);
  });

  it("deduplicates styles for same config", () => {
    const config: ChartConfig = {
      desktop: {
        color: "#2563eb",
      },
    };

    render(
      <>
        {Array.from({ length: 100 }).map((_, i) => (
          <ChartContainer key={i} config={config}>
            <div>Chart {i}</div>
          </ChartContainer>
        ))}
      </>
    );

    const styles = document.querySelectorAll("style");
    console.log(`Found ${styles.length} style tags for same config`);
    expect(styles.length).toBe(1);

    // Check selector contains hash (starts with h)
    const styleContent = styles[0].innerHTML;
    // The hash starts with 'h'
    expect(styleContent).toMatch(/\[data-chart=chart-h[0-9a-f]+\]/);
  });

  it("generates different styles for different configs", () => {
     const config1: ChartConfig = { desktop: { color: "#000000" } };
     const config2: ChartConfig = { desktop: { color: "#ffffff" } };

     render(
       <>
         <ChartContainer config={config1}><div>1</div></ChartContainer>
         <ChartContainer config={config2}><div>2</div></ChartContainer>
       </>
     );

     const styles = document.querySelectorAll("style");
     console.log(`Found ${styles.length} style tags for different configs`);
     expect(styles.length).toBe(2);
  });

  it("respects custom id prop (isolates styles)", () => {
    const config: ChartConfig = { desktop: { color: "#2563eb" } };

    render(
      <>
        <ChartContainer config={config} id="custom-1"><div>1</div></ChartContainer>
        <ChartContainer config={config} id="custom-2"><div>2</div></ChartContainer>
      </>
    );

    const styles = document.querySelectorAll("style");
    console.log(`Found ${styles.length} style tags for custom IDs`);
    expect(styles.length).toBe(2);

    const content = Array.from(styles).map(s => s.innerHTML).join("\n");
    expect(content).toContain("[data-chart=chart-custom-1]");
    expect(content).toContain("[data-chart=chart-custom-2]");
  });
});
