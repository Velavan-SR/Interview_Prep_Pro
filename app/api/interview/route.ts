import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, addMessageToSession } from '@/lib/db/operations';
import { createInterviewChain } from '@/lib/ai/chain';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

// POST /api/interview - Handle interview messages
export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, role, level } = await request.json();

    // Validate input
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get session from database
    const session = await getSessionById(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Add user message to session
    await addMessageToSession(sessionId, {
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Create LangChain model
    const { model, systemPrompt } = createInterviewChain(
      role || session.role,
      level || session.level
    );

    // Build message history for context
    const messages = [
      new SystemMessage(systemPrompt),
      ...session.messages.map(msg => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content);
        } else {
          return new AIMessage(msg.content);
        }
      }),
      new HumanMessage(message),
    ];

    // Generate AI response
    const aiResponse = await model.invoke(messages);
    const aiMessage = aiResponse.content as string;

    // Add AI response to session
    await addMessageToSession(sessionId, {
      role: 'assistant',
      content: aiMessage,
      timestamp: new Date(),
    });

    return NextResponse.json({
      response: aiMessage,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'Failed to process interview message' },
      { status: 500 }
    );
  }
}

// GET /api/interview?sessionId=xxx - Get interview session details
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Fetch session from MongoDB
    const session = await getSessionById(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sessionId: session._id.toString(),
      role: session.role,
      level: session.level,
      messages: session.messages,
      status: session.status,
      createdAt: session.createdAt,
      evaluation: session.evaluation,
    });
  } catch (error) {
    console.error('Get interview session error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
