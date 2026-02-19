import { useState, useEffect, useCallback } from "react";
import { Mission, MissionStatus } from "@/types/game";

const STORAGE_KEY = "neuromath_mission_progress";

// Initial static definition of missions (structure only)
// Status and stars will be overridden by storage
const INITIAL_MISSIONS: Mission[] = [
    {
        id: "addition-1",
        title: "Addition Basics",
        type: "addition",
        // First mission is always active if nothing stored
        status: "active",
        description: "Learn to add single digit numbers.",
        stars: 0,
    },
    {
        id: "addition-2",
        title: "More Addition",
        type: "addition",
        status: "locked",
        description: "Add numbers up to 20.",
        stars: 0,
    },
    {
        id: "subtraction-1",
        title: "Subtraction Start",
        type: "subtraction",
        status: "locked",
        description: "Take away numbers from 10.",
        stars: 0,
    },
    {
        id: "subtraction-2",
        title: "Subtraction Pro",
        type: "subtraction",
        status: "locked",
        description: "Complex subtraction problems.",
        stars: 0,
    },
    {
        id: "pattern-1",
        title: "Pattern Recognition",
        type: "pattern",
        status: "locked",
        description: "Find the next shape or number.",
        stars: 0,
    },
    {
        id: "pattern-2",
        title: "Advanced Patterns",
        type: "pattern",
        status: "locked",
        description: "Complete complex number sequences.",
        stars: 0,
    },
    {
        id: "boss-1",
        title: "Math Master",
        type: "addition",
        status: "locked",
        description: "Prove your skills in the final challenge!",
        stars: 0,
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
