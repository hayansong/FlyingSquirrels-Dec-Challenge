export type ChallengeId = 'C1' | 'C2' | 'C3';

export interface Challenge {
  id: ChallengeId;
  title: string;
  target: number;
  unit: string;
  description: string;
  trophy: string;
  bigValue: string;
}

export interface Activity {
  id: string;
  date: string;
  value: number;
  note?: string;
  timestamp: number;
}

export interface UserData {
  id: string; // Unique ID for multi-user support
  name: string;
  challengeId: ChallengeId | null;
  activities: Activity[];
  friends: string[]; // List of IDs of friends
}

// Helper to define the "Database" structure in LocalStorage
export type UserDatabase = Record<string, UserData>;

export const CHALLENGES: Record<ChallengeId, Challenge> = {
  C1: {
    id: 'C1',
    title: 'The Marathoner',
    target: 120,
    unit: 'km',
    description: 'Target: 120 km',
    trophy: '🥇 Real Flying Squirrel',
    bigValue: '120'
  },
  C2: {
    id: 'C2',
    title: 'The Steady Pacer',
    target: 50,
    unit: 'km',
    description: 'Target: 50 km',
    trophy: '🥈 Weekend Warrior',
    bigValue: '50'
  },
  C3: {
    id: 'C3',
    title: 'The Disciplined',
    target: 4,
    unit: 'runs',
    description: 'Target: 4 runs/workouts',
    trophy: '🥉 Consistency King',
    bigValue: '4'
  }
};