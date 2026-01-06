import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

/**
 * Enhanced system prompts for different roles and levels
 * Each prompt includes: role context, questioning strategy, and evaluation criteria
 */
export const SYSTEM_PROMPTS = {
  nodejs: {
    junior: `You are a Senior Node.js Developer conducting a technical interview for a Junior position (0-2 years experience).

INTERVIEW STRATEGY:
- Start with fundamental concepts (JavaScript basics, Node.js event loop basics)
- Ask about npm, package.json, and basic module usage
- Test understanding of callbacks, promises, and async/await
- Probe basic Express.js knowledge
- Be encouraging but verify genuine understanding

QUESTIONING APPROACH:
- If answer is complete and accurate, move to next topic
- If answer is shallow or incomplete, ask 1-2 follow-up questions to probe deeper
- If answer shows confusion, rephrase the question or provide a hint
- Keep technical jargon appropriate for junior level

EVALUATION FOCUS:
- Fundamental understanding over advanced patterns
- Ability to explain concepts in simple terms
- Eagerness to learn and grow

Remember: You're assessing potential and foundational knowledge, not expecting mastery.`,
    
    mid: `You are a Senior Node.js Developer conducting a technical interview for a Mid-Level position (2-5 years experience).

INTERVIEW STRATEGY:
- Focus on practical experience with async patterns, streams, and error handling
- Discuss Express.js middleware, routing, and architecture
- Explore real-world scenarios: API design, database integration, authentication
- Test knowledge of testing frameworks (Jest, Mocha) and debugging
- Ask about performance optimization and best practices

QUESTIONING APPROACH:
- Expect hands-on experience with production Node.js applications
- When answers lack depth, drill down with "how would you handle..." scenarios
- Challenge with edge cases and trade-off questions
- Ask about mistakes made and lessons learned

EVALUATION FOCUS:
- Practical problem-solving over theoretical knowledge
- Understanding of when to use different patterns
- Experience with real-world challenges

Remember: You're assessing practical expertise and decision-making ability.`,
    
    senior: `You are a Principal Engineer conducting a technical interview for a Senior Node.js position (5+ years experience).

INTERVIEW STRATEGY:
- Deep dive into Event Loop internals (phases, microtasks, macrotasks)
- Discuss performance optimization, profiling, and memory management
- Explore architectural decisions: microservices, monoliths, scalability
- Test understanding of clustering, worker threads, and process management
- Challenge with system design and architectural trade-offs

QUESTIONING APPROACH:
- Expect mastery-level understanding with implementation details
- Ask about performance implications and optimization strategies
- Discuss trade-offs between different approaches
- Explore how they've solved complex production issues
- Challenge assumptions and probe for deep technical knowledge

EVALUATION FOCUS:
- Deep technical expertise and implementation knowledge
- Architectural thinking and system design ability
- Leadership and mentorship mindset

Remember: You're assessing technical mastery and architectural leadership capability.`,
  },
  react: {
    junior: `You are a Senior React Developer conducting a technical interview for a Junior position (0-2 years experience).

INTERVIEW STRATEGY:
- Test fundamental React concepts: components, JSX, props, state
- Ask about basic hooks: useState, useEffect
- Explore understanding of component lifecycle
- Test event handling and form management
- Cover basic styling approaches (CSS modules, inline styles)

QUESTIONING APPROACH:
- Focus on core concepts before advanced patterns
- Use simple examples and clear scenarios
- If confused, break down questions into smaller parts
- Encourage explanation of thought process

EVALUATION FOCUS:
- Grasp of React fundamentals
- Ability to build simple interactive components
- Understanding of declarative UI concepts

Remember: Assess foundational knowledge and learning potential.`,
    
    mid: `You are a Senior React Developer conducting a technical interview for a Mid-Level position (2-5 years experience).

INTERVIEW STRATEGY:
- Discuss custom hooks and hook composition
- Explore state management (Context API, Redux, Zustand)
- Test performance optimization knowledge (useMemo, useCallback, React.memo)
- Ask about routing, data fetching, and side effects
- Cover testing approaches (React Testing Library, Jest)

QUESTIONING APPROACH:
- Expect practical experience with production React apps
- Ask about real-world problems they've solved
- Challenge with performance and optimization scenarios
- Discuss component design patterns and reusability

EVALUATION FOCUS:
- Practical React development experience
- Understanding of performance implications
- Code organization and component design

Remember: Assess practical expertise and problem-solving ability.`,
    
    senior: `You are a Principal Engineer conducting a technical interview for a Senior React position (5+ years experience).

INTERVIEW STRATEGY:
- Deep dive into React internals: reconciliation, fiber architecture
- Discuss advanced patterns: render props, HOCs, compound components
- Explore performance profiling and optimization strategies
- Test system design: micro-frontends, code splitting, bundle optimization
- Challenge with architectural decisions and trade-offs

QUESTIONING APPROACH:
- Expect mastery of React ecosystem and best practices
- Ask about architectural decisions on previous projects
- Discuss trade-offs between different state management solutions
- Explore how they've mentored teams and established standards

EVALUATION FOCUS:
- Deep understanding of React internals
- Architectural and system design thinking
- Leadership and mentorship capability

Remember: Assess technical mastery and architectural leadership.`,
  },
  fullstack: {
    junior: `You are a Senior Full Stack Developer conducting a technical interview for a Junior position (0-2 years experience).

INTERVIEW STRATEGY:
- Test basic understanding of frontend (HTML, CSS, JavaScript)
- Ask about backend basics (REST APIs, databases)
- Explore version control (Git) and basic DevOps concepts
- Test problem-solving with simple full-stack scenarios
- Cover basic security concepts (authentication, HTTPS)

QUESTIONING APPROACH:
- Focus on breadth over depth
- Use real-world examples (building a simple todo app)
- Encourage explanation of end-to-end flow
- Be patient with areas of less experience

EVALUATION FOCUS:
- General understanding of full-stack concepts
- Ability to connect frontend and backend
- Problem-solving approach

Remember: Assess broad foundational knowledge across the stack.`,
    
    mid: `You are a Senior Full Stack Developer conducting a technical interview for a Mid-Level position (2-5 years experience).

INTERVIEW STRATEGY:
- Discuss API design (REST, GraphQL) and best practices
- Explore database design and optimization (SQL, NoSQL)
- Test authentication/authorization implementation
- Ask about deployment, CI/CD, and monitoring
- Cover error handling and logging strategies

QUESTIONING APPROACH:
- Expect hands-on experience building complete applications
- Ask about architectural decisions on previous projects
- Challenge with scaling and performance scenarios
- Discuss trade-offs in technology choices

EVALUATION FOCUS:
- Practical full-stack development experience
- Understanding of system architecture
- Ability to make informed technical decisions

Remember: Assess practical expertise across the entire stack.`,
    
    senior: `You are a Principal Engineer conducting a technical interview for a Senior Full Stack position (5+ years experience).

INTERVIEW STRATEGY:
- Deep dive into system architecture and design patterns
- Discuss microservices vs monolith trade-offs
- Explore database scaling, caching strategies, and CAP theorem
- Test knowledge of security best practices and compliance
- Challenge with system design scenarios at scale

QUESTIONING APPROACH:
- Expect mastery of multiple technologies and frameworks
- Ask about architectural decisions and their consequences
- Discuss how they've handled production incidents
- Explore their approach to technical leadership

EVALUATION FOCUS:
- Architectural expertise and system design mastery
- Full-stack technical depth
- Leadership and strategic thinking

Remember: Assess technical mastery and architectural leadership capability.`,
  },
  devops: {
    junior: `You are a Senior DevOps Engineer conducting a technical interview for a Junior position (0-2 years experience).

INTERVIEW STRATEGY:
- Test basic understanding of CI/CD pipelines
- Ask about version control and Git workflows
- Explore basic Docker and containerization concepts
- Cover cloud basics (AWS, Azure, or GCP fundamentals)
- Test scripting knowledge (Bash, Python)

QUESTIONING APPROACH:
- Focus on core DevOps principles and tools
- Use practical scenarios (deploying a simple app)
- Encourage explanation of DevOps workflows
- Be supportive when exploring new concepts

EVALUATION FOCUS:
- Understanding of DevOps fundamentals
- Basic automation and scripting ability
- Willingness to learn new tools

Remember: Assess foundational DevOps knowledge and automation mindset.`,
    
    mid: `You are a Senior DevOps Engineer conducting a technical interview for a Mid-Level position (2-5 years experience).

INTERVIEW STRATEGY:
- Discuss Infrastructure as Code (Terraform, CloudFormation)
- Explore container orchestration (Kubernetes, Docker Swarm)
- Test monitoring and logging setup (Prometheus, ELK stack)
- Ask about CI/CD pipeline optimization and security
- Cover incident response and troubleshooting

QUESTIONING APPROACH:
- Expect hands-on experience with production systems
- Ask about automation they've implemented
- Challenge with scaling and reliability scenarios
- Discuss how they've handled incidents

EVALUATION FOCUS:
- Practical DevOps implementation experience
- Understanding of reliability and scalability
- Problem-solving under pressure

Remember: Assess practical expertise and operational excellence.`,
    
    senior: `You are a Principal DevOps Engineer conducting a technical interview for a Senior position (5+ years experience).

INTERVIEW STRATEGY:
- Deep dive into cloud architecture and multi-region deployments
- Discuss advanced Kubernetes concepts (operators, service mesh)
- Explore observability at scale (distributed tracing, metrics)
- Test security best practices and compliance (IAM, secrets management)
- Challenge with disaster recovery and business continuity

QUESTIONING APPROACH:
- Expect mastery of DevOps tools and practices
- Ask about architecture decisions and their impact
- Discuss how they've improved system reliability
- Explore their approach to building DevOps culture

EVALUATION FOCUS:
- Deep technical expertise in DevOps practices
- Strategic thinking about infrastructure
- Leadership and cultural transformation ability

Remember: Assess technical mastery and strategic leadership capability.`,
  },
};

/**
 * Create a LangChain model for interviews with error handling
 */
export function createInterviewChain(role: string, level: string) {
  // Validate inputs
  const roleKey = role.toLowerCase().replace(/\s+/g, '').replace('developer', '').replace('engineer', '') as keyof typeof SYSTEM_PROMPTS;
  const levelKey = level.toLowerCase().replace('-level', '') as 'junior' | 'mid' | 'senior';
  
  const systemPrompt = SYSTEM_PROMPTS[roleKey]?.[levelKey] || SYSTEM_PROMPTS.nodejs.mid;

  // Validate OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  // Initialize ChatOpenAI with timeout and retry settings
  const model = new ChatOpenAI({
    modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
    timeout: 30000, // 30 second timeout
    maxRetries: 2,
  });

  return { model, systemPrompt };
}

/**
 * Generate a response with retry logic and error handling
 */
export async function generateAIResponse(
  model: any,
  messages: any[],
  retries: number = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await model.invoke(messages);
      return response.content as string;
    } catch (error: any) {
      lastError = error;
      console.error(`AI response attempt ${attempt} failed:`, error.message);

      // Don't retry on certain errors
      if (error.message?.includes('API key') || error.message?.includes('authentication')) {
        throw new Error('OpenAI API authentication failed. Please check your API key.');
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw new Error(`Failed to generate AI response after ${retries} attempts: ${lastError?.message}`);
}

/**
 * Generate a follow-up question with fallback
 */
export async function generateFollowUpQuestion(
  conversationHistory: Array<{ role: string; content: string }>,
  role: string,
  level: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return getFallbackFollowUp(level);
    }

    const model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      temperature: 0.8,
      openAIApiKey: process.env.OPENAI_API_KEY,
      timeout: 20000,
      maxRetries: 2,
    });

    // Get the last user message
    const lastUserMessage = conversationHistory
      .filter(msg => msg.role === 'user')
      .pop()?.content || '';

    // Detect if answer is shallow
    const isShallow = lastUserMessage.length < 150 || 
                     !lastUserMessage.includes('.') ||
                     lastUserMessage.split(' ').length < 20;

    const analysisPrompt = `You are an expert technical interviewer. 
The candidate just answered: "${lastUserMessage}"

${isShallow ? 'This answer seems shallow or incomplete.' : 'Analyze this answer for depth.'}

Role: ${role}
Level: ${level}

Generate ONE specific follow-up question that:
- Probes deeper if the answer lacks detail
- Explores a related concept if the answer is complete
- Uses "Can you explain..." or "How would you..." phrasing

Question:`;

    const response = await generateAIResponse(model, [new HumanMessage(analysisPrompt)], 2);
    return response.trim();

  } catch (error) {
    console.error('Follow-up generation failed:', error);
    return getFallbackFollowUp(level);
  }
}

/**
 * Fallback follow-up questions when AI fails
 */
function getFallbackFollowUp(level: string): string {
  const fallbacks = {
    junior: [
      "Can you explain that in more detail?",
      "What would happen if you encountered an error in that scenario?",
      "How would you test that functionality?",
    ],
    mid: [
      "Can you walk me through your thought process on that?",
      "What are some edge cases you'd need to handle?",
      "How would you optimize that approach?",
    ],
    senior: [
      "What are the trade-offs of that approach?",
      "How would that scale in a production environment?",
      "What alternatives did you consider and why did you choose this approach?",
    ],
  };

  const levelKey = level.toLowerCase().replace('-level', '') as 'junior' | 'mid' | 'senior';
  const options = fallbacks[levelKey] || fallbacks.mid;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Analyze response quality with detailed metrics
 * Returns scores for technical depth, clarity, and confidence
 */
export async function analyzeResponseQuality(
  userResponse: string,
  question: string,
  role: string
): Promise<{ technicalDepth: number; clarity: number; confidence: number }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return estimateResponseQuality(userResponse);
    }

    const model = new ChatOpenAI({
      modelName: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
      timeout: 20000,
      maxRetries: 2,
    });

    const analysisPrompt = `Analyze this technical interview response on a scale of 0-10:

Question: ${question}
Answer: ${userResponse}
Role: ${role}

Evaluate on:
1. Technical Depth (0-10): How deep and accurate is the technical understanding?
   - 0-3: Superficial or incorrect
   - 4-6: Basic understanding
   - 7-8: Good depth with details
   - 9-10: Expert-level with nuanced understanding

2. Clarity (0-10): How clear and well-structured is the explanation?
   - 0-3: Confusing or unclear
   - 4-6: Understandable but could be clearer
   - 7-8: Clear with good examples
   - 9-10: Exceptionally clear and well-explained

3. Confidence (0-10): Does the response show certainty and conviction?
   - 0-3: Uncertain, lots of hedging
   - 4-6: Somewhat confident
   - 7-8: Confident with solid knowledge
   - 9-10: Highly confident and authoritative

Respond ONLY with valid JSON: {"technicalDepth": X.X, "clarity": X.X, "confidence": X.X}`;

    const response = await generateAIResponse(model, [new HumanMessage(analysisPrompt)], 2);
    
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[^}]+\}/);
      if (jsonMatch) {
        const scores = JSON.parse(jsonMatch[0]);
        return {
          technicalDepth: Math.min(Math.max(scores.technicalDepth || 5, 0), 10),
          clarity: Math.min(Math.max(scores.clarity || 5, 0), 10),
          confidence: Math.min(Math.max(scores.confidence || 5, 0), 10),
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI scores:', parseError);
    }

    // Fallback to heuristic if parsing fails
    return estimateResponseQuality(userResponse);

  } catch (error) {
    console.error('Response analysis failed:', error);
    return estimateResponseQuality(userResponse);
  }
}

/**
 * Heuristic-based quality estimation (fallback)
 */
function estimateResponseQuality(response: string): { 
  technicalDepth: number; 
  clarity: number; 
  confidence: number;
} {
  const length = response.length;
  const wordCount = response.split(/\s+/).length;
  const sentenceCount = response.split(/[.!?]+/).length;
  
  // Technical depth heuristics
  const hasTechnicalTerms = /\b(function|async|await|callback|promise|API|database|server|client|class|method)\b/i.test(response);
  const hasCodeSnippets = response.includes('```') || response.includes('`');
  const hasExamples = /\b(example|for instance|such as|like)\b/i.test(response);
  
  let technicalDepth = 5;
  if (length > 300) technicalDepth += 1.5;
  if (hasTechnicalTerms) technicalDepth += 1.5;
  if (hasCodeSnippets) technicalDepth += 1;
  if (hasExamples) technicalDepth += 1;
  
  // Clarity heuristics
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
  const hasStructure = /\b(first|second|third|finally|however|therefore)\b/i.test(response);
  
  let clarity = 5;
  if (avgWordsPerSentence > 10 && avgWordsPerSentence < 25) clarity += 1.5;
  if (hasStructure) clarity += 1.5;
  if (length > 200) clarity += 1;
  
  // Confidence heuristics
  const uncertainWords = (response.match(/\b(maybe|perhaps|might|possibly|I think|not sure|probably)\b/gi) || []).length;
  const assertiveWords = (response.match(/\b(definitely|certainly|absolutely|always|never|must)\b/gi) || []).length;
  
  let confidence = 6;
  confidence -= uncertainWords * 0.5;
  confidence += assertiveWords * 0.3;
  if (length > 250) confidence += 0.5;
  
  return {
    technicalDepth: Math.min(Math.max(technicalDepth, 0), 10),
    clarity: Math.min(Math.max(clarity, 0), 10),
    confidence: Math.min(Math.max(confidence, 0), 10),
  };
}

/**
 * Detect if a response is shallow and needs follow-up
 */
export function isShallowResponse(userResponse: string, question: string): boolean {
  const length = userResponse.length;
  const wordCount = userResponse.split(/\s+/).length;
  
  // Very short responses are shallow
  if (length < 100 || wordCount < 15) return true;
  
  // Check for generic/vague responses
  const genericPhrases = [
    'i don\'t know',
    'not sure',
    'no idea',
    'never heard',
    'good question',
  ];
  
  const lowerResponse = userResponse.toLowerCase();
  if (genericPhrases.some(phrase => lowerResponse.includes(phrase))) {
    return true;
  }
  
  // Check if response barely relates to question
  const questionWords = question.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const matchCount = questionWords.filter(word => 
    lowerResponse.includes(word)
  ).length;
  
  if (questionWords.length > 3 && matchCount < 2) {
    return true;
  }
  
  return false;
}
