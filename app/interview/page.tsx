"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Message {
  role: string;
  content: string;
}

interface PerformanceData {
  technicalDepth: number;
  clarity: number;
  confidence: number;
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
          },
        ]);
      } catch (error) {
        console.error("Failed to initialize session:", error);
        setMessages([
          {
            role: "assistant",
            content: "Failed to start interview session. Please refresh the page.",
          },
        ]);
      }
    };

    initSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
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
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Interview Session
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Time:</span> {currentTime}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Role:</span> {role}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Level:</span> {level}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Difficulty:</span> {difficulty.toFixed(1)}/10
              </div>
              <button
                onClick={handleEndInterview}
                disabled={isLoading || !sessionId}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
          {performance && (
            <div className="mt-2 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>Tech: {performance.technicalDepth.toFixed(1)}/10</span>
              <span>Clarity: {performance.clarity.toFixed(1)}/10</span>
              <span>Confidence: {performance.confidence.toFixed(1)}/10</span>
            </div>
          )}
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">
                      {message.role === "user" ? "👤" : "🤖"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">
                        {message.role === "user" ? "You" : "AI Interviewer"}
                      </p>
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">🤖</div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading || !sessionId}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !sessionId}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
              >
                Send
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send • Your responses are analyzed in real-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
