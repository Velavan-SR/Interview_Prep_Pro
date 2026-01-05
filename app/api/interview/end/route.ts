import { NextRequest, NextResponse } from 'next/server';
import { getSessionById, endSession } from '@/lib/db/operations';
import { analyzeResponseQuality } from '@/lib/ai/chain';

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

    // Analyze all user responses to calculate scores
    const userMessages = session.messages.filter(m => m.role === 'user');
    const aiMessages = session.messages.filter(m => m.role === 'assistant');

    let totalTechnicalDepth = 0;
    let totalClarity = 0;
    let totalConfidence = 0;
    let count = 0;

    // Analyze each user response
    for (let i = 0; i < userMessages.length; i++) {
      const userMsg = userMessages[i];
      const question = aiMessages[i]?.content || 'Question';
      
      try {
        const scores = await analyzeResponseQuality(
          userMsg.content,
          question,
          session.role
        );
        
        totalTechnicalDepth += scores.technicalDepth;
        totalClarity += scores.clarity;
        totalConfidence += scores.confidence;
        count++;
      } catch (error) {
        console.error('Error analyzing response:', error);
      }
    }

    // Calculate average scores
    const technicalDepth = count > 0 ? totalTechnicalDepth / count : 5;
    const clarity = count > 0 ? totalClarity / count : 5;
    const confidence = count > 0 ? totalConfidence / count : 5;
    const overallScore = (technicalDepth + clarity + confidence) / 3;

    // Generate feedback based on scores
    let feedback = '';
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (technicalDepth >= 7) {
      strengths.push('Strong technical knowledge demonstrated');
    } else {
      improvements.push('Deepen your technical understanding of core concepts');
    }

    if (clarity >= 7) {
      strengths.push('Clear and articulate communication');
    } else {
      improvements.push('Work on explaining concepts more clearly with examples');
    }

    if (confidence >= 7) {
      strengths.push('Confident and assured responses');
    } else {
      improvements.push('Build confidence through more practice and preparation');
    }

    if (overallScore >= 8) {
      feedback = 'Excellent performance! You demonstrated strong technical skills and clear communication.';
    } else if (overallScore >= 6) {
      feedback = 'Good performance overall. Focus on the improvement areas to reach the next level.';
    } else {
      feedback = 'Keep practicing! Review the fundamentals and work on the suggested improvements.';
    }

    // Update session with evaluation
    const evaluation = {
      technicalDepth: parseFloat(technicalDepth.toFixed(1)),
      clarity: parseFloat(clarity.toFixed(1)),
      confidence: parseFloat(confidence.toFixed(1)),
      overallScore: parseFloat(overallScore.toFixed(1)),
      feedback,
      strengths,
      improvements,
    };

    await endSession(sessionId, evaluation);

    return NextResponse.json({
      sessionId,
      endedAt: new Date().toISOString(),
      evaluation,
    });
  } catch (error) {
    console.error('End interview error:', error);
    return NextResponse.json(
      { error: 'Failed to end interview session' },
      { status: 500 }
    );
  }
}
