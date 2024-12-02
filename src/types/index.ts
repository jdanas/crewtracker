export interface HealthData {
  heartRate: number;
  steps: number;
  sleepHours: number;
  lastUpdated: Date;
}

export interface MentalHealthSurvey {
  id: string;
  stress: number;
  mood: number;
  notes: string;
  timestamp: Date;
}

export interface Shift {
  id: string;
  startTime: Date;
  endTime: Date;
  crewMemberId: string;
  role: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  healthData?: HealthData;
  surveys?: MentalHealthSurvey[];
}