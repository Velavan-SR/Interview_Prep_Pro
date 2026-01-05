import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Day 2 Hour 3 - Update session in MongoDB
    // - Mark session as ended
    // - Calculate final scores
    // - Generate evaluation report
    
    const mockEvaluation = {
      sessionId,
      endedAt: new Date().toISOString(),
      evaluation: {
        technicalDepth: 7.5,
        clarity: 8.0,
        confidence: 7.0,
        overallScore: 7.5,
      },
      feedback: "Your answers showed good understanding of core concepts. Consider providing more real-world examples to demonstrate practical experience.",
    };

    return NextResponse.json(mockEvaluation);
  } catch (error) {
    console.error('End interview error:', error);
    return NextResponse.json(
      { error: 'Failed to end interview session' },
      { status: 500 }
    );
  }
}
