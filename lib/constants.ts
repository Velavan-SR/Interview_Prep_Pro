// Constants for the application

export const ROLES = {
  NODEJS: { id: 'nodejs', name: 'Node.js Developer', icon: '💚' },
  REACT: { id: 'react', name: 'React Developer', icon: '⚛️' },
  FULLSTACK: { id: 'fullstack', name: 'Full Stack Developer', icon: '🚀' },
  DEVOPS: { id: 'devops', name: 'DevOps Engineer', icon: '⚙️' },
} as const;

export const LEVELS = {
  JUNIOR: { id: 'junior', name: 'Junior', description: '0-2 years experience' },
  MID: { id: 'mid', name: 'Mid-Level', description: '2-5 years experience' },
  SENIOR: { id: 'senior', name: 'Senior', description: '5+ years experience' },
} as const;

export const INTERVIEW_CONFIG = {
  DEFAULT_DURATION: 30, // minutes
  MAX_DURATION: 45,     // minutes
  MIN_DURATION: 10,     // minutes
  QUESTION_COUNT: 10,
} as const;

export const EVALUATION_THRESHOLDS = {
  EXCELLENT: 8.5,
  GOOD: 7.0,
  FAIR: 5.5,
  NEEDS_IMPROVEMENT: 4.0,
} as const;

export const API_ENDPOINTS = {
  INTERVIEW_START: '/api/interview/start',
  INTERVIEW_MESSAGE: '/api/interview',
  INTERVIEW_END: '/api/interview/end',
} as const;
