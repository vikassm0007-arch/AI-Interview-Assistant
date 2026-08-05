/**
 * Mock API Endpoint Handlers for Testing & API Contract Verification
 * Intercepts requests for /api/generate-questions, /api/evaluate-answer, and /api/profile
 */

export const mockHandlers = {
  // 1. /api/generate-questions
  generateQuestions: (body) => {
    const { skills = ['React'], difficulty = 'Mid' } = body || {};
    return {
      status: 200,
      data: {
        success: true,
        questions: [
          {
            id: 'mock-q-1',
            category: 'Technical',
            questionText: `Mock test question for ${skills.join(', ')} at ${difficulty} level.`,
            keyTopics: skills
          }
        ]
      }
    };
  },

  // 2. /api/evaluate-answer
  evaluateAnswer: (body, options = {}) => {
    if (options.simulateError) {
      return {
        status: 500,
        data: { success: false, message: 'Internal AI evaluation service timeout.' }
      };
    }

    const { candidateAnswer = '' } = body?.responsePayload || {};
    const score = candidateAnswer.length > 50 ? 88 : 65;

    return {
      status: 200,
      data: {
        success: true,
        evaluation: {
          technicalScore: score,
          communicationScore: Math.round(score * 0.95),
          confidenceScore: Math.round(score * 0.98),
          overallScore: score,
          strengths: ["Clear terminology", "Good response structure"],
          improvements: ["Elaborate on quantitative metrics"],
          idealAnswer: "Sample ideal response benchmark..."
        }
      }
    };
  },

  // 3. /api/profile
  updateProfile: (body) => {
    return {
      status: 200,
      data: {
        success: true,
        profile: {
          name: body.name || 'Vikas S.',
          email: body.email || 'vikas@example.com',
          targetJobTitle: body.targetJobTitle || 'Senior Full-Stack Engineer',
          updatedAt: new Date().toISOString()
        }
      }
    };
  }
};
