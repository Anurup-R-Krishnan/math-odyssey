import { renderHook, act } from '@testing-library/react';
import { useMissionProgress } from './useMissionProgress';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const STORAGE_KEY = "neuromath_mission_progress";

describe('useMissionProgress', () => {
    beforeEach(() => {
        vi.spyOn(Storage.prototype, 'setItem');
        vi.spyOn(Storage.prototype, 'getItem');
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should save progress when a mission is completed', () => {
        const { result } = renderHook(() => useMissionProgress());

        act(() => {
            result.current.completeMission('add-1', 3);
        });

        expect(localStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            expect.stringContaining('"add-1":{"status":"completed","stars":3}')
        );
    });

    it('should unlock the next mission', () => {
        const { result } = renderHook(() => useMissionProgress());

        act(() => {
            result.current.completeMission('add-1', 3);
        });

        const missions = result.current.missions;
        const nextMission = missions.find(m => m.id === 'sub-1');
        expect(nextMission?.status).toBe('active');

        expect(localStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            expect.stringContaining('"sub-1":{"status":"active","stars":0}')
        );
    });
});
