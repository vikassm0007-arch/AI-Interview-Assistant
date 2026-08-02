/**
 * Technical / Skill-Based question generator service
 */

const questionsDatabase = {
  React: {
    Junior: [
      {
        question: "Explain the React Component Lifecycle hooks and what useEffect accomplishes.",
        codeTemplate: `// React Junior Component Hook challenge\nimport React, { useState, useEffect } from 'react';\n\nexport default function Timer() {\n  const [count, setCount] = useState(0);\n\n  // TODO: Implement a counter that increments every second when mounted\n  useEffect(() => {\n    \n  }, []);\n\n  return <div>{count}</div>;\n}`,
        constraints: ["Must clear interval on unmount to avoid leaks."],
        testCases: [{ input: "mount", expected: "starts interval" }],
        hint1: "Use setInterval inside the hook.",
        hint2: "Return a cleanup function clearing the interval handle."
      }
    ],
    Mid: [
      {
        question: "Optimize a large list rendering component to avoid rerendering items that have not changed.",
        codeTemplate: `// React optimization challenge\nimport React from 'react';\n\n// TODO: Memoize list item rows to check reference equality of props\nconst ListItem = ({ item }) => {\n  return <li>{item.name}</li>;\n};\n\nexport default function LargeList({ items }) {\n  return <ul>{items.map(item => <ListItem key={item.id} item={item} />)}</ul>;\n}`,
        constraints: ["Items must only rerender if their data changes."],
        testCases: [{ input: "render", expected: "prevents duplicate paints" }],
        hint1: "React.memo handles shallow prop checks.",
        hint2: "Pass custom compare callbacks if item objects are deeply nested."
      }
    ],
    Senior: [
      {
        question: "Design a custom state controller hook supporting undo/redo action histories.",
        codeTemplate: `// React Senior Undo Hook challenge\nimport { useState, useCallback } from 'react';\n\nexport function useHistoryState(initialValue) {\n  const [state, setState] = useState(initialValue);\n  const [history, setHistory] = useState([initialValue]);\n  const [pointer, setPointer] = useState(0);\n\n  // TODO: Implement set, undo, and redo callbacks maintaining limits\n  \n  return [state, { set: () => {}, undo: () => {}, redo: () => {} }];\n}`,
        constraints: ["Undo/redo bounds should respect history pointer arrays.", "Must not duplicate consecutive duplicate states."],
        testCases: [{ input: "set(1)->set(2)->undo()", expected: "returns 1" }],
        hint1: "Maintain a history array of states and a cursor pointer index.",
        hint2: "When setting a new state, slice history up to the current pointer to discard redone states."
      }
    ]
  },
  "System Design": {
    Senior: [
      {
        question: "Design a highly available, globally distributed file conversion service (PDF parser).",
        codeTemplate: `## Architectural System Design Document\n\n### 1. High-Level Diagram Description\nOutline how clients authenticate, where file uploads are buffered, and how workers pull jobs.\n\n### 2. Bottlenecks & Scale\nDetail horizontal scaling plans for PDF parse jobs.\n\n[Write details here...]`,
        constraints: ["System must scale up to 10,000 files/hour.", "Ensure maximum 5s conversion latency."],
        testCases: [{ input: "scale", expected: "load balancer queues" }],
        hint1: "Decouple upload pipelines from extraction parsing using SQS/RabbitMQ queues.",
        hint2: "Leverage AWS Lambda or isolated serverless triggers for PDF text parsing tasks."
      }
    ]
  }
};

export const generateTechnicalQuestions = (selectedSkills, difficulty, format) => {
  const questions = [];

  // Match skills to DB
  selectedSkills.forEach(skill => {
    const skillSet = questionsDatabase[skill];
    if (skillSet && skillSet[difficulty]) {
      questions.push(...skillSet[difficulty]);
    }
  });

  // Default tech questions
  if (questions.length === 0) {
    questions.push({
      question: `Implement a function to parse key-value elements from a query string.`,
      codeTemplate: `// Parse Query String challenge\nfunction parseQuery(url) {\n  // TODO: Extract parameters and return structured object\n  const params = {};\n  \n  return params;\n}`,
      constraints: ["Should handle url encoded keys.", "Should parse duplicate keys into arrays."],
      testCases: [{ input: "?a=1&b=2", expected: "{a: '1', b: '2'}" }],
      hint1: "Use split('&') or URLSearchParams.",
      hint2: "Make sure to decode values using decodeURIComponent."
    });
  }

  return questions.map((q, idx) => ({
    id: `tech-q-${idx + 1}`,
    category: 'Technical',
    question: q.question,
    keyTopics: [...selectedSkills, difficulty, format],
    codeTemplate: q.codeTemplate,
    constraints: q.constraints,
    testCases: q.testCases,
    hint1: q.hint1,
    hint2: q.hint2
  }));
};
