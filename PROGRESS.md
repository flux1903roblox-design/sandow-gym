# Workout Engine — Progress Log

## Phase 0 — scaffold & reconciliation
- Decided (with user): adapt workout.cool's engine into the existing **Sandow PWA** (Vite + Dexie), not the literal FitStack Expo/Supabase stack.
- Stack mapping recorded in `SPEC-workout-engine.md`. No Supabase/Prisma/RevenueCat in this repo, so those `⚠️ VERIFY` items are N/A; we keep the **flows + data shape** (session → exercises → sets) and the **equipment→muscles** filter semantics.
- Catalog is curated bilingual (he/en) instead of the FR/EN CSV (Hebrew-first app); EN fallback retained.

## Phases 1–4 — DONE (verified end-to-end on the production build)
- **P1 data layer:** `src/data/catalog.ts` (50 bilingual exercises + unions + labels + filter); Dexie v2 `loggedSessions` + repo + `useLoggedSessions`.
- **P2 builder funnel:** `features/workout/BuilderScreen.tsx` — equipment + muscle chips filter the catalog, tap to add/remove, Start. Reached via the "+" quick action and the Workouts tab "Build workout" button.
- **P3 active session:** `stores/activeWorkout.store.ts` (Zustand + localStorage persist) + `features/workout/ActiveWorkoutScreen.tsx` — per-set reps/weight, complete toggles, chronometer derived from `startedAt` (survives reload), rest timer, prev/next, Finish → save to Dexie → clear local state.
- **P4 history/stats:** `features/workout/HistoryScreen.tsx` — list + 112-day contribution heatmap + streak + this-week + total volume.
- **Verified flow:** Build → pick 2 exercises → Start → log 10×50, complete → Finish → 1 `loggedSession` (2 ex, 1 set, volume 500, duration) → History shows it (streak 1, week 1, 500 kg, heatmap). typecheck + RTL lint + build all green.

## Phase 5 — programs / premium (deferred)
- No RevenueCat in the PWA → premium gating is a no-op (all unlocked). Structured programs not built yet.

