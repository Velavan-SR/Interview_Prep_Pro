// Global type definitions for the application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  level: 'junior' | 'mid' | 'senior';
  messages: Message[];
  evaluation?: Evaluation;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
  endedAt?: Date;
}

export interface Evaluation {
  technicalDepth: number;  // 0-10
  clarity: number;         // 0-10
  confidence: number;      // 0-10
  overallScore: number;    // 0-10
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface InterviewConfig {
  role: string;
  level: 'junior' | 'mid' | 'senior';
  maxDuration: number; // in minutes
  questionCount: number;
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export type RoleType = 'nodejs' | 'react' | 'fullstack' | 'devops';
export type LevelType = 'junior' | 'mid' | 'senior';
