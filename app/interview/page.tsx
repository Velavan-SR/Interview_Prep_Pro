"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChatMessage from "@/components/interview/ChatMessage";
import TypingIndicator from "@/components/interview/TypingIndicator";
import PerformanceDisplay from "@/components/interview/PerformanceDisplay";
import EvaluationPanel from "@/components/interview/EvaluationPanel";

interface Message {
  role: string;
  content: string;
  timestamp?: Date;
}

interface PerformanceData {
  technicalDepth: number;
  clarity: number;
  confidence: number;
  overallScore?: number;
}

interface EvaluationData {
  questionsAnswered: number;
  currentDifficulty: number;
  performance: PerformanceData & { trend: string };
  strengths: string[];
  improvements: string[];
}

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<number>(5);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [sessionStartTime] = useState<Date>(new Date());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      const roleParam = searchParams.get("role") || "nodejs";
      const levelParam = searchParams.get("level") || "mid";
      
      setRole(roleParam);
      setLevel(levelParam);

      try {
        const response = await fetch("/api/interview/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: roleParam,
            level: levelParam,
            userId: "demo-user", // TODO: Replace with actual user ID from auth
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to start session");
        }

        const data = await response.json();
        setSessionId(data.sessionId);
        setMessages([
          {
            role: "assistant",
            content: data.openingQuestion,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Failed to initialize session:", error);
        setMessages([
          {
            role: "assistant",
            content: "Failed to start interview session. Please refresh the page.",
            timestamp: new Date(),
          },
        ]);
      }
    };

    initSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId,
          role,
          level,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      
      // Update performance and difficulty
      if (data.performance) {
        setPerformance(data.performance);
      }
      if (data.difficulty) {
        setDifficulty(data.difficulty);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvaluation = async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`/api/interview/evaluation?sessionId=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setEvaluation(data);
      }
    } catch (error) {
      console.error("Failed to fetch evaluation:", error);
    }
  };

  const handleEndInterview = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/interview/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to end session");
      }

      const data = await response.json();
      
      // Redirect to results page (to be created later)
      // For now, show alert
      alert(
        `Interview Complete!\n\n` +
        `Technical Depth: ${data.evaluation.technicalDepth.toFixed(1)}/10\n` +
        `Clarity: ${data.evaluation.clarity.toFixed(1)}/10\n` +
        `Confidence: ${data.evaluation.confidence.toFixed(1)}/10\n` +
        `Overall: ${data.evaluation.overallScore.toFixed(1)}/10\n\n` +
        `${data.evaluation.feedback}`
      );
      
      router.push("/");
    } catch (error) {
      console.error("Failed to end interview:", error);
      alert("Failed to end interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = () => {
    const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const [currentTime, setCurrentTime] = useState(formatTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 md:py-4">
          {/* Top Row: Title and Main Actions */}
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-xl md:text-2xl">🎯</div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                Interview Session
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  fetchEvaluation();
                  setShowEvaluation(!showEvaluation);
                }}
                disabled={!sessionId}
                className="px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-xs md:text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">{showEvaluation ? 'Hide' : 'View'} Stats</span>
                <span className="sm:hidden">📊</span>
              </button>
              <button
                onClick={handleEndInterview}
                disabled={isLoading || !sessionId}
                className="px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg text-xs md:text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">End</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
          
          {/* Second Row: Stats (hidden on small screens, shown in mobile-friendly format) */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="font-semibold">⏱️</span>
              <span className="hidden xs:inline">Time:</span>
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">💼</span>
              <span className="hidden xs:inline">Role:</span>
              <span>{role}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">📊</span>
              <span className="hidden xs:inline">Level:</span>
              <span>{level}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">🎚️</span>
              <span className="hidden xs:inline">Difficulty:</span>
              <span>{difficulty.toFixed(1)}/10</span>
            </div>
          </div>
          
          {performance && (
            <div className="mt-2">
              <PerformanceDisplay 
                compact
                technicalDepth={performance.technicalDepth}
                clarity={performance.clarity}
                confidence={performance.confidence}
              />
            </div>
          )}
        </div>
      </header>

      {/* Real-time Evaluation Panel */}
      {showEvaluation && evaluation && (
        <div className="max-w-5xl mx-auto px-4 py-4 animate-fade-in">
          <EvaluationPanel evaluation={evaluation} />
        </div>
      )}

      {/* Chat Container */}
      <div className="max-w-5xl mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl h-[calc(100vh-280px)] md:h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p className="text-center">
                  <span className="text-4xl mb-2 block">💬</span>
                  Your interview will begin here...
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role as 'user' | 'assistant'}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                ))}
                {isLoading && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 md:p-6 bg-gray-50 dark:bg-gray-900/50">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 md:gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 px-4 md:px-6 py-3 md:py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm md:text-base transition-shadow"
                disabled={isLoading || !sessionId}
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !sessionId}
                className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all hover:shadow-lg text-sm md:text-base whitespace-nowrap"
                title={!sessionId ? "Waiting for session..." : "Send your answer"}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span className="hidden sm:inline">Sending...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Send</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                )}
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="hidden sm:inline">💡 Press Enter to send</span>
              <span className="sm:hidden">💡 Tap Send</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>AI analyzing responses</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
