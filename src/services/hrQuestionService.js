/**
 * HR / Behavioral question generator service
 */

export const generateHRQuestions = (roleContext, cultureProfile, focusAreas) => {
  const questions = [];

  const focusMap = {
    conflict: [
      {
        id: 'hr-c-1',
        category: 'Behavioral',
        question: 'Tell me about a time when you had a disagreement with a technical decision made by a team lead. How did you advocate for your approach?',
        expectedCriteria: 'STAR structure, active collaboration, focus on architectural outcomes rather than ego.'
      },
      {
        id: 'hr-c-2',
        category: 'Behavioral',
        question: 'How do you handle situation when a teammate is not pulling their weight during a critical sprint deadline?',
        expectedCriteria: 'Direct constructive feedback, alignment of tasks, empathy.'
      }
    ],
    adaptability: [
      {
        id: 'hr-a-1',
        category: 'Behavioral',
        question: 'Describe a project where requirements shifted midway. How did you re-prioritize your tasks and deliver?',
        expectedCriteria: 'Adaptability index, agile task switching, alignment of expectations with product managers.'
      },
      {
        id: 'hr-a-2',
        category: 'Behavioral',
        question: 'Tell me about a time you had to learn a completely new framework or tool within a compressed timeline.',
        expectedCriteria: 'Fast tracking fundamentals, building quick mock prototypes, tracking self-learning metrics.'
      }
    ],
    time_management: [
      {
        id: 'hr-t-1',
        category: 'Behavioral',
        question: 'How do you manage competing deadlines when multiple stakeholders request hotfixes simultaneously?',
        expectedCriteria: 'Priority matrices, clear communication loops, blocking context switches.'
      }
    ],
    growth: [
      {
        id: 'hr-g-1',
        category: 'Behavioral',
        question: 'Where do you see your technical leadership skills evolving over the next two years? What goals have you set?',
        expectedCriteria: 'Clear career roadmap, interest in mentoring, tech alignment goals.'
      }
    ]
  };

  // Compile question set
  focusAreas.forEach(area => {
    if (focusMap[area]) {
      questions.push(...focusMap[area]);
    }
  });

  // Default behavioral questions
  if (questions.length === 0) {
    questions.push(
      {
        id: 'hr-d-1',
        category: 'Behavioral',
        question: 'Why are you interested in joining our team, and how does your past background align with this role?',
        expectedCriteria: 'Clear company research, alignment of past highlights to core job responsibilities.'
      },
      {
        id: 'hr-d-2',
        category: 'Behavioral',
        question: 'Describe your ideal team working environment and culture.',
        expectedCriteria: 'Collaborative focus, trust, open feedback pipelines.'
      }
    );
  }

  // Inject culture contextual follow-ups
  const suffixMap = {
    startup: ' How does this approach fit into a high-ownership, fast-paced startup ecosystem?',
    enterprise: ' How do you ensure this alignment scales across multi-layered enterprise stakeholder teams?',
    agency: ' How do you balance this with strict external client SLA boundaries?'
  };

  const suffix = suffixMap[cultureProfile] || '';

  return questions.map((q, idx) => ({
    ...q,
    id: `hr-q-${idx + 1}`,
    question: q.question + suffix,
    keyTopics: ['STAR Method', roleContext, cultureProfile]
  }));
};
