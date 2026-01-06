/**
 * Comprehensive question banks for each role and level
 * These serve as reference questions the AI can draw from
 */

export const QUESTION_BANKS = {
  nodejs: {
    junior: [
      "What is Node.js and how does it differ from browser JavaScript?",
      "Can you explain what the package.json file is used for?",
      "What's the difference between `require()` and `import` in Node.js?",
      "How do you handle asynchronous operations in Node.js?",
      "What are callbacks and what is callback hell?",
      "Can you explain what promises are and how they help with async code?",
      "What is async/await and how does it improve code readability?",
      "How do you read a file in Node.js?",
      "What is npm and what does it do?",
      "Can you explain what Express.js is and why we use it?",
      "How do you create a simple HTTP server in Node.js?",
      "What's the difference between `process.exit()` and throwing an error?",
    ],
    mid: [
      "Explain the Node.js Event Loop and its different phases.",
      "How do you handle errors in asynchronous Node.js code?",
      "What are streams in Node.js and when would you use them?",
      "Can you explain middleware in Express.js? Give some examples.",
      "How do you structure a Node.js application for scalability?",
      "What's the difference between `process.nextTick()` and `setImmediate()`?",
      "How do you implement authentication in a Node.js API?",
      "Explain how you would optimize the performance of a Node.js application.",
      "What are worker threads and when would you use them?",
      "How do you handle database connections in Node.js?",
      "Can you explain the concept of clustering in Node.js?",
      "What testing frameworks have you used with Node.js?",
      "How do you handle environment variables and configuration?",
    ],
    senior: [
      "Explain the Event Loop in detail, including microtasks and macrotasks.",
      "What happens if a `setImmediate()` is scheduled during the poll phase?",
      "How does V8 garbage collection work and how can you optimize for it?",
      "Explain memory leaks in Node.js and how you'd debug them.",
      "How would you design a microservices architecture with Node.js?",
      "What are the trade-offs between clustering and using a load balancer?",
      "How do you handle backpressure in Node.js streams?",
      "Explain your approach to monitoring and observability in production.",
      "How would you optimize a Node.js application handling millions of requests?",
      "What's your strategy for zero-downtime deployments?",
      "How do you handle distributed transactions across microservices?",
      "Explain your approach to security in Node.js applications.",
    ],
  },
  react: {
    junior: [
      "What is React and why is it popular?",
      "Can you explain the difference between state and props?",
      "What is JSX and why do we use it?",
      "How do you handle events in React?",
      "What is the useState hook and how do you use it?",
      "Can you explain the useEffect hook?",
      "What's the difference between a controlled and uncontrolled component?",
      "How do you pass data from a child component to a parent?",
      "What are keys in React lists and why are they important?",
      "How do you handle forms in React?",
      "What is conditional rendering?",
    ],
    mid: [
      "How do you optimize React component performance?",
      "Explain useMemo and useCallback - when would you use each?",
      "What is the Context API and when should you use it?",
      "How does React handle reconciliation?",
      "What are custom hooks and can you give an example?",
      "How do you handle side effects in React?",
      "Explain your approach to state management in larger applications.",
      "What testing strategies do you use for React components?",
      "How do you handle API calls in React?",
      "What's the difference between useEffect and useLayoutEffect?",
      "How do you implement code splitting in React?",
    ],
    senior: [
      "Explain React's reconciliation algorithm and the fiber architecture.",
      "How does the virtual DOM diffing process work?",
      "What are the trade-offs between different state management solutions?",
      "How would you architect a micro-frontend with React?",
      "Explain your approach to performance profiling in React applications.",
      "How do you handle server-side rendering and hydration?",
      "What are render props vs HOCs vs hooks? When would you use each?",
      "How do you implement advanced patterns like compound components?",
      "Explain your strategy for bundle optimization and tree shaking.",
      "How would you design a component library used across multiple teams?",
    ],
  },
  fullstack: {
    junior: [
      "What does it mean to be a full-stack developer?",
      "Can you explain the client-server model?",
      "What is a REST API?",
      "What's the difference between frontend and backend?",
      "How do you connect a frontend application to a backend API?",
      "What is a database and what types are you familiar with?",
      "Can you explain HTTP methods (GET, POST, PUT, DELETE)?",
      "What is authentication and how does it work?",
      "How do you deploy a web application?",
      "What is version control and why is it important?",
    ],
    mid: [
      "How do you design a RESTful API?",
      "What's the difference between SQL and NoSQL databases?",
      "How do you implement authentication and authorization?",
      "Explain your approach to error handling across the stack.",
      "How do you optimize database queries?",
      "What is your CI/CD pipeline setup?",
      "How do you handle file uploads in a full-stack application?",
      "Explain caching strategies you've implemented.",
      "How do you structure a full-stack application for maintainability?",
      "What monitoring and logging tools do you use?",
    ],
    senior: [
      "How would you architect a scalable full-stack application?",
      "Explain the trade-offs between microservices and monolithic architecture.",
      "How do you handle database migrations in production?",
      "What's your approach to API versioning?",
      "How do you implement real-time features (WebSockets, SSE)?",
      "Explain your strategy for handling system failures and recovery.",
      "How would you design a multi-tenant SaaS application?",
      "What are your thoughts on GraphQL vs REST?",
      "How do you ensure security across the entire stack?",
      "Explain your approach to performance optimization at scale.",
    ],
  },
  devops: {
    junior: [
      "What is DevOps and why is it important?",
      "Can you explain what CI/CD means?",
      "What is Docker and why do we use containers?",
      "How do you use Git in a team environment?",
      "What is a deployment pipeline?",
      "Can you explain what infrastructure as code means?",
      "What cloud platforms are you familiar with?",
      "How do you monitor application health?",
      "What is the difference between development and production environments?",
    ],
    mid: [
      "How do you implement a CI/CD pipeline from scratch?",
      "Explain your experience with container orchestration.",
      "How do you handle secrets and sensitive configuration?",
      "What Infrastructure as Code tools have you used?",
      "How do you implement monitoring and alerting?",
      "Explain your approach to logging and log aggregation.",
      "How do you handle database backups and disaster recovery?",
      "What's your strategy for zero-downtime deployments?",
      "How do you optimize cloud costs?",
    ],
    senior: [
      "How would you design a multi-region, highly available infrastructure?",
      "Explain your approach to Kubernetes at scale.",
      "How do you implement observability in a microservices architecture?",
      "What's your strategy for security and compliance in the cloud?",
      "How do you handle disaster recovery and business continuity?",
      "Explain your approach to infrastructure automation and self-healing systems.",
      "How do you implement service mesh and why?",
      "What's your strategy for managing infrastructure drift?",
      "How do you build a DevOps culture in an organization?",
    ],
  },
};

/**
 * Get a random question from the question bank for a specific role and level
 */
export function getRandomQuestion(role: string, level: string): string {
  const roleKey = role.toLowerCase().replace(/\s+/g, '').replace('developer', '').replace('engineer', '') as keyof typeof QUESTION_BANKS;
  const levelKey = level.toLowerCase().replace('-level', '') as 'junior' | 'mid' | 'senior';
  
  const questions = QUESTION_BANKS[roleKey]?.[levelKey] || QUESTION_BANKS.nodejs.mid;
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Get a set of questions for practice
 */
export function getQuestionSet(role: string, level: string, count: number = 5): string[] {
  const roleKey = role.toLowerCase().replace(/\s+/g, '').replace('developer', '').replace('engineer', '') as keyof typeof QUESTION_BANKS;
  const levelKey = level.toLowerCase().replace('-level', '') as 'junior' | 'mid' | 'senior';
  
  const questions = QUESTION_BANKS[roleKey]?.[levelKey] || QUESTION_BANKS.nodejs.mid;
  
  // Shuffle and return requested count
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
