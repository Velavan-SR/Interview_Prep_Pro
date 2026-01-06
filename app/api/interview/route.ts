import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, addMessageToSession } from '@/lib/db/operations';
import { createInterviewChain, generateAIResponse } from '@/lib/ai/chain';
import { createMemory } from '@/lib/ai/memory';
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

    // Add user message to session first
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

    // Use intelligent memory management to get relevant context
    const memory = createMemory(3000); // ~3000 tokens for context
    const relevantMessages = memory.getRelevantMessages(session.messages);

    // Build message history for context
    const messages = [
      new SystemMessage(systemPrompt),
      ...relevantMessages.map(msg => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content);
        } else {
          return new AIMessage(msg.content);
        }
      }),
      new HumanMessage(message),
    ];

    // Generate AI response with retry logic
    const aiMessage = await generateAIResponse(model, messages, 3);

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
  } catch (error: any) {
    console.error('Interview API error:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to process interview message';
    
    if (error.message?.includes('API key')) {
      errorMessage = 'AI service configuration error. Please contact support.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timeout. Please try again.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Service temporarily busy. Please wait a moment and try again.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
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
