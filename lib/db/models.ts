// Placeholder for MongoDB models
// Will be implemented in Day 1, Hour 2

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface InterviewSession {
  id: string;
  userId: string;
  role: string;
  level: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
  evaluation?: {
    technicalDepth: number;
    clarity: number;
    confidence: number;
  };
  createdAt: Date;
  endedAt?: Date;
}
