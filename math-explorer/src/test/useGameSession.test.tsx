import { renderHook, act } from "@testing-library/react";
import { useGameSession } from "../hooks/useGameSession";
import { describe, it, expect } from "vitest";

describe("useGameSession", () => {
  it("generates a session ID with correct format", () => {
    const { result } = renderHook(() => useGameSession());

    act(() => {
      result.current.startSession("123");
    });

    const session = result.current.session;
    expect(session).not.toBeNull();
    expect(session?.sessionId).toBeDefined();
    expect(session?.sessionId.startsWith("session_")).toBe(true);

    const parts = session?.sessionId.split("_");
    expect(parts?.length).toBe(3);

    // Check if the last part is a UUID (length 36) or old random string (length 5)
    const randomPart = parts![2];
    console.log("Generated random part:", randomPart);

    // UUIDs are 36 characters long
    expect(randomPart.length).toBe(36);
    // UUIDs should match the standard regex
    expect(randomPart).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
