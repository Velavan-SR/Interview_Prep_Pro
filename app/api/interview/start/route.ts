import { NextRequest, NextResponse } from 'next/server';
import { createSession, addMessageToSession } from '@/lib/db/operations';
import { getRandomQuestion } from '@/lib/ai/questions';

// POST /api/interview/start - Start a new interview session
export async function POST(request: NextRequest) {
  try {
    const { role, level, userId } = await request.json();

    // Validate input
    if (!role || !level) {
      return NextResponse.json(
        { error: 'Role and level are required' },
        { status: 400 }
      );
    }

    // Validate level
    if (!['junior', 'mid', 'senior'].includes(level)) {
      return NextResponse.json(
        { error: 'Level must be junior, mid, or senior' },
        { status: 400 }
      );
    }

    // Create session in MongoDB
    const session = await createSession(
      userId || 'anonymous',
      role,
      level as 'junior' | 'mid' | 'senior'
    );
    
    // Get a random opening question from the question bank
    const roleKey = role.toLowerCase().replace(/\s+/g, '').replace('developer', '').replace('engineer', '');
    const levelKey = level.toLowerCase().replace('-level', '');
    const openingQuestion = getRandomQuestion(roleKey, levelKey);

    // Add opening question to session messages
    await addMessageToSession(session._id.toString(), {
      role: 'assistant',
      content: openingQuestion,
      timestamp: new Date(),
    });

    const sessionData = {
      sessionId: session._id.toString(),
      role,
      level,
      userId: session.userId,
      openingQuestion,
      createdAt: session.createdAt.toISOString(),
    };

    return NextResponse.json(sessionData);
  } catch (error) {
    console.error('Start interview error:', error);
    return NextResponse.json(
      { error: 'Failed to start interview session' },
      { status: 500 }
    );
  }
}
