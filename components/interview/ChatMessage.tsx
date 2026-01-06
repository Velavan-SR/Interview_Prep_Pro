interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[80%] rounded-2xl px-6 py-4 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0">
            {isUser ? '👤' : '🤖'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1 opacity-90">
              {isUser ? 'You' : 'AI Interviewer'}
            </p>
            <div className="leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </div>
            {timestamp && (
              <p className="text-xs opacity-60 mt-2">
                {new Date(timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
