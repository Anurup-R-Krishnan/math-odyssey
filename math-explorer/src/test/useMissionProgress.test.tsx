import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useMissionProgress } from "../hooks/useMissionProgress";
import { MissionStatus } from "../types/game";

const STORAGE_KEY = "neuromath_mission_progress";

describe("useMissionProgress", () => {
    let store: Record<string, string> = {};

    beforeEach(() => {
        store = {};
        vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
            return store[key] || null;
        });
        vi.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => {
            store[key] = value.toString();
        });
        vi.spyOn(Storage.prototype, "removeItem").mockImplementation((key) => {
            delete store[key];
        });
        vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {
            store = {};
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should initialize with default missions when storage is empty", () => {
        const { result } = renderHook(() => useMissionProgress());

        expect(result.current.missions).toBeDefined();
        expect(result.current.missions.length).toBeGreaterThan(0);
        // Verify structure
        expect(result.current.missions[0].status).toBe("active");
        expect(result.current.missions[0].stars).toBe(0);
    });

    it("should load progress from localStorage on mount", () => {
        // Setup initial storage state
        const storedProgress = {
            "add-1": { status: "completed" as MissionStatus, stars: 3 },
            "sub-1": { status: "active" as MissionStatus, stars: 1 }
        };
        store[STORAGE_KEY] = JSON.stringify(storedProgress);

        const { result } = renderHook(() => useMissionProgress());

        // Verify loaded state
        const addMission = result.current.missions.find(m => m.id === "add-1");
        const subMission = result.current.missions.find(m => m.id === "sub-1");

        expect(addMission).toBeDefined();
        expect(addMission?.status).toBe("completed");
        expect(addMission?.stars).toBe(3);

        expect(subMission).toBeDefined();
        expect(subMission?.status).toBe("active");
        expect(subMission?.stars).toBe(1);
    });

    it("should update mission progress and save to localStorage when completing a mission", () => {
        const { result } = renderHook(() => useMissionProgress());

        act(() => {
            result.current.completeMission("add-1", 2);
        });

        // Verify state update
        const addMission = result.current.missions.find(m => m.id === "add-1");
        expect(addMission?.status).toBe("completed");
        expect(addMission?.stars).toBe(2);

        // Verify localStorage update
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            expect.any(String)
        );

        // Verify content of localStorage
        const stored = JSON.parse(store[STORAGE_KEY]);
        expect(stored["add-1"]).toEqual({ status: "completed", stars: 2 });
    });

    it("should not overwrite higher stars with lower stars", () => {
        const { result } = renderHook(() => useMissionProgress());

        // First completion with 3 stars
        act(() => {
            result.current.completeMission("add-1", 3);
        });

        // Second completion with 1 star
        act(() => {
            result.current.completeMission("add-1", 1);
        });

        const addMission = result.current.missions.find(m => m.id === "add-1");
        expect(addMission?.stars).toBe(3);
    });

    it("should unlock the next mission when completing the current one", () => {
        // We need to simulate a state where the next mission is locked.
        // Since initial state has all active, we'll preload storage with a locked mission.
        // "add-1" is index 0, "sub-1" is index 1.

        const storedProgress = {
            "add-1": { status: "active" as MissionStatus, stars: 0 },
            "sub-1": { status: "locked" as MissionStatus, stars: 0 }
        };
        store[STORAGE_KEY] = JSON.stringify(storedProgress);

        const { result } = renderHook(() => useMissionProgress());

        // Verify initial state from storage
        const initialSubMission = result.current.missions.find(m => m.id === "sub-1");
        expect(initialSubMission?.status).toBe("locked");

        // Complete add-1
        act(() => {
            result.current.completeMission("add-1", 3);
        });

        // Verify sub-1 is unlocked
        const updatedSubMission = result.current.missions.find(m => m.id === "sub-1");
        expect(updatedSubMission?.status).toBe("active");
    });
});
