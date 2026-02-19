import { useState, useEffect, useCallback } from "react";
import { Mission, MissionStatus } from "@/types/game";

const STORAGE_KEY = "neuromath_mission_progress";

// Initial static definition of missions (structure only)
// Status and stars will be overridden by storage
const INITIAL_MISSIONS: Mission[] = [
    {
        id: "add-1",
        title: "Addition Basics",
        type: "addition",
        status: "active",
        description: "Start your journey with simple sums.",
        stars: 0,
        initialLevel: 1,
        iconType: "star"
    },
    {
        id: "sub-1",
        title: "Subtraction Start",
        type: "subtraction",
        status: "active",
        description: "Learn to take away numbers.",
        stars: 0,
        initialLevel: 1,
        iconType: "star"
    },
    {
        id: "mult-1",
        title: "Multiplication Magic",
        type: "multiplication",
        status: "active",
        description: "Learn to multiply numbers.",
        stars: 0,
        initialLevel: 1,
        iconType: "chest"
    },
    {
        id: "div-1",
        title: "Division Dash",
        type: "division",
        status: "active",
        description: "Divide and conquer!",
        stars: 0,
        initialLevel: 1,
        iconType: "chest"
    },
    {
        id: "frac-1",
        title: "Fraction Fun",
        type: "fraction",
        status: "active",
        description: "Understand parts of a whole.",
        stars: 0,
        initialLevel: 1,
        iconType: "trophy"
    },
    {
        id: "pat-1",
        title: "Pattern Recognition",
        type: "pattern",
        status: "active",
        description: "Spot the sequence!",
        stars: 0,
        initialLevel: 1,
        iconType: "star"
    },
    {
        id: "boss-1",
        title: "Math Master",
        type: "addition", // Boss could be mixed, keeping type valid
        status: "active",
        description: "The ultimate test of your skills!",
        stars: 0,
        initialLevel: 3,
        iconType: "crown"
    }
];

export function useMissionProgress() {
    const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);

    // Load from storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsedProgress = JSON.parse(stored) as Record<string, { status: MissionStatus; stars: number }>;

                setMissions(prev => prev.map(m => {
                    const p = parsedProgress[m.id];
                    if (p) {
                        return { ...m, status: p.status, stars: p.stars };
                    }
                    return m;
                }));
            }
        } catch (e) {
            console.error("Failed to load mission progress", e);
        }
    }, []);

    const saveProgress = useCallback((newMissions: Mission[]) => {
        const progressMap: Record<string, { status: MissionStatus; stars: number }> = {};
        newMissions.forEach(m => {
            progressMap[m.id] = { status: m.status, stars: m.stars };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    }, []);

    const completeMission = useCallback((missionId: string, stars: number) => {
        setMissions(prev => {
            const index = prev.findIndex(m => m.id === missionId);
            if (index === -1) return prev;

            const newMissions = [...prev];
            const current = newMissions[index];

            // Update current mission
            newMissions[index] = {
                ...current,
                status: "completed",
                stars: Math.max(current.stars, stars)
            };

            // Unlock next mission if it exists
            if (index + 1 < newMissions.length) {
                const next = newMissions[index + 1];
                if (next.status === "locked") {
                    newMissions[index + 1] = { ...next, status: "active" };
                }
            }

            saveProgress(newMissions);
            return newMissions;
        });
    }, [saveProgress]);

    return {
        missions,
        completeMission
    };
}
