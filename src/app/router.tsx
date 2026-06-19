import { createHashRouter, redirect } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { TabShell } from '@/components/layout/TabShell'
import { Placeholder } from '@/components/layout/Placeholder'
import { rootLoader } from './guards'

import HomeScreen from '@/features/home/HomeScreen'
import HealthScoreScreen from '@/features/health-score/HealthScoreScreen'
import BmiScreen from '@/features/bmi/BmiScreen'
import ActivityScreen from '@/features/activity/ActivityScreen'
import CalorieScreen from '@/features/activity/CalorieScreen'
import HydrationScreen from '@/features/activity/HydrationScreen'
import WorkoutsScreen from '@/features/workouts/WorkoutsScreen'
import ProgramDetailScreen from '@/features/workouts/ProgramDetailScreen'
import TrainersScreen from '@/features/trainers/TrainersScreen'
import TrainerProfileScreen from '@/features/trainers/TrainerProfileScreen'
import LiveSessionScreen from '@/features/session/LiveSessionScreen'
import SummaryScreen from '@/features/session/SummaryScreen'
import CoachScreen from '@/features/coach/CoachScreen'
import FoodScanScreen from '@/features/scan/FoodScanScreen'
import FoodResultScreen from '@/features/scan/FoodResultScreen'
import RouteScreen from '@/features/route/RouteScreen'
import ProfileScreen from '@/features/profile/ProfileScreen'
import SettingsScreen from '@/features/settings/SettingsScreen'
import NotificationsScreen from '@/features/notifications/NotificationsScreen'
import OnboardingScreen from '@/features/onboarding/OnboardingScreen'
import BuilderScreen from '@/features/workout/BuilderScreen'
import ActiveWorkoutScreen from '@/features/workout/ActiveWorkoutScreen'
import HistoryScreen from '@/features/workout/HistoryScreen'
import PlanDetailScreen from '@/features/workout/PlanDetailScreen'

// Screens are swapped in from Placeholder as each phase lands.
// HashRouter keeps client-side routing working on static hosts (e.g. GitHub Pages
// project sites) with no server-side SPA fallback needed.
export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    loader: rootLoader,
    children: [
      { index: true, loader: () => redirect('/home') },
      {
        element: <TabShell />,
        children: [
          { path: 'home', element: <HomeScreen /> },
          { path: 'workouts', element: <WorkoutsScreen /> },
          { path: 'coach', element: <CoachScreen /> },
          { path: 'profile', element: <ProfileScreen /> },
          { path: 'health-score', element: <HealthScoreScreen /> },
          { path: 'bmi', element: <BmiScreen /> },
          { path: 'activity', element: <ActivityScreen /> },
          { path: 'activity/calorie', element: <CalorieScreen /> },
          { path: 'activity/hydration', element: <HydrationScreen /> },
          { path: 'trainers', element: <TrainersScreen /> },
          { path: 'trainers/:id', element: <TrainerProfileScreen /> },
          { path: 'notifications', element: <NotificationsScreen /> },
          { path: 'settings', element: <SettingsScreen /> },
        ],
      },
      // Full-screen routes (no tab bar):
      { path: 'workouts/:id', element: <ProgramDetailScreen /> },
      { path: 'workout/build', element: <BuilderScreen /> },
      { path: 'workout/active', element: <ActiveWorkoutScreen /> },
      { path: 'workout/history', element: <HistoryScreen /> },
      { path: 'workout/plan/:id', element: <PlanDetailScreen /> },
      { path: 'session/live', element: <LiveSessionScreen /> },
      { path: 'session/:id/summary', element: <SummaryScreen /> },
      { path: 'scan', element: <FoodScanScreen /> },
      { path: 'scan/result', element: <FoodResultScreen /> },
      { path: 'route', element: <RouteScreen /> },
    ],
  },
  { path: '/onboarding/*', element: <OnboardingScreen /> },
  { path: '*', element: <Placeholder title="404" /> },
])
