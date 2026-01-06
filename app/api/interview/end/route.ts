import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, endSession } from '@/lib/db/operations';
import { generateComprehensiveEvaluation, analyzeKnowledgeGaps } from '@/lib/ai/evaluation';

// POST /api/interview/end - End an interview session
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

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

    if (session.status === 'completed') {
      return NextResponse.json(
        { error: 'Session already ended', evaluation: session.evaluation },
        { status: 400 }
      );
    }

    // Use comprehensive evaluation system
    const evaluation = generateComprehensiveEvaluation(
      session.messages,
      session.performanceHistory || [],
      session.role,
      session.level
    );

    // Analyze knowledge gaps for additional insights
    const knowledgeAnalysis = analyzeKnowledgeGaps(
      session.messages,
      session.performanceHistory || [],
      session.role
    );

    // Add knowledge analysis to feedback
    let enhancedFeedback = evaluation.feedback;
    
    if (knowledgeAnalysis.topicsCovered.length > 0) {
      enhancedFeedback += `\n\nTopics covered: ${knowledgeAnalysis.topicsCovered.join(', ')}.`;
    }

    if (knowledgeAnalysis.strongAreas.length > 0) {
      enhancedFeedback += ` You showed particular strength in: ${knowledgeAnalysis.strongAreas.join(', ')}.`;
    }

    if (knowledgeAnalysis.weakAreas.length > 0) {
      enhancedFeedback += ` Focus on improving: ${knowledgeAnalysis.weakAreas.join(', ')}.`;
    }

    evaluation.feedback = enhancedFeedback;

    // End the session in database
    const updatedSession = await endSession(sessionId, evaluation);

    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId,
      endedAt: updatedSession.endedAt,
      duration: updatedSession.duration,
      evaluation: {
        ...evaluation,
        knowledgeAnalysis: {
          topicsCovered: knowledgeAnalysis.topicsCovered,
          strongAreas: knowledgeAnalysis.strongAreas,
          weakAreas: knowledgeAnalysis.weakAreas,
        },
      },
      questionsAnswered: session.performanceHistory?.length || 0,
    });
  } catch (error) {
    console.error('End interview error:', error);
    return NextResponse.json(
      { error: 'Failed to end interview session' },
      { status: 500 }
    );
  }
}
