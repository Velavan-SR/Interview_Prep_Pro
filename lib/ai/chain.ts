import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

/**
 * System prompts for different roles and levels
 */
export const SYSTEM_PROMPTS = {
  nodejs: {
    junior: `You are an experienced Senior Node.js Developer conducting a technical interview for a Junior position. 
Ask fundamental questions about Node.js basics, JavaScript concepts, and simple async operations.
Be encouraging but probe for understanding. If answers are shallow, ask follow-up questions to assess true comprehension.`,
    
    mid: `You are an experienced Senior Node.js Developer conducting a technical interview for a Mid-Level position.
Ask about asynchronous programming patterns, Express.js, error handling, and real-world scenarios.
Expect deeper technical knowledge. Challenge the candidate with follow-up questions about edge cases and best practices.`,
    
    senior: `You are an experienced Principal Engineer conducting a technical interview for a Senior Node.js position.
Ask about the Event Loop internals, performance optimization, scalability, design patterns, and architectural decisions.
Expect mastery-level understanding. Drill down into implementation details and trade-offs.`,
  },
  react: {
    junior: `You are an experienced Senior React Developer conducting a technical interview for a Junior position.
Ask about React basics, component lifecycle, state vs props, and simple hooks usage.
Be encouraging but verify understanding through follow-ups.`,
    
    mid: `You are an experienced Senior React Developer conducting a technical interview for a Mid-Level position.
Ask about custom hooks, performance optimization, context API, and state management solutions.
Expect practical experience with real-world React applications.`,
    
    senior: `You are an experienced Principal Engineer conducting a technical interview for a Senior React position.
Ask about React internals, reconciliation algorithm, performance profiling, and architectural patterns.
Expect deep understanding of React's design principles and trade-offs.`,
  },
  fullstack: {
    junior: `You are an experienced Full Stack Developer conducting a technical interview for a Junior position.
Ask about basic frontend and backend concepts, REST APIs, databases, and deployment basics.`,
    
    mid: `You are an experienced Full Stack Developer conducting a technical interview for a Mid-Level position.
Ask about API design, database optimization, authentication/authorization, and system design basics.`,
    
    senior: `You are an experienced Principal Engineer conducting a technical interview for a Senior Full Stack position.
Ask about microservices, scalability, distributed systems, CI/CD, and architectural trade-offs.`,
  },
  devops: {
    junior: `You are an experienced DevOps Engineer conducting a technical interview for a Junior position.
Ask about CI/CD basics, version control, containerization concepts, and basic scripting.`,
    
    mid: `You are an experienced DevOps Engineer conducting a technical interview for a Mid-Level position.
Ask about infrastructure as code, monitoring, logging, container orchestration, and automation.`,
    
    senior: `You are an experienced Principal DevOps Engineer conducting a technical interview for a Senior position.
Ask about cloud architecture, Kubernetes, observability, security, and incident management at scale.`,
  },
};

/**
 * Create a LangChain model for interviews
 */
export function createInterviewChain(role: string, level: string) {
  // Validate inputs
  const roleKey = role.toLowerCase().replace(/\s+/g, '').replace('developer', '').replace('engineer', '') as keyof typeof SYSTEM_PROMPTS;
  const levelKey = level.toLowerCase().replace('-level', '') as 'junior' | 'mid' | 'senior';
  
  const systemPrompt = SYSTEM_PROMPTS[roleKey]?.[levelKey] || SYSTEM_PROMPTS.nodejs.mid;

  // Initialize ChatOpenAI
  const model = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  return { model, systemPrompt };
}

/**
 * Generate a follow-up question based on conversation history
 * This analyzes the user's previous answer and generates a targeted follow-up
 */
export async function generateFollowUpQuestion(
  conversationHistory: Array<{ role: string; content: string }>,
  role: string,
  level: string
): Promise<string> {
  const model = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: 0.8,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Get the last user message
  const lastUserMessage = conversationHistory
    .filter(msg => msg.role === 'user')
    .pop()?.content || '';

  const analysisPrompt = `You are an expert technical interviewer. 
The candidate just answered: "${lastUserMessage}"

Analyze this answer for depth and completeness. If the answer is shallow or lacks detail, generate a follow-up question that probes deeper.
If the answer is comprehensive, move to a new related topic.

Role: ${role}
Level: ${level}

Generate ONE follow-up question:`;

  const response = await model.invoke(analysisPrompt);
  
  return response.content as string;
}

/**
 * Analyze response quality (for evaluation)
 * Returns scores for technical depth, clarity, and confidence
 */
export async function analyzeResponseQuality(
  userResponse: string,
  question: string,
  role: string
): Promise<{ technicalDepth: number; clarity: number; confidence: number }> {
  const model = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: 0.3,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const analysisPrompt = `Analyze this interview response on a scale of 0-10:

Question: ${question}
Answer: ${userResponse}
Role: ${role}

Evaluate on:
1. Technical Depth: How deep is the technical understanding shown?
2. Clarity: How clear and well-explained is the answer?
3. Confidence: Does the response show confidence and certainty?

Respond ONLY with a JSON object: {"technicalDepth": X, "clarity": X, "confidence": X}`;

  const response = await model.invoke(analysisPrompt);
  
  try {
    return JSON.parse(response.content as string);
  } catch {
    return { technicalDepth: 5, clarity: 5, confidence: 5 };
  }
}
