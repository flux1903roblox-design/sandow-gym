import Dexie, { type Table } from 'dexie'
import type {
  AppNotification,
  ChatMessage,
  ChatThread,
  Exercise,
  FoodScan,
  HealthDeclaration,
  HealthScore,
  MetricSample,
  Review,
  RouteTrack,
  AppSettings,
  Trainer,
  User,
  WorkoutProgram,
  WorkoutSession,
} from './types'

export class SandowDB extends Dexie {
  users!: Table<User, string>
  healthDeclarations!: Table<HealthDeclaration, string>
  metricSamples!: Table<MetricSample, string>
  healthScores!: Table<HealthScore, string>
  workoutPrograms!: Table<WorkoutProgram, string>
  exercises!: Table<Exercise, string>
  workoutSessions!: Table<WorkoutSession, string>
  trainers!: Table<Trainer, string>
  reviews!: Table<Review, string>
  chatThreads!: Table<ChatThread, string>
  chatMessages!: Table<ChatMessage, string>
  foodScans!: Table<FoodScan, string>
  routes!: Table<RouteTrack, string>
  notifications!: Table<AppNotification, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super('sandow')
    this.version(1).stores({
      users: 'id, locale',
      healthDeclarations: 'id, userId, status, submittedAt, expiresAt',
      metricSamples: 'id, [type+timestamp], type, timestamp, userId',
      healthScores: 'id, periodKey, computedAt',
      workoutPrograms: 'id, category, intensity',
      exercises: 'id, programId, order',
      workoutSessions: 'id, userId, programId, status, startedAt',
      trainers: 'id, rating, kind',
      reviews: 'id, trainerId, rating, createdAt',
      chatThreads: 'id, agentId, updatedAt',
      chatMessages: 'id, threadId, createdAt',
      foodScans: 'id, userId, scannedAt',
      routes: 'id, sessionId',
      notifications: 'id, userId, createdAt',
      settings: 'id',
    })
  }
}

export const db = new SandowDB()

export const SETTINGS_ID = 'app' as const
