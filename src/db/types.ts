/**
 * Core data contract. Every layer (repositories, hooks, screens) depends on these types.
 * Conventions:
 *  - IDs are UUID strings (crypto.randomUUID()) — never autoincrement (breaks future multi-device sync).
 *  - Timestamps are epoch milliseconds (easy Dexie indexing + date-fns interop).
 *  - Every persisted row extends BaseEntity, carrying a `syncStatus` placeholder so a future
 *    server delta-sync is non-breaking.
 */

export type Locale = 'he' | 'en'
export type Direction = 'rtl' | 'ltr'
export type SyncStatus = 'local' | 'pending' | 'synced'

export interface BaseEntity {
  id: string
  createdAt: number
  updatedAt: number
  syncStatus?: SyncStatus
}

export type Intensity = 'light' | 'moderate' | 'intense'
export type MembershipTier = 'free' | 'pro'

/** Single table `metricSamples` stores every time-series via `type`. */
export type MetricType =
  | 'steps'
  | 'calories'
  | 'hydration'
  | 'bpm'
  | 'spo2'
  | 'bloodPressure'
  | 'sleep'
  | 'weight'
  | 'distance'
  | 'activeMinutes'
  | 'strength'
  | 'agility'
  | 'endurance'

export type MetricSource = 'mock' | 'manual' | 'healthkit' | 'healthconnect'

export interface MetricSample extends BaseEntity {
  userId: string
  type: MetricType
  timestamp: number
  value: number
  /** e.g. diastolic when type === 'bloodPressure' */
  valueSecondary?: number
  unit: string
  source: MetricSource
}

export interface User extends BaseEntity {
  displayName: string
  avatarUrl?: string
  locale: Locale
  membershipTier: MembershipTier
  location?: string
  age?: number
  heightCm?: number
  weightKg?: number
  goal?: string
  /** Headline numbers shown across the app. */
  sandowScore: number // 95
  healthPercent: number // 88
  bmi: number // 29.8
  /** 7 values for the profile weekly bar chart. */
  weeklyScores: number[]
}

export type DeclarationStatus = 'approved' | 'pending_certificate' | 'rejected'

/** The 6 mandatory Israeli health-declaration questions. */
export interface DeclarationAnswers {
  heartDisease: boolean
  chestPain: boolean
  dizzinessFainting: boolean
  cardiacMedication: boolean
  familySuddenDeath: boolean
  supervisedExerciseOrPregnancy: boolean
}

export interface HealthDeclaration extends BaseEntity {
  userId: string
  answers: DeclarationAnswers
  status: DeclarationStatus
  signedName: string
  certificateFileName?: string
  submittedAt: number
  /** submittedAt + 2 years (regulatory retention). */
  expiresAt: number
}

export interface HealthScoreAxes {
  sleep: number
  bpm: number
  hydration: number
  strength: number
  agility: number
  endurance: number
}

export interface HealthScore extends BaseEntity {
  userId: string
  /** 'day:2026-06-17' | 'week:2026-W25' */
  periodKey: string
  computedAt: number
  score: number // 88
  axes: HealthScoreAxes
}

export interface WorkoutProgram extends BaseEntity {
  title: string // "Back Workout"
  category: string // back | upper | cardio | ...
  trainerId: string
  intensity: Intensity
  totalExercises: number // 25
  durationMin: number
  calories: number
  sets: number
  seriesLabel?: string // "8 Series Workout"
  heroImageUrl?: string
}

export interface Exercise extends BaseEntity {
  programId: string
  name: string
  order: number
  sets?: number
  reps?: number
  durationSec?: number
  restSec?: number
}

export type SessionStatus = 'active' | 'paused' | 'completed'

export interface SessionTotals {
  calories: number
  durationSec: number
  distanceKm?: number
  avgBpm?: number
}

export interface WorkoutSession extends BaseEntity {
  userId: string
  programId?: string
  status: SessionStatus
  activity: string // "Boxing" | "Jogging"
  startedAt: number
  endedAt?: number
  liveBpm?: number
  systolic?: number
  diastolic?: number
  spo2?: number
  totals?: SessionTotals
  followUp?: string // "Post Jogging Stretch"
}

export type TrainerKind = 'human' | 'ai'

export interface Trainer extends BaseEntity {
  name: string // "Farnese Vandimion"
  kind: TrainerKind
  tags: string[] // ["Professional", "Human"]
  experienceYears: number
  clients: number
  rating: number
  avatarUrl?: string
  bio?: string
}

export interface Review extends BaseEntity {
  trainerId: string
  authorName: string
  authorAvatarUrl?: string
  rating: number
  text: string
}

export interface ChatThread extends BaseEntity {
  agentId: string
  agentName: string // "Coach Sandow.AI"
  model: string // "GPT-6"
  chatsLeft: number // 251
}

export type ChatRole = 'user' | 'assistant'
export type MessageKind = 'text' | 'voice'

export interface ChatMessage extends BaseEntity {
  threadId: string
  role: ChatRole
  kind: MessageKind
  text?: string
  audioDurationSec?: number
  /** Bar heights (0..1) for a fake voice waveform. */
  waveform?: number[]
  read?: boolean
}

export interface Macros {
  protein: number
  carbs: number
  fat: number
}

export interface FoodScan extends BaseEntity {
  userId: string
  scannedAt: number
  imageDataUrl?: string
  detectedName: string
  calories: number
  macros: Macros
  source: 'mock' | 'ai'
}

export interface RoutePoint {
  lat: number
  lng: number
  t: number
}

export interface RouteTrack extends BaseEntity {
  sessionId: string
  points: RoutePoint[]
  distanceKm: number
  durationSec: number
  calories: number
  avgBpm: number
}

export type NotificationKind = 'workout' | 'hydration' | 'coach' | 'system' | 'achievement'

export interface AppNotification extends BaseEntity {
  userId: string
  kind: NotificationKind
  title: string
  body: string
  read: boolean
}

export interface AppSettings {
  id: 'app'
  seedVersion: number
  onboardingComplete: boolean
  locale: Locale
  direction: Direction
  units: 'metric' | 'imperial'
  notifications: { workouts: boolean; hydration: boolean; coach: boolean }
  privacy: { shareData: boolean }
  deviceSync: { healthKitEnabled: boolean; healthConnectEnabled: boolean }
  storagePersisted: boolean
}
