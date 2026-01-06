import { NextRequest, NextResponse } from 'next/server';
import { getSessionById } from '@/lib/db/operations';
import { 
  calculateOverallScore, 
  identifyStrengths, 
  identifyImprovements,
  analyzeKnowledgeGaps 
} from '@/lib/ai/evaluation';

// GET /api/interview/evaluation?sessionId=xxx - Get real-time evaluation without ending session
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

    // Fetch session from database
    const session = await getSessionById(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Calculate current performance metrics
    const performanceHistory = session.performanceHistory || [];
    
    if (performanceHistory.length === 0) {
      return NextResponse.json({
        sessionId,
        status: session.status,
        questionsAnswered: 0,
        message: 'No responses recorded yet',
      });
    }

    // Calculate average scores
    const avgTechnicalDepth = performanceHistory.reduce((sum, m) => sum + m.technicalDepth, 0) / performanceHistory.length;
    const avgClarity = performanceHistory.reduce((sum, m) => sum + m.clarity, 0) / performanceHistory.length;
    const avgConfidence = performanceHistory.reduce((sum, m) => sum + m.confidence, 0) / performanceHistory.length;

    // Calculate overall score with weighted algorithm
    const overallScore = calculateOverallScore(performanceHistory);

    // Get strengths and areas for improvement
    const strengths = identifyStrengths(performanceHistory, session.messages);
    const improvements = identifyImprovements(performanceHistory, session.messages);

    // Analyze knowledge gaps and covered topics
    const knowledgeAnalysis = analyzeKnowledgeGaps(
      session.messages,
      performanceHistory,
      session.role
    );

    // Calculate performance trend
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (performanceHistory.length >= 3) {
      const midpoint = Math.floor(performanceHistory.length / 2);
      const firstHalf = performanceHistory.slice(0, midpoint);
      const secondHalf = performanceHistory.slice(midpoint);

      const firstAvg = firstHalf.reduce((sum, m) => 
        sum + (m.technicalDepth + m.clarity + m.confidence) / 3, 0
      ) / firstHalf.length;

      const secondAvg = secondHalf.reduce((sum, m) => 
        sum + (m.technicalDepth + m.clarity + m.confidence) / 3, 0
      ) / secondHalf.length;

      const difference = secondAvg - firstAvg;
      if (difference > 0.5) {
        trend = 'improving';
      } else if (difference < -0.5) {
        trend = 'declining';
      }
    }

    return NextResponse.json({
      sessionId,
      status: session.status,
      questionsAnswered: performanceHistory.length,
      currentDifficulty: session.currentDifficulty || 5,
      performance: {
        technicalDepth: parseFloat(avgTechnicalDepth.toFixed(1)),
        clarity: parseFloat(avgClarity.toFixed(1)),
        confidence: parseFloat(avgConfidence.toFixed(1)),
        overallScore: parseFloat(overallScore.toFixed(1)),
        trend,
      },
      strengths,
      improvements,
      knowledgeAnalysis: {
        topicsCovered: knowledgeAnalysis.topicsCovered,
        strongAreas: knowledgeAnalysis.strongAreas,
        weakAreas: knowledgeAnalysis.weakAreas,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluation' },
      { status: 500 }
    );
  }
}
