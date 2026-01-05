import { connectDB } from './connection';
import { InterviewSession, IInterviewSession, IMessage } from './models';

/**
 * Create a new interview session
 */
export async function createSession(
  userId: string,
  role: string,
  level: 'junior' | 'mid' | 'senior'
): Promise<IInterviewSession> {
  await connectDB();
  
  const session = await InterviewSession.create({
    userId,
    role,
    level,
    messages: [],
    status: 'active',
  });
  
  return session;
}

/**
 * Get a session by ID
 */
export async function getSessionById(sessionId: string): Promise<IInterviewSession | null> {
  await connectDB();
  
  return await InterviewSession.findById(sessionId);
}

/**
 * Add a message to a session
 */
export async function addMessageToSession(
  sessionId: string,
  message: IMessage
): Promise<IInterviewSession | null> {
  await connectDB();
  
  return await InterviewSession.findByIdAndUpdate(
    sessionId,
    { 
      $push: { messages: message },
      $set: { updatedAt: new Date() }
    },
    { new: true }
  );
}

/**
 * End a session and add evaluation
 */
export async function endSession(
  sessionId: string,
  evaluation: {
    technicalDepth: number;
    clarity: number;
    confidence: number;
    overallScore: number;
    feedback?: string;
    strengths?: string[];
    improvements?: string[];
  }
): Promise<IInterviewSession | null> {
  await connectDB();
  
  return await InterviewSession.findByIdAndUpdate(
    sessionId,
    {
      $set: {
        status: 'completed',
        endedAt: new Date(),
        evaluation,
      },
    },
    { new: true }
  );
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(
  userId: string,
  limit: number = 10
): Promise<IInterviewSession[]> {
  await connectDB();
  
  return await InterviewSession.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
}

/**
 * Update session status
 */
export async function updateSessionStatus(
  sessionId: string,
  status: 'active' | 'completed' | 'abandoned'
): Promise<IInterviewSession | null> {
  await connectDB();
  
  return await InterviewSession.findByIdAndUpdate(
    sessionId,
    { $set: { status } },
    { new: true }
  );
}
