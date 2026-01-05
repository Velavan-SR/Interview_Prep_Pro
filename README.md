# Interview Prep Pro (EdTech) 🎯

> Dynamic, state-aware AI interviewer that adapts to your responses and drills down into technical knowledge like a real Senior Engineer.

## 🚀 Project Overview

Static "Top 50 Interview Questions" lists are outdated. **Prep Pro** is a dynamic, state-aware AI interviewer that maintains **Multi-turn Conversation State**, remembering what you said minutes ago and asking intelligent follow-up questions to assess your true technical depth.

## 💡 Core Concept

Unlike traditional interview prep tools with static Q&A lists, Interview Prep Pro:
- **Remembers context** across the entire conversation
- **Adapts questions** based on answer quality
- **Drills deeper** when detecting shallow responses
- **Evaluates holistically** across technical depth, clarity, and confidence

## 📋 Detailed User Workflow

### 1. Setting the Scene
User selects:
- **Role**: "Node.js Developer"
- **Level**: "Senior Level"

### 2. The Opening
AI starts the session:
> "Can you explain how the Event Loop handles Asynchronous I/O?"

### 3. Adaptive Questioning
If the user gives a shallow answer, the AI detects the lack of depth and follows up:
> "You mentioned the Poll phase; what happens if a setImmediate is scheduled during that time?"

### 4. Live Evaluation
The system continuously tracks performance across:
- **Technical Depth**: How deep does the user understand the concepts?
- **Clarity**: Can they explain complex topics simply?
- **Confidence**: Do they show mastery or uncertainty?

### 5. The Debrief
After 10 minutes, the AI generates a comprehensive report:
- Full transcript of the interview
- Comparison with model answers
- Strengths and areas for improvement
- Personalized recommendations

## ✨ Core Features

### Conversation Memory
Using **MongoDB** to store `chat_history` so the LLM has full context of the ongoing interview session.

### Adaptive Follow-ups
AI analyzes response quality in real-time and generates contextually relevant follow-up questions.

### Feedback Loops
The AI critiques the user's responses **after** the interview to avoid breaking immersion during the session.

### Multi-dimensional Scoring
Tracks performance across multiple dimensions, not just "right" or "wrong" answers.

## 🛠️ Tech Stack

### Track 1: JavaScript / TypeScript (Node.js & Next.js)

**Frontend**:
- React.js / Next.js 15
- Tailwind CSS

**Backend**:
- Node.js / Express
- Next.js API Routes

**AI Stack**:
- LangChain.js
- Vercel AI SDK
- MongoDB Atlas Vector Search

**DevOps**:
- **Docker**: Containerizing Next.js app and Node.js worker
- **CI/CD**: GitHub Actions for automated linting and deployment to Vercel/Render
- **Observability**: LangSmith for tracing LLM chain latency and token costs

## 📅 Development Plan

### Day 1: Foundation & Project Setup (2 hours)

#### Hour 1: Project Initialization & Core Setup ✅
- [x] Initialize Next.js 15 project with TypeScript
- [x] Set up project structure (frontend, backend, shared)
- [x] Install core dependencies (React, Tailwind, Express)
- [x] Configure TypeScript and ESLint
- [x] Set up basic routing structure
- [x] Create initial landing page

#### Hour 2: Database & AI Foundation
- [ ] Set up MongoDB connection and schemas
- [ ] Create User and Interview Session models
- [ ] Initialize LangChain.js integration
- [ ] Set up environment variables structure
- [ ] Create basic API routes for interviews

---

### Day 2: Core AI Interview Engine (4 hours)

#### Hour 1: AI Interviewer Setup
- [ ] Implement LangChain conversation chain
- [ ] Create system prompts for different roles/levels
- [ ] Set up conversation memory storage
- [ ] Integrate with MongoDB for chat history

#### Hour 2: Adaptive Question Logic
- [ ] Build response analyzer (shallow vs. deep)
- [ ] Create follow-up question generator
- [ ] Implement difficulty adjustment logic
- [ ] Test multi-turn conversation flow

#### Hour 3: Evaluation System
- [ ] Design scoring algorithm (Technical Depth, Clarity, Confidence)
- [ ] Create real-time evaluation service
- [ ] Build transcript storage system
- [ ] Implement session state management

#### Hour 4: Interview UI Components
- [ ] Create chat interface component
- [ ] Build role/level selector
- [ ] Add real-time typing indicators
- [ ] Implement session timer
- [ ] Style with Tailwind CSS

---

### Day 3: Feedback, Testing & Deployment (4 hours)

#### Hour 1: Debrief & Feedback System
- [ ] Generate post-interview report
- [ ] Create transcript comparison view
- [ ] Build personalized recommendation engine
- [ ] Design feedback UI components

#### Hour 2: Vector Search & Enhanced Features
- [ ] Set up MongoDB Atlas Vector Search
- [ ] Implement semantic question matching
- [ ] Create question bank with embeddings
- [ ] Add context-aware question selection

#### Hour 3: Testing & Refinement
- [ ] Unit tests for core logic
- [ ] Integration tests for AI chains
- [ ] E2E testing with Playwright
- [ ] Performance optimization
- [ ] LangSmith integration for observability

#### Hour 4: DevOps & Deployment
- [ ] Dockerize application
- [ ] Set up GitHub Actions CI/CD
- [ ] Deploy to Vercel (frontend)
- [ ] Deploy to Render (backend)
- [ ] Configure environment variables
- [ ] Final testing and documentation

## 🏗️ Project Structure

```
interview-prep-pro/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── interview/         # Interview session pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities and services
│   │   ├── ai/               # LangChain integration
│   │   ├── db/               # MongoDB models
│   │   └── utils/            # Helper functions
│   └── styles/               # Global styles
├── public/                    # Static assets
├── docker/                    # Docker configurations
├── .github/                   # GitHub Actions workflows
└── tests/                     # Test files
```

## 🚦 Getting Started

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 📊 Key Differentiators

1. **State-Aware**: Maintains full conversation context across multiple turns
2. **Adaptive**: Questions adjust based on response quality
3. **Multi-dimensional**: Evaluates beyond just correctness
4. **Immersive**: No interruptions during the interview flow
5. **Actionable**: Provides specific, personalized improvement recommendations

## 🔗 Links

- **Documentation**: Coming soon
- **Demo**: Coming soon
- **API Docs**: Coming soon

---

**Built with ❤️ for developers who want to ace technical interviews**