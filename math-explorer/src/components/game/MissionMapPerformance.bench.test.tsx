import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MissionMap from './MissionMap';
import { Mission } from '@/types/game';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

const generateMissions = (count: number): Mission[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `mission-${i}`,
    title: `Mission ${i}`,
    type: 'addition',
    status: i === 0 ? 'active' : 'locked',
    description: 'A test mission',
    stars: 0,
    initialLevel: 1,
  }));
};

describe('MissionMap Performance', () => {
  it('renders 1000 missions', () => {
    const missions = generateMissions(1000);
    const start = performance.now();

    render(
      <TooltipProvider>
        <BrowserRouter>
          <MissionMap missions={missions} />
        </BrowserRouter>
      </TooltipProvider>
    );

    const end = performance.now();
    console.log(`Render time for 1000 missions: ${end - start}ms`);

    // Generous timeout to avoid flaky failures, but enough to measure
    expect(end - start).toBeLessThan(10000);
  });
});
