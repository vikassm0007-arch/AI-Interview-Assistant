import { calculateDimensionScore, calculateCompositeScore } from '../utils/scoringEngine';

export const EvaluationStates = {
  IDLE: 'IDLE',
  SENDING_PAYLOAD: 'SENDING_PAYLOAD',
  ANALYZING_TRANSCRIPT: 'ANALYZING_TRANSCRIPT',
  GENERATING_METRICS: 'GENERATING_METRICS',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
};

/**
 * AI Request Object Schema (commented for TypeScript reference)
 * 
 * interface AIRequestPayload {
 *   candidateProfile: {
 *     roleTitle: string;
 *     experienceLevel: string;
 *     techStack: string[];
 *     resumeSummary?: string;
 *   };
 *   questionData: {
 *     questionId: string;
 *     category: string;
 *     questionText: string;
 *     expectedKeywords: string[];
 *   };
 *   responsePayload: {
 *     candidateAnswer: string;
 *     timeSpentSeconds: number;
 *     fillerWordsCount: number;
 *     pausesCount: number;
 *   };
 * }
 */

/**
 * AI Response Object Schema (commented for TypeScript reference)
 * 
 * interface AIResponsePayload {
 *   technicalScore: number;
 *   technicalBreakdown: { accuracy: number; completeness: number; depth: number };
 *   communicationScore: number;
 *   communicationBreakdown: { clarity: number; pacing: number; conciseness: number };
 *   confidenceScore: number;
 *   confidenceBreakdown: { assertiveness: number; fluency: number; hesitation: number };
 *   overallScore: number;
 *   strengths: string[];
 *   improvements: string[];
 *   grammarToneHighlights: { snippet: string; type: 'filler' | 'weak'; rewrite: string }[];
 *   idealAnswer: string;
 * }
 */

const mockEvaluationHeuristics = (requestPayload) => {
  const answer = requestPayload.responsePayload.candidateAnswer.toLowerCase();
  const qCategory = requestPayload.questionData.category;
  
  // 1. Technical Scoring
  const accuracy = answer.length > 80 ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 20) + 60;
  const completeness = answer.includes('virtualization') || answer.includes('memoiz') || answer.includes('caching') || answer.includes('star') ? 88 : 72;
  const depth = answer.length > 150 ? 90 : 70;
  const technicalScore = calculateDimensionScore([accuracy, completeness, depth]);

  // 2. Communication Scoring (penalized for filler words)
  const fillerCount = requestPayload.responsePayload.fillerWordsCount || 0;
  const clarity = answer.includes('so') || answer.includes('yeah') ? 80 : 92;
  const pacing = Math.max(50, 100 - (requestPayload.responsePayload.pausesCount * 12));
  const conciseness = Math.max(60, 100 - Math.max(0, (fillerCount * 8)));
  const communicationScore = calculateDimensionScore([clarity, pacing, conciseness]);

  // 3. Confidence Scoring
  const assertiveness = answer.includes('absolutely') || answer.includes('definitely') ? 92 : 78;
  const fluency = Math.max(50, 100 - (requestPayload.responsePayload.pausesCount * 8));
  const hesitation = Math.max(40, 100 - (fillerCount * 10));
  const confidenceScore = calculateDimensionScore([assertiveness, fluency, hesitation]);

  // Overall Score
  const overallScore = calculateCompositeScore(technicalScore, communicationScore, confidenceScore);

  // Generate highlights for grammar and tone analysis
  const highlights = [];
  if (requestPayload.responsePayload.candidateAnswer.includes('Yeah, absolutely')) {
    highlights.push({
      snippet: "Yeah, absolutely.",
      type: "weak",
      rewrite: "Certainly, let me walk you through my experience."
    });
  }
  if (requestPayload.responsePayload.candidateAnswer.includes('like')) {
    highlights.push({
      snippet: "like",
      type: "filler",
      rewrite: ""
    });
  }
  if (requestPayload.responsePayload.candidateAnswer.includes('slow')) {
    highlights.push({
      snippet: "really slow",
      type: "weak",
      rewrite: "rendering layout delays of over 450ms"
    });
  }

  // Fallback snippets if none added
  if (highlights.length === 0) {
    highlights.push({
      snippet: "Um, we used some stuff...",
      type: "filler",
      rewrite: "We leveraged Node.js and Express modules."
    });
  }

  return {
    technicalScore,
    technicalBreakdown: { accuracy, completeness, depth },
    communicationScore,
    communicationBreakdown: { clarity, pacing, conciseness },
    confidenceScore,
    confidenceBreakdown: { assertiveness, fluency, hesitation },
    overallScore,
    strengths: [
      `Strong explanation of key concepts related to ${requestPayload.questionData.questionText.split(' ').slice(-2).join(' ')}.`,
      "Clear pacing with organized transition tags."
    ],
    improvements: [
      "Avoid informal fillers at the start of response blocks.",
      "Elaborate on specific product metrics and outcomes."
    ],
    grammarToneHighlights: highlights,
    idealAnswer: `To answer this question ideally: (1) Frame the problem clearly. (2) Explain the architectural choices (e.g. virtualization, indexes). (3) Summarize performance results using metrics.`
  };
};

/**
 * Simulates sending responses data to an AI model evaluator endpoint
 */
export const evaluateAnswerWithAI = async (
  sessionRole,
  activeQuestion,
  candidateAnswer,
  timeSpent,
  onStateChange
) => {
  // Build payload
  const requestPayload = {
    candidateProfile: {
      roleTitle: sessionRole,
      experienceLevel: 'Mid',
      techStack: ["React", "TypeScript", "Node.js"]
    },
    questionData: {
      questionId: activeQuestion.id,
      category: activeQuestion.category,
      questionText: activeQuestion.question,
      expectedKeywords: activeQuestion.keyTopics || []
    },
    responsePayload: {
      candidateAnswer,
      timeSpentSeconds: timeSpent,
      // Heuristic counters from text patterns
      fillerWordsCount: (candidateAnswer.match(/\b(um|ah|like|so)\b/gi) || []).length,
      pausesCount: Math.floor(Math.random() * 3) + 1
    }
  };

  try {
    onStateChange(EvaluationStates.SENDING_PAYLOAD);
    await new Promise(resolve => setTimeout(resolve, 600));

    onStateChange(EvaluationStates.ANALYZING_TRANSCRIPT);
    await new Promise(resolve => setTimeout(resolve, 800));

    onStateChange(EvaluationStates.GENERATING_METRICS);
    await new Promise(resolve => setTimeout(resolve, 600));

    // Calculate heuristics
    const result = mockEvaluationHeuristics(requestPayload);
    
    onStateChange(EvaluationStates.COMPLETE);
    return result;
  } catch (error) {
    onStateChange(EvaluationStates.ERROR);
    throw error;
  }
};
