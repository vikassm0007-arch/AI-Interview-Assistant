const generateQuestionsLocally = (resume, targetRole, experienceLevel) => {
  const questions = [];
  const skillsList = resume.skills.flatMap(s => s.items);
  const primarySkill = skillsList[0] || 'Web Technologies';
  const secondarySkill = skillsList[1] || 'Git';
  const company = resume.experience[0]?.company || 'your previous employer';
  const role = resume.experience[0]?.role || 'Software Developer';

  questions.push({
    id: 'q-tech-1',
    category: 'Technical',
    difficulty: 'Medium',
    question: `Explain how you would handle state synchronization or optimization issues in an application utilizing ${primarySkill}.`,
    contextReasoning: `Asked because your resume highlights extensive use of ${primarySkill} and you are targeting a ${targetRole} role.`,
    keyTopics: [primarySkill, "Performance Optimization", "State Lifecycle"]
  });

  if (skillsList.includes('TypeScript') || skillsList.includes('Typescript')) {
    questions.push({
      id: 'q-tech-2',
      category: 'Technical',
      difficulty: 'Hard',
      question: "What are the security and maintenance trade-offs of using TypeScript's type assertions versus strict validation guards at external boundary layouts?",
      contextReasoning: "Asked because you listed TypeScript in your skills section and we want to verify your depth in type design.",
      keyTopics: ["TypeScript", "Type Guards", "Runtime Validation"]
    });
  } else {
    questions.push({
      id: 'q-tech-2',
      category: 'Technical',
      difficulty: 'Easy',
      question: `What are the core differences between using modular templates and inline structures in ${secondarySkill}?`,
      contextReasoning: `Asked because you listed ${secondarySkill} as a core skill on your resume.`,
      keyTopics: [secondarySkill, "Architecture", "Best Practices"]
    });
  }

  questions.push({
    id: 'q-tech-3',
    category: 'Technical',
    difficulty: 'Medium',
    question: `Describe the caching strategies or query optimizations you would apply to minimize database locks when scaling a ${targetRole} service.`,
    contextReasoning: `Tailored to your target profile as a ${experienceLevel}-level ${targetRole}.`,
    keyTopics: ["Caching", "Database Locks", "Scale"]
  });

  questions.push({
    id: 'q-beh-1',
    category: 'Behavioral',
    difficulty: 'Medium',
    question: `Tell me about a time at ${company} when you encountered a technical blocker during a sprint. How did you align with your team to deliver?`,
    contextReasoning: `Asked because you listed working as a ${role} at ${company} on your resume.`,
    keyTopics: ["STAR Method", "Blockers", "Team Alignment"]
  });

  questions.push({
    id: 'q-beh-2',
    category: 'Behavioral',
    difficulty: 'Hard',
    question: "Describe a scenario where you disagreed with a product design direction or an architectural decision. How did you resolve the conflict?",
    contextReasoning: "Standard behavioral evaluation to check your leadership and product empathy.",
    keyTopics: ["Conflict Resolution", "Architecture", "Communication"]
  });

  questions.push({
    id: 'q-sys-1',
    category: 'System Design',
    difficulty: 'Hard',
    question: `How would you design a highly available, fault-tolerant PDF parsing queue that can process 10,000 resume uploads per hour with real-time status updates?`,
    contextReasoning: "System Design test matched to the context of the AI Resume Assistant pipeline.",
    keyTopics: ["Message Queues", "Scalability", "Fault Tolerance", "Websockets"]
  });

  if (skillsList.includes('Node.js') || skillsList.includes('Express')) {
    questions.push({
      id: 'q-sys-2',
      category: 'System Design',
      difficulty: 'Medium',
      question: "How would you design an API gateway authentication layer to handle HttpOnly cookie verification and token rotation across microservices?",
      contextReasoning: "Asked because your profile lists Node.js backend experience.",
      keyTopics: ["API Gateway", "JWT Verification", "Session Security"]
    });
  }

  const highlight = resume.experience[0]?.highlights[0] || 'collaborating on frontend features';
  questions.push({
    id: 'q-res-1',
    category: 'Resume Deep Dive',
    difficulty: 'Medium',
    question: `In your role as ${role} at ${company}, you mentioned: "${highlight}". Can you elaborate on the metrics or outcomes of that task?`,
    contextReasoning: `Direct resume highlight check: "${highlight}".`,
    keyTopics: ["Metrics", "Optimization", "Business Impact"]
  });

  questions.push({
    id: 'q-res-2',
    category: 'Resume Deep Dive',
    difficulty: 'Medium',
    question: `Looking at your education at ${resume.education[0]?.institution || 'your college'}, how did your academic courses prepare you for the SDE responsibilities?`,
    contextReasoning: `Tailored check based on your degree in ${resume.education[0]?.degree || 'Computer Science'}.`,
    keyTopics: ["Education", "Fundamental Algorithms"]
  });

  return questions;
};

export const generateQuestionsList = async (resume, targetRole, experienceLevel) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return generateQuestionsLocally(resume, targetRole, experienceLevel);
  }

  try {
    return generateQuestionsLocally(resume, targetRole, experienceLevel);
  } catch (err) {
    return generateQuestionsLocally(resume, targetRole, experienceLevel);
  }
};
