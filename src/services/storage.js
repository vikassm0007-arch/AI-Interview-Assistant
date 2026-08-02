// LocalStorage key constants
const HISTORY_STORAGE_KEY = 'intervue_history';

// Seed mock history session data for demonstration
const mockSessions = [
  // 1. HR Behavioral Session
  {
    id: 'session-seed-1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    roleTitle: 'Frontend Developer (Startup)',
    experienceLevel: 'Mid',
    totalScore: 84,
    durationSeconds: 780, // 13 mins
    questionsCount: 3,
    status: 'completed',
    interviewMode: 'HR',
    hrMetadata: {
      starCompletenessScore: 88,
      communicationTone: 'Confident & Collaborative',
      cultureFitRating: 85
    },
    questions: [
      {
        questionId: 'q-1',
        category: 'Behavioral',
        questionText: 'Can you describe a time when you had to optimize the performance of a React web application?',
        candidateAnswer: 'Yeah, absolutely. So we had a large list rendering in a dashboard that was really slow. I profile it using React DevTools and noticed that every keypress was triggering rerenders on all list elements. I resolved it by virtualization using react-window, memoizing list item components, and lazy loading the off-screen items.',
        timeSpentSeconds: 240,
        aiFeedback: {
          score: 88,
          strengths: [
            "Clear description of diagnostic methods using profiling tools.",
            "Correct application of React performance optimization patterns (virtualization, memoization)."
          ],
          improvements: [
            "Could have elaborated on the exact metrics (e.g. before/after render time in ms)."
          ],
          idealAnswer: "An ideal response details: (1) Diagnosis using Chrome DevTools or React Profiler. (2) Specific bottlenecks identified (e.g. unmemoized context providers, layout shifts). (3) The solution applied (e.g. state colocation, useMemo/useCallback, virtualized scroll list). (4) Quantitative results (e.g. 'rendered list size of 10,000 items went from 500ms paint delay to 16ms')."
        }
      },
      {
        questionId: 'q-2',
        category: 'Behavioral',
        questionText: 'What is the difference between useMemo and useCallback? When would you use one over the other?',
        candidateAnswer: 'useMemo returns a memoized value, while useCallback returns a memoized function callback. You use useCallback to prevent functions from being recreated on every render, which is helpful when passing functions down to memoized children to avoid breaks in shallow comparisons.',
        timeSpentSeconds: 180,
        aiFeedback: {
          score: 92,
          strengths: [
            "Concise and accurate differentiation between values and functions.",
            "Correct description of how useCallback preserves references for child dependency arrays."
          ],
          improvements: [
            "Explain that memoization carries garbage collection overhead and shouldn't be applied blindly to every inline function."
          ],
          idealAnswer: "useMemo caches the result of a calculation between renders: `const val = useMemo(() => computeValue(a), [a])`. useCallback caches the function definition itself: `const fn = useCallback(() => doSomething(), [])`. Use them when passing functions/values as dependencies to other hooks (like useEffect) or to memoized components (`React.memo`) to maintain referential identity."
        }
      },
      {
        questionId: 'q-3',
        category: 'Behavioral',
        questionText: 'Tell me about a time at Innovation Hub Labs when you encountered a technical blocker during a sprint. How did you align with your team?',
        candidateAnswer: 'We had a third-party payment gateway integration block that was completely undocumented, stalling our checkout pipeline. I scheduled a call with senior architects, proposed mock adapters to isolate the failure block, and got checkout code running in parallel while backend engineers resolved gateway tokens.',
        timeSpentSeconds: 360,
        aiFeedback: {
          score: 72,
          strengths: [
            "Good team collaboration initiative and adaptive planning.",
            "Action oriented task resolution."
          ],
          improvements: [
            "Try to follow the STAR structure more explicitly. Elaborate on the business impact of checkout delays."
          ],
          idealAnswer: "Structure using STAR: Situation (Checkout gateway was down, risking 15% drop-off), Task (Bypass blocker to unfreeze QA timelines), Action (Designed mock adapter middleware, aligned with QA leads, ran tests), Result (Checkout code shipped 2 days early, payment bugs caught pre-release)."
        }
      }
    ]
  },
  // 2. Technical Session
  {
    id: 'session-seed-2',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    roleTitle: 'React, System Design - Senior',
    experienceLevel: 'Senior',
    totalScore: 91,
    durationSeconds: 1140, // 19 mins
    questionsCount: 1,
    status: 'completed',
    interviewMode: 'TECHNICAL',
    technicalMetadata: {
      selectedSkills: ["React", "System Design"],
      difficulty: "Senior",
      codeSubmissions: [
        "// React Senior Undo Hook challenge\nimport { useState, useCallback } from 'react';\n\nexport function useHistoryState(initialValue) {\n  const [state, setState] = useState(initialValue);\n  const [history, setHistory] = useState([initialValue]);\n  const [pointer, setPointer] = useState(0);\n\n  const set = useCallback((next) => {\n    const val = typeof next === 'function' ? next(state) : next;\n    const nextHistory = history.slice(0, pointer + 1);\n    setHistory([...nextHistory, val]);\n    setPointer(nextHistory.length);\n    setState(val);\n  }, [history, pointer, state]);\n\n  const undo = useCallback(() => {\n    if (pointer > 0) {\n      setPointer(pointer - 1);\n      setState(history[pointer - 1]);\n    }\n  }, [history, pointer]);\n\n  const redo = useCallback(() => {\n    if (pointer < history.length - 1) {\n      setPointer(pointer + 1);\n      setState(history[pointer + 1]);\n    }\n  }, [history, pointer]);\n\n  return [state, { set, undo, redo }];\n}"
      ],
      testCasesPassed: 1
    },
    questions: [
      {
        questionId: 'q-tech-1',
        category: 'Technical',
        questionText: 'Design a custom state controller hook supporting undo/redo action histories.',
        candidateAnswer: 'I implemented this useHistoryState custom hook in React. It stores the state value list in a history array and tracks the pointer index. When the user sets a new state, we discard any redo states beyond the cursor and append the new state. Undo and redo move the cursor.',
        timeSpentSeconds: 1140,
        aiFeedback: {
          score: 91,
          strengths: [
            "Excellent design of custom hook dependencies.",
            "Handled redo history slicing correctly to avoid memory leaks."
          ],
          improvements: [
            "Consider adding boundaries limits on the history array size to avoid high memory spikes."
          ],
          idealAnswer: "The ideal answer designs a custom hook returning state and controllers. When setting values, slice the history up to the cursor and append: `history.slice(0, index + 1)`. Use `useCallback` to maintain referential identity of undo, redo, and set functions."
        }
      }
    ]
  }
];

/**
 * Load all saved sessions from LocalStorage
 */
export const getInterviewHistory = () => {
  const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(mockSessions));
    return mockSessions;
  }
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to parse storage sessions', err);
    return [];
  }
};

/**
 * Save a new interview session
 */
export const saveInterviewSession = async (session) => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const history = getInterviewHistory();
  const newSession = {
    ...session,
    id: 'session-' + Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString()
  };

  history.unshift(newSession);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  return newSession;
};

/**
 * Delete a session by ID
 */
export const deleteInterviewSession = (id) => {
  const history = getInterviewHistory();
  const filtered = history.filter(s => s.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

/**
 * Export history dataset as JSON download file
 */
export const exportSessionToJsonFile = (session) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `intervue_session_${session.id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
