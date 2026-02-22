# Math Explorer (NeuroMath Mission Guide)

A browser-only Vite + React + TypeScript experience that wraps a mission narrative, adaptive arithmetic drills, and session logging into a single-page Neurodiversity-friendly learning tool. Every navigation label, animation, and data save is already implemented in `src/` and snapshots the *actual* behavior of the current app.

## Experience overview
- **Mission Map (Home)** presents the missions defined in `hooks/useMissionProgress.ts`. Each mission object (locked/active/completed) carries a description, icon type, and star count that the UI animates through `MissionMap` and the floating Framer Motion accents found in `src/pages/Home.tsx`.
- **Game loop (`src/pages/Game.tsx`)** offers exactly six mission types (addition, subtraction, multiplication, division, fraction, pattern) plus one boss mission. Learners enter a pilot ID, pick a mission, and answer ten sequential questions per run. `generateQuestion` from `src/data/questions` delivers the question payload, `QuestionCard` renders it, and `useGameSession` records each attempt (correct, hint usage, streaks) while adjusting difficulty based on consecutive hits or misses.
- **Dashboard (`src/pages/Dashboard.tsx`)** reads all stored sessions through `useGameSession`. It shows four summary cards (missions, problems solved, correct answers, help used), renders a BarChart for accuracy, and a PieChart for knowledge balance. There is also a CSV export helper that iterates over every `QuestionAttempt` so caregivers can download `neuromath_session_data.csv` directly in-browser.
- **Members + Project pages** are static context: `Members` shows placeholder team cards and lazily imports `@/lib/docGenerator` to build a ZIP, while `ProjectPage` outlines repo setup, advisors, `shadcn/ui` tech badges, and the commands already documented in the UI (`pnpm install`, `pnpm dev`, `pnpm test`, `pnpm build`). Those pages do not fetch remote data.

## State, storage, and persistence
- Missions use localStorage key `neuromath_mission_progress`. The hook initializes `INITIAL_MISSIONS` and hydrates stored `status`/`stars` values on mount, then writes back every time a mission completes via `completeMission`.
- Game sessions live under `neuromath_sessions`. `useGameSession` creates a session ID, tracks difficulty (with consecutive correct/wrong counters), records each `QuestionAttempt`, and writes the finished session list to storage in `endSession()`. The hook also exposes helpers for exporting CSV, retrieving every past session, and resetting the current run.
- The dashboard, mission map, and CSV export all re-read these localStorage blobs so no backend service exists or is required.

## Architecture & routing
- Root routing lives in `src/App.tsx` with `BrowserRouter` inside `AppLayout`. The six main routes are `/` (Home), `/product`, `/game`, `/dashboard`, `/members`, `/project`, and a catch-all `NotFound`.
- UI primitives come from `shadcn/ui` wrappers (`Button`, `Card`, `Input`, `Tooltip`, etc.). Icons are mostly `lucide-react`. Animations rely on `framer-motion`, charts on `recharts`, and state persistence is handled by custom hooks under `src/hooks`.
- All styling is the Tailwind 3 + CSS Modules combination defined in `src/index.css`, `src/App.css`, and `tailwind.config.ts` so the experience remains responsive without extra runtime theming.

## Running the project
1. `pnpm install` (uses this repo’s `pnpm-lock.yaml`).
2. `pnpm dev` — starts Vite dev server on `localhost:5173`.
3. `pnpm build` — production build via `vite build`.
4. `pnpm build:dev` — runs `vite build` with `development` mode.
5. `pnpm preview` — serves the production bundle for local QA.
6. `pnpm test` — executes `vitest run` over `src/test` fixtures.
7. `pnpm lint` — runs `eslint` with the provided config.

## Testing & quality checks
- `src/test` holds the unit tests: they cover session persistence, mission progress logic, question generation, and other helpers.
- Vitest handles automated assertions; there are no visual regression snapshots, so calendar visual checks (mission map animations, floating elements) are manual intercepts during dev.
- `eslint.config.js` plus `@eslint/js`, `typescript-eslint`, and React plugin rules enforce linting.

## Extending the experience
- **Add new drills** by updating `src/data/questions.ts` and allowing `generateQuestion` to handle the new mode string. Each question needs an `id`, `mode`, `difficultyLevel`, `prompt`, `options`, and `correct answer` so the session CSV stays valid.
- **Adjust missions** inside `hooks/useMissionProgress.ts`. `INITIAL_MISSIONS` controls titles, descriptions, icon types, and starting levels; mission unlocking is sequential and derives from this array’s order.
- **Swap out team info** by editing `TEAM_MEMBERS` in `src/pages/Members.tsx` so the download card matches the actual contributors.

## Research evidence (autism & neurodiverse math supports)
1. Abouelenein et al. “Impact of a serious games-based adaptive learning environment on developing communication skills and motivation among autistic children.” *Education and Information Technologies* 30, 24201–24232 (2025). The single-group experiment with 14 children showed adaptive serious games improved communication pathways, mirroring NeuroMath’s mission pacing and star-based feedback. DOI: https://doi.org/10.1007/s10639-025-13728-w.
2. Polydoros & Antoniou. “Empowering students with learning disabilities: Examining serious digital games’ potential for performance and motivation in math education.” *Behavioral Sciences* 15(3):282 (2025). The controlled comparison found digital math games (e.g., “Battleship”) produced superior math performance for learners with disabilities, supporting the ten-question missions in this project. DOI: https://doi.org/10.3390/bs15030282.
3. Carneiro et al. “Serious games for developing social skills in children and adolescents with autism spectrum disorder: A systematic review.” *Healthcare* 12(5):508 (2024). The methodology review ties predictable, gamified environments to gains in emotion recognition and joint attention, which validates the consistent UI and repetition this interface offers. DOI: https://doi.org/10.3390/healthcare12050508.
