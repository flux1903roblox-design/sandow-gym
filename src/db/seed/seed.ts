import { db, SETTINGS_ID } from '@/db'
import { base, newId } from '@/db/util'
import { DEFAULT_SETTINGS } from '@/db/repositories/settingsRepo'
import { mulberry32, intBetween } from '@/lib/prng'
import { DAY_MS, startOfDayMs, TWO_YEARS_MS } from '@/lib/date'
import type {
  AppNotification,
  ChatMessage,
  ChatThread,
  Exercise,
  FoodScan,
  HealthDeclaration,
  HealthScore,
  MetricSample,
  MetricType,
  Review,
  RoutePoint,
  RouteTrack,
  Trainer,
  User,
  WorkoutProgram,
  WorkoutSession,
} from '@/db/types'

/** Bump to force a full reseed (development mock data only). */
export const SEED_VERSION = 1

const DAYS = 35

export async function seedDatabase(): Promise<void> {
  const existing = await db.settings.get(SETTINGS_ID)
  if (existing?.seedVersion === SEED_VERSION) return

  const rng = mulberry32(20260617)

  await db.transaction('rw', db.tables, async () => {
    // Idempotent: clear everything, then repopulate from scratch.
    await Promise.all(db.tables.map((t) => t.clear()))

    const userId = newId()
    const now = Date.now()
    const todayStart = startOfDayMs(now)

    // --- User ---------------------------------------------------------------
    const user: User = {
      ...base(),
      id: userId,
      displayName: 'Makise Kurisu',
      locale: 'he',
      membershipTier: 'pro',
      location: 'Tokyo, Japan',
      age: 28,
      heightCm: 176,
      weightKg: 92.3,
      goal: 'build-strength',
      sandowScore: 95,
      healthPercent: 88,
      bmi: 29.8,
      weeklyScores: [72, 81, 68, 90, 84, 95, 88],
    }
    await db.users.put(user)

    // --- Health declaration (approved: all "no") ----------------------------
    const declaration: HealthDeclaration = {
      ...base(),
      userId,
      answers: {
        heartDisease: false,
        chestPain: false,
        dizzinessFainting: false,
        cardiacMedication: false,
        familySuddenDeath: false,
        supervisedExerciseOrPregnancy: false,
      },
      status: 'approved',
      signedName: 'Makise Kurisu',
      submittedAt: now - 30 * DAY_MS,
      expiresAt: now - 30 * DAY_MS + TWO_YEARS_MS,
    }
    await db.healthDeclarations.put(declaration)

    // --- Metric samples: daily rollups for the last DAYS days ---------------
    const samples: MetricSample[] = []
    const mk = (type: MetricType, value: number, unit: string, ts: number, extra?: Partial<MetricSample>) =>
      samples.push({ ...base(), userId, type, value, unit, timestamp: ts, source: 'mock', ...extra })

    for (let d = DAYS - 1; d >= 0; d--) {
      const ts = todayStart - d * DAY_MS + DAY_MS / 2
      const isToday = d === 0
      // Pinned peak day (matches the 1,978 callout on the calorie chart: 1500 + 478).
      const isPeak = d === 4

      mk('steps', isToday ? 2574 : intBetween(rng, 2200, 9200), 'steps', ts)
      mk('calories', isToday ? 318 : isPeak ? 478 : intBetween(rng, 180, 430), 'kcal', ts)
      mk('hydration', isToday ? 781 : intBetween(rng, 900, 2400), 'ml', ts)
      mk('distance', isToday ? 7.5 : Number((intBetween(rng, 12, 95) / 10).toFixed(1)), 'km', ts)
      mk('activeMinutes', isToday ? 25 : intBetween(rng, 12, 78), 'min', ts)
      mk('sleep', intBetween(rng, 62, 94), 'score', ts)
      mk('bpm', isToday ? 72 : intBetween(rng, 64, 82), 'bpm', ts)
      mk('spo2', isToday ? 95 : intBetween(rng, 95, 99), '%', ts)
      mk('weight', Number((92.3 + (intBetween(rng, -8, 8) / 10)).toFixed(1)), 'kg', ts)
    }
    await db.metricSamples.bulkPut(samples)

    // --- Health scores (radar snapshots; a few for prev/next navigation) ----
    const scores: HealthScore[] = [
      { day: 0, score: 88, axes: { sleep: 82, bpm: 76, hydration: 70, strength: 88, agility: 84, endurance: 80 } },
      { day: 7, score: 84, axes: { sleep: 78, bpm: 74, hydration: 66, strength: 83, agility: 80, endurance: 79 } },
      { day: 14, score: 81, axes: { sleep: 75, bpm: 72, hydration: 64, strength: 80, agility: 77, endurance: 76 } },
    ].map((s) => ({
      ...base(),
      userId,
      periodKey: `day:${new Date(todayStart - s.day * DAY_MS).toISOString().slice(0, 10)}`,
      computedAt: todayStart - s.day * DAY_MS,
      score: s.score,
      axes: s.axes,
    }))
    await db.healthScores.bulkPut(scores)

    // --- Trainers + reviews -------------------------------------------------
    const farneseId = newId()
    const azunyanId = newId()
    const mioId = newId()
    const trainers: Trainer[] = [
      {
        ...base(),
        id: farneseId,
        name: 'Farnese Vandimion',
        kind: 'human',
        tags: ['Professional', 'Human'],
        experienceYears: 8,
        clients: 88,
        rating: 4.5,
        bio: 'Farnese has a deep understanding of various workout techniques and tailors each session to match your goals and ability.',
      },
      {
        ...base(),
        id: azunyanId,
        name: 'Azunyan U. Wu',
        kind: 'human',
        tags: ['Strength', 'Human'],
        experienceYears: 6,
        clients: 64,
        rating: 4.7,
        bio: 'Strength specialist focused on progressive overload and clean form.',
      },
      {
        ...base(),
        id: mioId,
        name: 'Mio Honda',
        kind: 'human',
        tags: ['Mobility', 'Human'],
        experienceYears: 5,
        clients: 51,
        rating: 4.8,
        bio: 'Mobility and recovery coach. Helps you move better and stay injury-free.',
      },
    ]
    await db.trainers.bulkPut(trainers)

    const reviews: Review[] = [
      {
        ...base(),
        trainerId: farneseId,
        authorName: 'Casca Smith',
        rating: 4.5,
        text: 'Farnese has a deep understanding of various workout techniques and tailored each session to match my goals and ability.',
        createdAt: now - 2 * DAY_MS,
      },
      {
        ...base(),
        trainerId: farneseId,
        authorName: 'Guts Berserk',
        rating: 5,
        text: 'Best coach I have worked with. Pushed me hard but always safe.',
        createdAt: now - 6 * DAY_MS,
      },
      {
        ...base(),
        trainerId: azunyanId,
        authorName: 'Yui Hirasawa',
        rating: 4.7,
        text: 'My deadlift went up 20kg in two months. Highly recommend.',
        createdAt: now - 4 * DAY_MS,
      },
    ]
    await db.reviews.bulkPut(reviews)

    // --- Workout programs + exercises ---------------------------------------
    const backId = newId()
    const programs: WorkoutProgram[] = [
      {
        ...base(),
        id: backId,
        title: 'Back Workout',
        category: 'back',
        trainerId: azunyanId,
        intensity: 'intense',
        totalExercises: 25,
        durationMin: 58,
        calories: 254,
        sets: 12,
      },
      {
        ...base(),
        title: 'Upper Strength 2',
        category: 'upper',
        trainerId: farneseId,
        intensity: 'intense',
        totalExercises: 16,
        durationMin: 45,
        calories: 230,
        sets: 8,
        seriesLabel: '8 Series Workout',
      },
      {
        ...base(),
        title: 'Boxing Power',
        category: 'boxing',
        trainerId: farneseId,
        intensity: 'intense',
        totalExercises: 14,
        durationMin: 40,
        calories: 320,
        sets: 10,
      },
      {
        ...base(),
        title: 'Morning Jogging',
        category: 'cardio',
        trainerId: mioId,
        intensity: 'moderate',
        totalExercises: 5,
        durationMin: 35,
        calories: 225,
        sets: 0,
      },
      {
        ...base(),
        title: 'Leg Day',
        category: 'legs',
        trainerId: azunyanId,
        intensity: 'moderate',
        totalExercises: 18,
        durationMin: 50,
        calories: 280,
        sets: 9,
      },
    ]
    await db.workoutPrograms.bulkPut(programs)

    const backExercises: Exercise[] = [
      { name: 'Pull-ups', sets: 4, reps: 10 },
      { name: 'Lat Pulldown', sets: 4, reps: 12 },
      { name: 'Barbell Row', sets: 4, reps: 10 },
      { name: 'Seated Cable Row', sets: 3, reps: 12 },
      { name: 'Deadlift', sets: 4, reps: 6 },
      { name: 'Face Pull', sets: 3, reps: 15 },
    ].map((e, i) => ({ ...base(), programId: backId, order: i, name: e.name, sets: e.sets, reps: e.reps, restSec: 90 }))
    await db.exercises.bulkPut(backExercises)

    // --- Sessions: a completed jog + a tracked route run --------------------
    const jogSession: WorkoutSession = {
      ...base(),
      userId,
      activity: 'Jogging',
      status: 'completed',
      startedAt: now - DAY_MS - 1850_000,
      endedAt: now - DAY_MS,
      totals: { calories: 225, durationSec: 1850, distanceKm: 4.2, avgBpm: 142 },
      followUp: 'Post Jogging Stretch',
    }
    const runSessionId = newId()
    const runSession: WorkoutSession = {
      ...base(),
      id: runSessionId,
      userId,
      activity: 'Outdoor Run',
      status: 'completed',
      startedAt: now - 2 * DAY_MS - 2725_000,
      endedAt: now - 2 * DAY_MS,
      totals: { calories: 548, durationSec: 2725, distanceKm: 1.25, avgBpm: 79 },
    }
    await db.workoutSessions.bulkPut([jogSession, runSession])

    // Route polyline near Tokyo, deterministic jitter.
    const points: RoutePoint[] = []
    let lat = 35.6618
    let lng = 139.7041
    for (let i = 0; i < 28; i++) {
      lat += (intBetween(rng, -6, 10) / 10000)
      lng += (intBetween(rng, -4, 12) / 10000)
      points.push({ lat, lng, t: runSession.startedAt + i * 90_000 })
    }
    const route: RouteTrack = {
      ...base(),
      sessionId: runSessionId,
      points,
      distanceKm: 1.25,
      durationSec: 2725,
      calories: 548,
      avgBpm: 79,
    }
    await db.routes.put(route)

    // --- AI coach chat ------------------------------------------------------
    const threadId = newId()
    const thread: ChatThread = {
      ...base(),
      id: threadId,
      agentId: 'sandow-ai',
      agentName: 'Coach Sandow.AI',
      model: 'GPT-6',
      chatsLeft: 251,
    }
    await db.chatThreads.put(thread)

    const waveform = Array.from({ length: 42 }, () => intBetween(rng, 18, 100) / 100)
    const baseTs = now - 60 * 60 * 1000
    const messages: ChatMessage[] = [
      { role: 'assistant', kind: 'text', text: 'Good evening, Makise! Ready to plan this week’s training?', read: true, t: 0 },
      { role: 'user', kind: 'text', text: 'Yes. I want to focus on back and core.', read: true, t: 60 },
      { role: 'assistant', kind: 'voice', audioDurationSec: 1495, waveform, read: false, t: 120 },
      { role: 'assistant', kind: 'text', text: 'I’ve queued a 3-day split. Tap start whenever you’re ready.', read: false, t: 130 },
    ].map((m) => ({
      ...base(),
      threadId,
      role: m.role as ChatMessage['role'],
      kind: m.kind as ChatMessage['kind'],
      text: m.text,
      audioDurationSec: m.audioDurationSec,
      waveform: m.kind === 'voice' ? waveform : undefined,
      read: m.read,
      createdAt: baseTs + m.t * 1000,
    }))
    await db.chatMessages.bulkPut(messages)

    // --- Food scans ---------------------------------------------------------
    const foodScans: FoodScan[] = [
      {
        ...base(),
        userId,
        detectedName: 'Fresh Orange',
        calories: 62,
        macros: { protein: 1, carbs: 15, fat: 0 },
        scannedAt: now - 3 * 60 * 60 * 1000,
        source: 'mock',
      },
      {
        ...base(),
        userId,
        detectedName: 'Grilled Chicken Salad',
        calories: 340,
        macros: { protein: 38, carbs: 12, fat: 16 },
        scannedAt: now - 26 * 60 * 60 * 1000,
        source: 'mock',
      },
    ]
    await db.foodScans.bulkPut(foodScans)

    // --- Notifications ------------------------------------------------------
    const notifications: AppNotification[] = [
      { kind: 'workout', title: 'Back Workout is ready', body: 'Azunyan queued your 25-exercise session.', read: false, t: 1 },
      { kind: 'hydration', title: 'Hydration reminder', body: 'You’re 1.7L away from today’s goal.', read: false, t: 3 },
      { kind: 'coach', title: 'Coach Sandow.AI', body: 'Sent you a new voice note.', read: false, t: 5 },
      { kind: 'achievement', title: 'New personal best!', body: 'Sandow Score reached 95.', read: true, t: 30 },
    ].map((n) => ({
      ...base(),
      userId,
      kind: n.kind as AppNotification['kind'],
      title: n.title,
      body: n.body,
      read: n.read,
      createdAt: now - n.t * 60 * 60 * 1000,
    }))
    await db.notifications.bulkPut(notifications)

    // --- Settings (fully onboarded demo; onboarding still reachable from Settings) ---
    await db.settings.put({
      ...DEFAULT_SETTINGS,
      seedVersion: SEED_VERSION,
      onboardingComplete: true,
      storagePersisted: existing?.storagePersisted ?? false,
    })
  })
}
