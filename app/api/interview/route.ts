import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Day 2 Hour 1 - Integrate with LangChain
    // - Connect to MongoDB to fetch/store conversation history
    // - Use LangChain to generate contextual AI response
    // - Store the new message exchange in the session
    
    // Mock response for now
    const mockResponse = {
      response: "That's an interesting point. Can you elaborate on how you would handle error cases in that scenario?",
      sessionId: sessionId || `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(mockResponse);
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

    // TODO: Day 2 Hour 3 - Fetch session from MongoDB
    const mockSession = {
      sessionId,
      role: 'Node.js Developer',
      level: 'Senior',
      messages: [],
      startedAt: new Date().toISOString(),
    };

    return NextResponse.json(mockSession);
  } catch (error) {
    console.error('Get interview session error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
