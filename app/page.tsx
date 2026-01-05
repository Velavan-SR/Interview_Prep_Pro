import Link from "next/link";

export default function Home() {
  const roles = [
    { id: "nodejs", name: "Node.js Developer", icon: "💚" },
    { id: "react", name: "React Developer", icon: "⚛️" },
    { id: "fullstack", name: "Full Stack Developer", icon: "🚀" },
    { id: "devops", name: "DevOps Engineer", icon: "⚙️" },
  ];

  const levels = [
    { id: "junior", name: "Junior", description: "0-2 years experience" },
    { id: "mid", name: "Mid-Level", description: "2-5 years experience" },
    { id: "senior", name: "Senior", description: "5+ years experience" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎯</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Interview Prep Pro
              </h1>
            </div>
            <nav className="flex gap-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                About
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                How It Works
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ace Your Technical Interview
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Practice with an AI interviewer that remembers your answers, asks follow-up questions, 
            and adapts to your skill level—just like a real Senior Engineer.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              State-Aware Conversations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              The AI remembers your entire conversation and asks contextual follow-ups.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Adaptive Difficulty
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Questions adjust based on your answers—drilling deeper when needed.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Detailed Feedback
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get a comprehensive report with transcript, model answers, and recommendations.
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Select Your Role
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
              >
                <div className="text-4xl mb-3">{role.icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {role.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Level Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Select Your Experience Level
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all group text-left"
              >
                <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {level.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/interview"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg px-12 py-4 rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
          >
            Start Interview Practice →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Built with ❤️ for developers who want to ace technical interviews
          </p>
        </div>
      </footer>
    </main>
  );
}
