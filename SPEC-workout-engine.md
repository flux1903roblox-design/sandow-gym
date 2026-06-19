# Sandow — Workout Engine (workout.cool parity, adapted to the PWA)

**Source spec:** FitStack (Expo + Supabase + RevenueCat). **This repo:** Sandow — Vite + React + Dexie (IndexedDB), offline-first PWA. We copy workout.cool's **logic, data model, and flows**, not its visual design, and map the stack:

| Spec (FitStack/workout.cool) | Sandow adaptation |
|---|---|
| Postgres tables + enums | Static TS exercise catalog + Dexie `loggedSessions` table |
| Prisma migrations / RLS / RPCs | Local Dexie queries (single-user, per-device) — no server/auth |
| Zustand + AsyncStorage persist | Zustand + `persist` + `localStorage` (web) |
| next-intl | existing `react-i18next` (he default, RTL) |
| CSV import (~1,200 FR/EN exercises) | curated bilingual (he/en) catalog (~50) in `src/data/catalog.ts` |
| RevenueCat Pro gating (Phase 5) | N/A in a free PWA — everything unlocked (documented no-op) |

## Data model (adapted)
- **Catalog** (static, in-memory): `CatalogExercise { id, slug, nameEn, nameHe, primaryMuscle, secondaryMuscles[], equipment, type, mechanics, videoUrl? }`. Attributes are unions (muscle/equipment/type/mechanics), filtered in JS.
- **Logged session** (Dexie `loggedSessions`): `{ id, userId, startedAt, endedAt, durationSeconds, muscles[], exercises: [{ exerciseId, order, sets: [{ setIndex, reps?, weight?, durationSeconds?, completed }] }], totalVolume, totalSets }` — nested doc per session (no normalization needed locally).

## Flows
1. **Builder funnel:** equipment select → muscle select → filtered exercise list (+ shuffle/swap) → start session.
2. **Active session:** Zustand store persisted to localStorage; per-exercise cards, per-set reps/weight, complete toggles, running chronometer (reconciled from `startedAt` on resume), optional rest timer, auto-advance; atomic save to Dexie on finish; persisted state cleared only after save.
3. **History/stats:** history list, contribution heatmap (SVG), streaks, volume + PR analytics from `loggedSessions`. Feeds the existing dashboard.

## Phases
- P1 data layer (catalog + Dexie table + repo + filter) · P2 builder funnel · P3 active session · P4 history/stats · P5 programs (premium = no-op).

See `feature_list.json` for per-feature acceptance and `PROGRESS.md` for the log.
