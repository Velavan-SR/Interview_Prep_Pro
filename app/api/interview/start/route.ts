import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/db/operations';

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
    
    // Generate opening question based on role and level
    const openingQuestions: Record<string, Record<string, string>> = {
      'nodejs': {
        'junior': "Let's start with the basics. Can you explain what Node.js is and why we use it?",
        'mid': "Tell me about your experience with asynchronous programming in Node.js. How do you handle async operations?",
        'senior': "Can you explain how the Event Loop handles Asynchronous I/O in Node.js? Walk me through the different phases.",
      },
      'react': {
        'junior': "What is React and what problems does it solve? Tell me about your experience with it.",
        'mid': "Explain the difference between state and props in React. When would you use each?",
        'senior': "How does React's reconciliation algorithm work? Can you explain the virtual DOM diffing process?",
      },
      'fullstack': {
        'junior': "What does it mean to be a full-stack developer? What technologies have you worked with?",
        'mid': "How do you approach building a full-stack application? Walk me through your typical architecture.",
        'senior': "Describe how you would architect a scalable full-stack application. What design patterns would you use?",
      },
      'devops': {
        'junior': "What is DevOps and why is it important? What tools are you familiar with?",
        'mid': "Explain the concept of CI/CD. How have you implemented it in your projects?",
        'senior': "How would you design a robust CI/CD pipeline for a microservices architecture? What about monitoring and observability?",
      },
    };

    const roleKey = role.toLowerCase().replace(/\s+/g, '').replace('developer', '').replace('engineer', '');
    const levelKey = level.toLowerCase().replace('-level', '');
    const openingQuestion = openingQuestions[roleKey]?.[levelKey] || "Tell me about your experience with software development.";

    // Add opening question to session messages
    await session.updateOne({
      $push: {
        messages: {
          role: 'assistant',
          content: openingQuestion,
          timestamp: new Date(),
        }
      }
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
