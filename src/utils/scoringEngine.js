/**
 * Scoring Engine utility mapping evaluation calculations
 */

export const calculateDimensionScore = (subScores) => {
  if (!subScores || subScores.length === 0) return 0;
  const sum = subScores.reduce((acc, val) => acc + val, 0);
  return Math.min(100, Math.max(0, Math.round(sum / subScores.length)));
};

export const calculateCompositeScore = (technical, communication, confidence) => {
  // Weighted formula: Overall = (Technical * 0.45) + (Communication * 0.35) + (Confidence * 0.20)
  const composite = (technical * 0.45) + (communication * 0.35) + (confidence * 0.20);
  return Math.min(100, Math.max(0, Math.round(composite)));
};

export const getEvaluationStatus = (overallScore) => {
  if (overallScore >= 85) {
    return {
      label: 'Job Ready',
      colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20'
    };
  }
  if (overallScore >= 70) {
    return {
      label: 'Strong Candidate',
      colorClass: 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-505/20'
    };
  }
  return {
    label: 'Needs Practice',
    colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  };
};

export const getProgressColorClass = (score) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
};
