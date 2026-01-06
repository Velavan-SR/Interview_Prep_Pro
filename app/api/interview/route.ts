import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, addMessageToSession } from '@/lib/db/operations';
import { createInterviewChain, generateAIResponse, analyzeResponseQuality, generateFollowUpQuestion } from '@/lib/ai/chain';
import { createMemory } from '@/lib/ai/memory';
import { calculatePerformanceScore, adjustDifficulty, shouldAskFollowUp } from '@/lib/ai/difficulty';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { IPerformanceMetric } from '@/lib/db/models';
import { connectDB } from '@/lib/db/connection';

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
    await connectDB();
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

    // Get the most recent question (last assistant message)
    const assistantMessages = session.messages.filter(m => m.role === 'assistant');
    const lastQuestion = assistantMessages[assistantMessages.length - 1]?.content || '';

    // Analyze response quality
    const quality = await analyzeResponseQuality(
      message,
      lastQuestion,
      role || session.role
    );

    // Record performance metric
    const performanceMetric: IPerformanceMetric = {
      questionNumber: Math.floor(session.messages.length / 2) + 1,
      technicalDepth: quality.technicalDepth,
      clarity: quality.clarity,
      confidence: quality.confidence,
      timestamp: new Date(),
    };

    // Update session with performance data
    session.performanceHistory.push(performanceMetric);

    // Calculate new difficulty and update session
    const performanceScore = calculatePerformanceScore(session.performanceHistory);
    const newDifficulty = adjustDifficulty(
      session.currentDifficulty || 5,
      performanceScore,
      session.level
    );
    
    session.currentDifficulty = newDifficulty;
    await session.save();

    // Determine if we should ask a follow-up or move to next question
    const shouldFollowUp = shouldAskFollowUp(performanceMetric, session.messages.length);
    
    let aiMessage: string;

    if (shouldFollowUp && quality.technicalDepth < 6) {
      // Generate targeted follow-up for shallow responses
      // Build conversation history for follow-up
      const conversationHistory = session.messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      
      aiMessage = await generateFollowUpQuestion(
        conversationHistory,
        role || session.role,
        level || session.level
      );
    } else {
      // Generate new question or continue conversation
      const { model, systemPrompt } = createInterviewChain(
        role || session.role,
        level || session.level
      );

      // Use intelligent memory management to get relevant context
      const memory = createMemory(3000);
      const relevantMessages = memory.getRelevantMessages(session.messages);

      // Add difficulty hint to system prompt
      const enhancedSystemPrompt = `${systemPrompt}\n\nCurrent difficulty level: ${newDifficulty.toFixed(1)}/10. Adjust question complexity accordingly.`;

      // Build message history for context
      const messages = [
        new SystemMessage(enhancedSystemPrompt),
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
      aiMessage = await generateAIResponse(model, messages, 3);
    }

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
      performance: {
        technicalDepth: quality.technicalDepth,
        clarity: quality.clarity,
        confidence: quality.confidence,
      },
      difficulty: newDifficulty,
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
