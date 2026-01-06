import mongoose, { Schema, Document, Model } from 'mongoose';

// ==================== User Model ====================

export interface IUser extends Document {
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
UserSchema.index({ email: 1 });

export const User: Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// ==================== Interview Session Model ====================

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IEvaluation {
  technicalDepth: number;  // 0-10
  clarity: number;         // 0-10
  confidence: number;      // 0-10
  overallScore: number;    // 0-10
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
}

export interface IPerformanceMetric {
  questionNumber: number;
  technicalDepth: number;
  clarity: number;
  confidence: number;
  timestamp: Date;
}

export interface IInterviewSession extends Document {
  userId: string;
  role: string;
  level: 'junior' | 'mid' | 'senior';
  messages: IMessage[];
  evaluation?: IEvaluation;
  status: 'active' | 'completed' | 'abandoned';
  currentDifficulty: number; // 1-10 scale, dynamically adjusted
  performanceHistory: IPerformanceMetric[]; // Track performance over time
  createdAt: Date;
  endedAt?: Date;
  duration?: number; // in minutes
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const EvaluationSchema = new Schema<IEvaluation>(
  {
    technicalDepth: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    clarity: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    feedback: String,
    strengths: [String],
    improvements: [String],
  },
  { _id: false }
);

const PerformanceMetricSchema = new Schema<IPerformanceMetric>(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    technicalDepth: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    clarity: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['junior', 'mid', 'senior'],
      required: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    evaluation: {
      type: EvaluationSchema,
      default: undefined,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    currentDifficulty: {
      type: Number,
      min: 1,
      max: 10,
      default: 5, // Start at medium difficulty
    },
    performanceHistory: {
      type: [PerformanceMetricSchema],
      default: [],
    },
    endedAt: {
      type: Date,
      default: undefined,
    },
    duration: {
      type: Number,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
InterviewSessionSchema.index({ userId: 1, createdAt: -1 });
InterviewSessionSchema.index({ status: 1 });

export const InterviewSession: Model<IInterviewSession> = 
  mongoose.models.InterviewSession || 
  mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);
