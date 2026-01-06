import { IPerformanceMetric, IMessage, IEvaluation } from '@/lib/db/models';

/**
 * Comprehensive evaluation categories with weights
 */
interface EvaluationWeights {
  technicalDepth: number;
  clarity: number;
  confidence: number;
  consistency: number;
  improvement: number;
}

const DEFAULT_WEIGHTS: EvaluationWeights = {
  technicalDepth: 0.35,  // 35% - Most important
  clarity: 0.25,         // 25% - Communication skills
  confidence: 0.15,      // 15% - Self-assurance
  consistency: 0.15,     // 15% - Steady performance
  improvement: 0.10,     // 10% - Learning trajectory
};

/**
 * Calculate weighted overall score from performance history
 */
export function calculateOverallScore(
  performanceHistory: IPerformanceMetric[],
  weights: EvaluationWeights = DEFAULT_WEIGHTS
): number {
  if (performanceHistory.length === 0) {
    return 0;
  }

  // Calculate average for each metric
  const avgTechnicalDepth = performanceHistory.reduce((sum, m) => sum + m.technicalDepth, 0) / performanceHistory.length;
  const avgClarity = performanceHistory.reduce((sum, m) => sum + m.clarity, 0) / performanceHistory.length;
  const avgConfidence = performanceHistory.reduce((sum, m) => sum + m.confidence, 0) / performanceHistory.length;

  // Calculate consistency (inverse of standard deviation)
  const consistencyScore = calculateConsistency(performanceHistory);

  // Calculate improvement trend
  const improvementScore = calculateImprovement(performanceHistory);

  // Weighted average
  return (
    avgTechnicalDepth * weights.technicalDepth +
    avgClarity * weights.clarity +
    avgConfidence * weights.confidence +
    consistencyScore * weights.consistency +
    improvementScore * weights.improvement
  );
}

/**
 * Calculate consistency score (0-10)
 * Higher score = more consistent performance
 */
function calculateConsistency(performanceHistory: IPerformanceMetric[]): number {
  if (performanceHistory.length < 2) {
    return 5; // Neutral for insufficient data
  }

  // Calculate overall score for each metric
  const scores = performanceHistory.map(m => 
    (m.technicalDepth + m.clarity + m.confidence) / 3
  );

  // Calculate standard deviation
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Convert to 0-10 scale (lower stdDev = higher consistency)
  // Typical stdDev range is 0-3, so we invert and scale
  const consistencyScore = Math.max(0, Math.min(10, 10 - (stdDev * 2.5)));

  return consistencyScore;
}

/**
 * Calculate improvement trend score (0-10)
 * Compares first half to second half of interview
 */
function calculateImprovement(performanceHistory: IPerformanceMetric[]): number {
  if (performanceHistory.length < 3) {
    return 5; // Neutral for insufficient data
  }

  const midpoint = Math.floor(performanceHistory.length / 2);
  const firstHalf = performanceHistory.slice(0, midpoint);
  const secondHalf = performanceHistory.slice(midpoint);

  const firstAvg = firstHalf.reduce((sum, m) => 
    sum + (m.technicalDepth + m.clarity + m.confidence) / 3, 0
  ) / firstHalf.length;

  const secondAvg = secondHalf.reduce((sum, m) => 
    sum + (m.technicalDepth + m.clarity + m.confidence) / 3, 0
  ) / secondHalf.length;

  const improvement = secondAvg - firstAvg;

  // Convert improvement to 0-10 scale
  // -3 (declining) to +3 (improving) maps to 0-10
  return Math.max(0, Math.min(10, 5 + (improvement * 1.67)));
}

/**
 * Generate detailed strengths based on performance
 */
export function identifyStrengths(
  performanceHistory: IPerformanceMetric[],
  messages: IMessage[]
): string[] {
  const strengths: string[] = [];

  if (performanceHistory.length === 0) {
    return ['Completed the interview session'];
  }

  const avgTechnicalDepth = performanceHistory.reduce((sum, m) => sum + m.technicalDepth, 0) / performanceHistory.length;
  const avgClarity = performanceHistory.reduce((sum, m) => sum + m.clarity, 0) / performanceHistory.length;
  const avgConfidence = performanceHistory.reduce((sum, m) => sum + m.confidence, 0) / performanceHistory.length;

  // Technical depth strengths
  if (avgTechnicalDepth >= 8) {
    strengths.push('Excellent technical knowledge and deep understanding of concepts');
  } else if (avgTechnicalDepth >= 6.5) {
    strengths.push('Solid technical foundation with good conceptual understanding');
  }

  // Clarity strengths
  if (avgClarity >= 8) {
    strengths.push('Outstanding communication skills - explains complex topics clearly');
  } else if (avgClarity >= 6.5) {
    strengths.push('Good communication ability and structured explanations');
  }

  // Confidence strengths
  if (avgConfidence >= 7.5) {
    strengths.push('Confident and assertive responses demonstrate strong self-assurance');
  }

  // Consistency strengths
  const consistency = calculateConsistency(performanceHistory);
  if (consistency >= 7) {
    strengths.push('Consistent performance throughout the interview');
  }

  // Improvement strengths
  const improvement = calculateImprovement(performanceHistory);
  if (improvement >= 7) {
    strengths.push('Shows strong learning ability - performance improved during interview');
  }

  // Response length analysis
  const userMessages = messages.filter(m => m.role === 'user');
  const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
  if (avgLength > 300) {
    strengths.push('Provides detailed and thorough responses');
  }

  // Code examples (look for code blocks in responses)
  const codeResponses = userMessages.filter(m => m.content.includes('```') || m.content.includes('function') || m.content.includes('const '));
  if (codeResponses.length >= 2) {
    strengths.push('Uses code examples to illustrate concepts effectively');
  }

  return strengths.length > 0 ? strengths : ['Engaged with the interview questions'];
}

/**
 * Generate areas for improvement based on performance
 */
export function identifyImprovements(
  performanceHistory: IPerformanceMetric[],
  messages: IMessage[]
): string[] {
  const improvements: string[] = [];

  if (performanceHistory.length === 0) {
    return ['Practice more technical interviews to build experience'];
  }

  const avgTechnicalDepth = performanceHistory.reduce((sum, m) => sum + m.technicalDepth, 0) / performanceHistory.length;
  const avgClarity = performanceHistory.reduce((sum, m) => sum + m.clarity, 0) / performanceHistory.length;
  const avgConfidence = performanceHistory.reduce((sum, m) => sum + m.confidence, 0) / performanceHistory.length;

  // Technical depth improvements
  if (avgTechnicalDepth < 5) {
    improvements.push('Study core concepts more deeply - focus on understanding "why" and "how" things work');
  } else if (avgTechnicalDepth < 7) {
    improvements.push('Expand technical knowledge with real-world examples and edge cases');
  }

  // Clarity improvements
  if (avgClarity < 5) {
    improvements.push('Practice explaining technical concepts in simpler terms - use analogies and examples');
  } else if (avgClarity < 7) {
    improvements.push('Structure your answers better - use frameworks like "Problem-Solution-Example"');
  }

  // Confidence improvements
  if (avgConfidence < 5) {
    improvements.push('Build confidence through more practice and hands-on experience');
  } else if (avgConfidence < 6.5) {
    improvements.push('Be more assertive in your answers - avoid hedging language like "maybe" or "I think"');
  }

  // Response length analysis
  const userMessages = messages.filter(m => m.role === 'user');
  const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
  if (avgLength < 100) {
    improvements.push('Provide more detailed responses - elaborate on your answers with examples');
  }

  // Consistency improvements
  const consistency = calculateConsistency(performanceHistory);
  if (consistency < 5) {
    improvements.push('Work on maintaining consistent quality across all answers');
  }

  // Improvement trend
  const improvement = calculateImprovement(performanceHistory);
  if (improvement < 4) {
    improvements.push('Stay focused throughout the interview - your performance declined toward the end');
  }

  return improvements.length > 0 ? improvements : ['Keep practicing to maintain your skills'];
}

/**
 * Generate detailed feedback text
 */
export function generateFeedbackText(
  performanceHistory: IPerformanceMetric[],
  overallScore: number,
  role: string,
  level: string
): string {
  if (performanceHistory.length === 0) {
    return 'Interview session completed but no responses were recorded.';
  }

  const avgTechnicalDepth = performanceHistory.reduce((sum, m) => sum + m.technicalDepth, 0) / performanceHistory.length;
  const avgClarity = performanceHistory.reduce((sum, m) => sum + m.clarity, 0) / performanceHistory.length;
  const avgConfidence = performanceHistory.reduce((sum, m) => sum + m.confidence, 0) / performanceHistory.length;

  let feedback = `You completed a ${level}-level ${role} technical interview with ${performanceHistory.length} responses. `;

  // Overall performance assessment
  if (overallScore >= 8) {
    feedback += 'Outstanding performance! You demonstrated strong technical skills and excellent communication. ';
  } else if (overallScore >= 6.5) {
    feedback += 'Good performance overall. You showed solid understanding with room for growth. ';
  } else if (overallScore >= 5) {
    feedback += 'Adequate performance with several areas needing improvement. ';
  } else {
    feedback += 'Your performance indicates significant gaps in knowledge and preparation. ';
  }

  // Technical depth assessment
  if (avgTechnicalDepth >= 7) {
    feedback += 'Your technical knowledge is strong. ';
  } else if (avgTechnicalDepth >= 5) {
    feedback += 'Your technical understanding is developing but needs more depth. ';
  } else {
    feedback += 'Focus on building stronger technical foundations. ';
  }

  // Communication assessment
  if (avgClarity >= 7) {
    feedback += 'You communicate technical concepts clearly and effectively. ';
  } else if (avgClarity >= 5) {
    feedback += 'Your communication is adequate but could be more structured. ';
  } else {
    feedback += 'Work on explaining concepts more clearly and coherently. ';
  }

  // Confidence assessment
  if (avgConfidence >= 7) {
    feedback += 'You demonstrated good confidence in your answers.';
  } else if (avgConfidence >= 5) {
    feedback += 'Build more confidence through practice and experience.';
  } else {
    feedback += 'Your responses showed uncertainty - practice will help build confidence.';
  }

  return feedback;
}

/**
 * Analyze conversation patterns and identify knowledge gaps
 */
export function analyzeKnowledgeGaps(
  messages: IMessage[],
  performanceHistory: IPerformanceMetric[],
  role: string
): {
  strongAreas: string[];
  weakAreas: string[];
  topicsCovered: string[];
} {
  // Define topic keywords for different roles
  const topicKeywords: Record<string, Record<string, string[]>> = {
    nodejs: {
      'Event Loop': ['event loop', 'asynchronous', 'callback', 'promise', 'async'],
      'Streams': ['stream', 'buffer', 'pipe', 'readable', 'writable'],
      'Modules': ['require', 'module', 'export', 'import', 'package'],
      'Performance': ['performance', 'optimization', 'memory', 'cpu', 'profiling'],
      'Error Handling': ['error', 'try', 'catch', 'exception', 'handling'],
    },
    react: {
      'Hooks': ['hook', 'useState', 'useEffect', 'useMemo', 'useCallback'],
      'Components': ['component', 'props', 'state', 'jsx', 'render'],
      'Performance': ['memo', 'optimization', 'performance', 'reconciliation'],
      'State Management': ['context', 'redux', 'state', 'store', 'reducer'],
      'Lifecycle': ['lifecycle', 'mount', 'unmount', 'effect', 'dependency'],
    },
    fullstack: {
      'API Design': ['api', 'rest', 'graphql', 'endpoint', 'http'],
      'Database': ['database', 'sql', 'nosql', 'query', 'schema'],
      'Authentication': ['auth', 'jwt', 'session', 'security', 'token'],
      'Architecture': ['architecture', 'design', 'pattern', 'microservice'],
      'Performance': ['cache', 'optimization', 'scaling', 'load'],
    },
    devops: {
      'CI/CD': ['ci', 'cd', 'pipeline', 'deployment', 'automation'],
      'Containers': ['docker', 'container', 'kubernetes', 'k8s', 'pod'],
      'Infrastructure': ['infrastructure', 'terraform', 'iac', 'cloud'],
      'Monitoring': ['monitoring', 'logging', 'metrics', 'observability'],
      'Security': ['security', 'vulnerability', 'compliance', 'hardening'],
    },
  };

  const roleKey = role.toLowerCase().replace(/\s+/g, '').replace('developer', '').replace('engineer', '');
  const topics = topicKeywords[roleKey] || {};

  const topicsCovered: string[] = [];
  const topicPerformance: Record<string, number[]> = {};

  // Analyze which topics were discussed
  messages.forEach((msg, index) => {
    if (msg.role === 'assistant' || msg.role === 'user') {
      const content = msg.content.toLowerCase();
      
      Object.entries(topics).forEach(([topic, keywords]) => {
        const mentioned = keywords.some(keyword => content.includes(keyword.toLowerCase()));
        
        if (mentioned && !topicsCovered.includes(topic)) {
          topicsCovered.push(topic);
        }

        // Associate performance with topics (if user message and has corresponding metric)
        if (msg.role === 'user' && mentioned) {
          const metricIndex = Math.floor(index / 2);
          if (performanceHistory[metricIndex]) {
            if (!topicPerformance[topic]) {
              topicPerformance[topic] = [];
            }
            const avgScore = (
              performanceHistory[metricIndex].technicalDepth +
              performanceHistory[metricIndex].clarity +
              performanceHistory[metricIndex].confidence
            ) / 3;
            topicPerformance[topic].push(avgScore);
          }
        }
      });
    }
  });

  // Identify strong and weak areas
  const strongAreas: string[] = [];
  const weakAreas: string[] = [];

  Object.entries(topicPerformance).forEach(([topic, scores]) => {
    if (scores.length > 0) {
      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      if (avgScore >= 7) {
        strongAreas.push(topic);
      } else if (avgScore < 5) {
        weakAreas.push(topic);
      }
    }
  });

  return {
    strongAreas,
    weakAreas,
    topicsCovered,
  };
}

/**
 * Generate comprehensive evaluation
 */
export function generateComprehensiveEvaluation(
  messages: IMessage[],
  performanceHistory: IPerformanceMetric[],
  role: string,
  level: string
): IEvaluation {
  const avgTechnicalDepth = performanceHistory.length > 0
    ? performanceHistory.reduce((sum, m) => sum + m.technicalDepth, 0) / performanceHistory.length
    : 0;

  const avgClarity = performanceHistory.length > 0
    ? performanceHistory.reduce((sum, m) => sum + m.clarity, 0) / performanceHistory.length
    : 0;

  const avgConfidence = performanceHistory.length > 0
    ? performanceHistory.reduce((sum, m) => sum + m.confidence, 0) / performanceHistory.length
    : 0;

  const overallScore = calculateOverallScore(performanceHistory);
  const strengths = identifyStrengths(performanceHistory, messages);
  const improvements = identifyImprovements(performanceHistory, messages);
  const feedback = generateFeedbackText(performanceHistory, overallScore, role, level);

  return {
    technicalDepth: parseFloat(avgTechnicalDepth.toFixed(1)),
    clarity: parseFloat(avgClarity.toFixed(1)),
    confidence: parseFloat(avgConfidence.toFixed(1)),
    overallScore: parseFloat(overallScore.toFixed(1)),
    feedback,
    strengths,
    improvements,
  };
}
