interface PerformanceDisplayProps {
  technicalDepth: number;
  clarity: number;
  confidence: number;
  compact?: boolean;
}

export default function PerformanceDisplay({
  technicalDepth,
  clarity,
  confidence,
  compact = false
}: PerformanceDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-blue-600 dark:text-blue-400';
    if (score >= 4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 6) return 'bg-blue-100 dark:bg-blue-900/20';
    if (score >= 4) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (compact) {
    return (
      <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
        <span className={getScoreColor(technicalDepth)}>
          Tech: {technicalDepth.toFixed(1)}/10
        </span>
        <span className={getScoreColor(clarity)}>
          Clarity: {clarity.toFixed(1)}/10
        </span>
        <span className={getScoreColor(confidence)}>
          Confidence: {confidence.toFixed(1)}/10
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className={`${getScoreBackground(technicalDepth)} rounded-lg p-3 text-center`}>
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Technical Depth
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(technicalDepth)}`}>
          {technicalDepth.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">out of 10</div>
      </div>

      <div className={`${getScoreBackground(clarity)} rounded-lg p-3 text-center`}>
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Clarity
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(clarity)}`}>
          {clarity.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">out of 10</div>
      </div>

      <div className={`${getScoreBackground(confidence)} rounded-lg p-3 text-center`}>
        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Confidence
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(confidence)}`}>
          {confidence.toFixed(1)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">out of 10</div>
      </div>
    </div>
  );
}
