import { IPerformanceMetric } from '@/lib/db/models';

/**
 * Calculate overall performance score from recent metrics
 * Uses weighted average with more weight on recent performance
 */
export function calculatePerformanceScore(
  performanceHistory: IPerformanceMetric[],
  windowSize: number = 3
): number {
  if (performanceHistory.length === 0) {
    return 5; // Default medium performance
  }

  // Take the last N metrics
  const recentMetrics = performanceHistory.slice(-windowSize);
  
  // Calculate weighted average (more recent = higher weight)
  let totalScore = 0;
  let totalWeight = 0;

  recentMetrics.forEach((metric, index) => {
    const weight = index + 1; // 1, 2, 3... (most recent has highest weight)
    const avgScore = (metric.technicalDepth + metric.clarity + metric.confidence) / 3;
    totalScore += avgScore * weight;
    totalWeight += weight;
  });

  return totalScore / totalWeight;
}

/**
 * Adjust difficulty based on performance
 * Returns new difficulty level (1-10)
 */
export function adjustDifficulty(
  currentDifficulty: number,
  performanceScore: number,
  level: 'junior' | 'mid' | 'senior'
): number {
  // Define target ranges for each level
  const levelRanges = {
    junior: { min: 3, max: 6, target: 4.5 },
    mid: { min: 4, max: 8, target: 6 },
    senior: { min: 6, max: 10, target: 8 }
  };

  const range = levelRanges[level];
  let newDifficulty = currentDifficulty;

  // If performing well (score > 7), increase difficulty
  if (performanceScore >= 7.5) {
    newDifficulty = Math.min(range.max, currentDifficulty + 1.5);
  } else if (performanceScore >= 6.5) {
    newDifficulty = Math.min(range.max, currentDifficulty + 0.5);
  }
  // If performing poorly (score < 5), decrease difficulty
  else if (performanceScore <= 3.5) {
    newDifficulty = Math.max(range.min, currentDifficulty - 1.5);
  } else if (performanceScore <= 4.5) {
    newDifficulty = Math.max(range.min, currentDifficulty - 0.5);
  }
  // If performing moderately (5-6.5), slight adjustment toward target
  else {
    if (currentDifficulty < range.target) {
      newDifficulty = Math.min(range.target, currentDifficulty + 0.3);
    } else if (currentDifficulty > range.target) {
      newDifficulty = Math.max(range.target, currentDifficulty - 0.3);
    }
  }

  // Ensure within valid range
  return Math.max(1, Math.min(10, newDifficulty));
}

/**
 * Determine if a follow-up question should be generated
 * Based on response quality and conversation flow
 */
export function shouldAskFollowUp(
  performanceMetric: IPerformanceMetric,
  messageCount: number
): boolean {
  const avgScore = (
    performanceMetric.technicalDepth + 
    performanceMetric.clarity + 
    performanceMetric.confidence
  ) / 3;

  // Always ask follow-up if response is shallow (score < 5)
  if (avgScore < 5) {
    return true;
  }

  // Ask follow-up for first 3 questions to establish baseline
  if (messageCount <= 6) { // 6 because user+assistant pairs
    return true;
  }

  // For mid-quality responses (5-7), randomly decide (60% chance)
  if (avgScore >= 5 && avgScore < 7) {
    return Math.random() < 0.6;
  }

  // For high-quality responses (7-8.5), sometimes probe deeper (30% chance)
  if (avgScore >= 7 && avgScore < 8.5) {
    return Math.random() < 0.3;
  }

  // For excellent responses (8.5+), rarely follow up (10% chance)
  // Let them move to next topic
  return Math.random() < 0.1;
}

/**
 * Get difficulty-adjusted question selection strategy
 */
export function getQuestionSelectionStrategy(
  difficulty: number,
  level: 'junior' | 'mid' | 'senior'
): {
  targetLevel: 'junior' | 'mid' | 'senior';
  mixStrategy: 'easier' | 'current' | 'harder' | 'mixed';
} {
  // Define difficulty thresholds
  const thresholds = {
    junior: { easy: 4, hard: 6 },
    mid: { easy: 5, hard: 7 },
    senior: { easy: 7, hard: 9 }
  };

  const { easy, hard } = thresholds[level];

  // Very low difficulty: pull from easier level
  if (difficulty < easy - 1) {
    const targetLevel = level === 'senior' ? 'mid' : level === 'mid' ? 'junior' : 'junior';
    return { targetLevel, mixStrategy: 'easier' };
  }
  
  // Low difficulty: stay at current level but pick easier questions
  if (difficulty < easy) {
    return { targetLevel: level, mixStrategy: 'easier' };
  }

  // Very high difficulty: pull from harder level
  if (difficulty > hard + 1) {
    const targetLevel = level === 'junior' ? 'mid' : level === 'mid' ? 'senior' : 'senior';
    return { targetLevel, mixStrategy: 'harder' };
  }

  // High difficulty: stay at current level but pick harder questions
  if (difficulty > hard) {
    return { targetLevel: level, mixStrategy: 'harder' };
  }

  // Medium difficulty: mix of current level questions
  return { targetLevel: level, mixStrategy: 'mixed' };
}

/**
 * Format performance feedback based on metrics
 */
export function generatePerformanceFeedback(
  performanceHistory: IPerformanceMetric[]
): {
  trend: 'improving' | 'declining' | 'stable';
  message: string;
  suggestions: string[];
} {
  if (performanceHistory.length < 2) {
    return {
      trend: 'stable',
      message: 'Keep going! We\'re still assessing your baseline performance.',
      suggestions: ['Take your time with each answer', 'Provide specific examples']
    };
  }

  // Compare recent performance to earlier performance
  const early = performanceHistory.slice(0, Math.ceil(performanceHistory.length / 2));
  const recent = performanceHistory.slice(Math.ceil(performanceHistory.length / 2));

  const earlyAvg = early.reduce((sum, m) => 
    sum + (m.technicalDepth + m.clarity + m.confidence) / 3, 0
  ) / early.length;

  const recentAvg = recent.reduce((sum, m) => 
    sum + (m.technicalDepth + m.clarity + m.confidence) / 3, 0
  ) / recent.length;

  const difference = recentAvg - earlyAvg;
  
  if (difference > 1) {
    return {
      trend: 'improving',
      message: '🚀 Excellent! Your responses are getting stronger!',
      suggestions: [
        'Keep providing detailed explanations',
        'Continue using specific examples',
        'You\'re building great momentum'
      ]
    };
  } else if (difference < -1) {
    return {
      trend: 'declining',
      message: 'Your responses are becoming less detailed. Take a moment to think through your answers.',
      suggestions: [
        'Slow down and elaborate more',
        'Use concrete examples',
        'Explain the "why" behind your answers'
      ]
    };
  } else {
    return {
      trend: 'stable',
      message: 'You\'re maintaining consistent performance. Good work!',
      suggestions: [
        'Challenge yourself with deeper answers',
        'Provide more technical details',
        'Discuss trade-offs and alternatives'
      ]
    };
  }
}
