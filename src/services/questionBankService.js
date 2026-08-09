/**
 * Categorized Question Bank Service
 * Manages question metadata, category filters, difficulty badges, and bookmark/practice persistence.
 */

export const INITIAL_QUESTIONS = [
  // 1. React Category
  {
    id: 'q-react-1',
    category: 'React',
    title: 'Custom Hooks & State Encapsulation',
    difficulty: 'Medium',
    estimatedTime: '15 mins',
    description: 'Design a reusable `useAsync` custom hook in React that manages pending, resolved, and rejected request states with automatic cancellation on unmount.',
    constraints: ['Must handle memory leaks on component unmount.', 'Must return { data, loading, error, execute }.'],
    practiced: true,
    bookmarked: false,
    codeTemplate: `import { useState, useEffect, useCallback } from 'react';\n\nexport function useAsync(asyncFunction) {\n  // TODO: Implement custom async hook\n}`
  },
  {
    id: 'q-react-2',
    category: 'React',
    title: 'Virtual DOM & Fiber Reconciliation',
    difficulty: 'Easy',
    estimatedTime: '10 mins',
    description: 'Explain how React Fiber reconciler prioritizes user input events over non-urgent background render passes.',
    constraints: ['Contrast Stack reconciler vs Fiber reconciler.', 'Explain lane priorities.'],
    practiced: false,
    bookmarked: true,
    codeTemplate: `// Explain Virtual DOM diffing algorithm in detail`
  },

  // 2. System Design Category
  {
    id: 'q-sys-1',
    category: 'System Design',
    title: 'Distributed Rate Limiter (10k QPS)',
    difficulty: 'Hard',
    estimatedTime: '25 mins',
    description: 'Design a scalable, low-latency API rate limiting service handling 10,000 requests per second across multiple regional microservices.',
    constraints: ['Latency under 5ms per check.', 'Support Sliding Window Log or Token Bucket algorithm.'],
    practiced: false,
    bookmarked: fontBookmarkState('q-sys-1'),
    architecturalPrompt: {
      checklist: [
        'API Gateway placement & Redis Sentinel / Cluster cache layer',
        'Token Bucket vs Sliding Window Counter trade-offs',
        'Handling race conditions using Redis Lua scripts',
        'Graceful 429 Too Many Requests response headers'
      ]
    }
  },
  {
    id: 'q-sys-2',
    category: 'System Design',
    title: 'Notification Platform Architecture',
    difficulty: 'Hard',
    estimatedTime: '30 mins',
    description: 'Architect a multi-channel notification engine supporting Push, SMS, and Email delivery with idempotency guarantees.',
    constraints: ['At-least-once delivery guarantee.', 'Message queue decoupling (Kafka/RabbitMQ).'],
    practiced: true,
    bookmarked: false,
    architecturalPrompt: {
      checklist: [
        'Message producer & Kafka topic partitioning strategy',
        'Third-party provider fallbacks (Twilio, SendGrid)',
        'Idempotency key storage with DB unique indexes',
        'Dead Letter Queue (DLQ) retry handlers'
      ]
    }
  },

  // 3. Algorithms Category
  {
    id: 'q-algo-1',
    category: 'Algorithms',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Easy',
    estimatedTime: '12 mins',
    description: 'Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers such that they add up to a specific target.',
    constraints: ['Space complexity must be O(1).', 'Time complexity O(N).'],
    practiced: true,
    bookmarked: false,
    codeTemplate: `function twoSum(numbers, target) {\n  let left = 0, right = numbers.length - 1;\n  // TODO: Implement 2-pointer scan\n}`
  },
  {
    id: 'q-algo-2',
    category: 'Algorithms',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    estimatedTime: '20 mins',
    description: 'Given a string `s`, return the longest palindromic substring in `s`.',
    constraints: ['1 <= s.length <= 1000', 'Target O(N^2) or Manacher O(N).'],
    practiced: false,
    bookmarked: true,
    codeTemplate: `function longestPalindrome(s) {\n  // Expand around center approach\n}`
  },

  // 4. Behavioral Category
  {
    id: 'q-beh-1',
    category: 'Behavioral',
    title: 'Resolving Architectural Disagreements',
    difficulty: 'Medium',
    estimatedTime: '15 mins',
    description: 'Describe a situation where you had a strong technical disagreement with a senior engineer or architect regarding system design. How did you align on a resolution?',
    constraints: ['Format answer using STAR method (Situation, Task, Action, Result).', 'Emphasize data-driven trade-off analysis.'],
    practiced: true,
    bookmarked: false,
    starRubric: {
      situation: 'Clear context on project scope & team dynamics',
      task: 'The specific technical impasse',
      action: 'Data-driven benchmarking, RFC proposal, prototyping',
      result: 'Outcome, metrics improved, relationship impact'
    }
  },
  {
    id: 'q-beh-2',
    category: 'Behavioral',
    title: 'Handling Production Outages & PM Communication',
    difficulty: 'Hard',
    estimatedTime: '18 mins',
    description: 'Tell me about a high-severity production incident you led. How did you triage the outage, communicate with stakeholders, and execute the post-mortem?',
    constraints: ['Must cover root cause analysis (RCA).', 'Highlight preventive action items.'],
    practiced: false,
    bookmarked: true,
    starRubric: {
      situation: 'P0 outage scope and business impact',
      task: 'Incident commander responsibilities',
      action: 'Rollback strategy, status channel updates, RCA writeup',
      result: 'MTTR achieved and permanent guardrails added'
    }
  },

  // 5. Aptitude Category
  {
    id: 'q-apt-1',
    category: 'Aptitude',
    title: 'Work, Pipes & Cisterns Efficiency',
    difficulty: 'Easy',
    estimatedTime: '8 mins',
    description: 'Pipe A can fill a tank in 12 hours and Pipe B can empty it in 18 hours. If both pipes are opened simultaneously, how long will it take to fill the tank?',
    constraints: ['Solve using net fraction work rate formula.'],
    practiced: true,
    bookmarked: false
  }
];

function fontBookmarkState(id) {
  try {
    const saved = localStorage.getItem(`bookmark_${id}`);
    return saved === 'true';
  } catch {
    return false;
  }
}

/**
 * Filter questions by category, difficulty, state filter, and search term
 */
export function getFilteredQuestions({ category = 'All', difficulty = 'All', stateFilter = 'All', search = '' }) {
  return INITIAL_QUESTIONS.filter(q => {
    // 1. Category Filter
    if (category !== 'All' && q.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // 2. Difficulty Filter
    if (difficulty !== 'All' && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
      return false;
    }

    // 3. State Filter ('Practiced', 'Bookmarked')
    if (stateFilter === 'Practiced' && !q.practiced) {
      return false;
    }
    if (stateFilter === 'Bookmarked' && !q.bookmarked) {
      return false;
    }

    // 4. Search term matching
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(term);
      const matchDesc = q.description.toLowerCase().includes(term);
      const matchCat = q.category.toLowerCase().includes(term);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });
}
