import PerformanceDisplay from './PerformanceDisplay';

interface EvaluationPanelProps {
  evaluation: {
    questionsAnswered: number;
    currentDifficulty: number;
    performance: {
      technicalDepth: number;
      clarity: number;
      confidence: number;
      overallScore?: number;
      trend: string;
    };
    strengths: string[];
    improvements: string[];
  };
}

export default function EvaluationPanel({ evaluation }: EvaluationPanelProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 dark:text-green-400';
      case 'declining':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Declining';
      default:
        return 'Stable';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Live Performance Analysis
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Questions: <span className="font-semibold">{evaluation.questionsAnswered}</span>
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Difficulty: <span className="font-semibold">{evaluation.currentDifficulty.toFixed(1)}/10</span>
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Scores */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Performance Scores</span>
          </h4>
          
          {evaluation.performance.overallScore && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Score
                </span>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {evaluation.performance.overallScore.toFixed(1)}
                  <span className="text-lg text-gray-500 dark:text-gray-400">/10</span>
                </span>
              </div>
            </div>
          )}

          <PerformanceDisplay
            technicalDepth={evaluation.performance.technicalDepth}
            clarity={evaluation.performance.clarity}
            confidence={evaluation.performance.confidence}
          />

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Performance Trend
              </span>
              <span className={`font-semibold flex items-center gap-1 ${getTrendColor(evaluation.performance.trend)}`}>
                <span>{getTrendIcon(evaluation.performance.trend)}</span>
                <span>{getTrendText(evaluation.performance.trend)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Feedback */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>Strengths</span>
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 mb-6">
            {evaluation.strengths.slice(0, 3).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 p-2 rounded bg-green-50 dark:bg-green-900/10">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
            {evaluation.strengths.length === 0 && (
              <li className="text-gray-400 dark:text-gray-500 italic">
                Keep answering to see your strengths!
              </li>
            )}
          </ul>

          {evaluation.improvements.length > 0 && (
            <>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>Focus Areas</span>
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                {evaluation.improvements.slice(0, 3).map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded bg-orange-50 dark:bg-orange-900/10">
                    <span className="text-orange-500 flex-shrink-0 mt-0.5">→</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
