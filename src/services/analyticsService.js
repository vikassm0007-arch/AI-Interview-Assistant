import { getInterviewHistory } from './storage';

// 10+ past mock sessions spanning the last 30 days for rich charts population
const mockPastSessions = [
  {
    id: 'h-1',
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'React Developer',
    totalScore: 68,
    durationSeconds: 900,
    interviewMode: 'TECHNICAL',
    technicalScore: 65,
    communicationScore: 72,
    domain: 'React Context API'
  },
  {
    id: 'h-2',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'Behavioral Prep',
    totalScore: 70,
    durationSeconds: 600,
    interviewMode: 'HR',
    technicalScore: 0,
    communicationScore: 75,
    domain: 'STAR Alignment'
  },
  {
    id: 'h-3',
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'SQL Databases',
    totalScore: 72,
    durationSeconds: 840,
    interviewMode: 'TECHNICAL',
    technicalScore: 74,
    communicationScore: 70,
    domain: 'Query Optimization'
  },
  {
    id: 'h-4',
    date: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'System Design Basic',
    totalScore: 71,
    durationSeconds: 1100,
    interviewMode: 'TECHNICAL',
    technicalScore: 68,
    communicationScore: 74,
    domain: 'Database Replication'
  },
  {
    id: 'h-5',
    date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'Conflict HR Session',
    totalScore: 76,
    durationSeconds: 650,
    interviewMode: 'HR',
    technicalScore: 0,
    communicationScore: 78,
    domain: 'STAR Alignment'
  },
  {
    id: 'h-6',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'React Hooks Deep Dive',
    totalScore: 82,
    durationSeconds: 960,
    interviewMode: 'TECHNICAL',
    technicalScore: 84,
    communicationScore: 80,
    domain: 'Custom Hooks'
  },
  {
    id: 'h-7',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'Pacing & Behavioral',
    totalScore: 81,
    durationSeconds: 700,
    interviewMode: 'HR',
    technicalScore: 0,
    communicationScore: 85,
    domain: 'STAR Alignment'
  },
  {
    id: 'h-8',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'Python Algorithms',
    totalScore: 85,
    durationSeconds: 1200,
    interviewMode: 'TECHNICAL',
    technicalScore: 88,
    communicationScore: 82,
    domain: 'Data Structures'
  },
  {
    id: 'h-9',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'System Design Scaling',
    totalScore: 89,
    durationSeconds: 1400,
    interviewMode: 'TECHNICAL',
    technicalScore: 91,
    communicationScore: 86,
    domain: 'Load Balancing'
  },
  {
    id: 'h-10',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    roleTitle: 'Salary Negotiation HR',
    totalScore: 87,
    durationSeconds: 500,
    interviewMode: 'HR',
    technicalScore: 0,
    communicationScore: 92,
    domain: 'STAR Alignment'
  }
];

export const getAggregatedAnalytics = (timeFilter, modeFilter) => {
  // Load real history, fallback to seeding if history is small
  const realHistory = getInterviewHistory();
  
  // Combine real and mock histories to ensure 10+ sessions
  let sessions = [...realHistory];
  if (sessions.length < 8) {
    // Merge mock sessions if history is sparse
    sessions = [...sessions, ...mockPastSessions];
  }

  // Deduplicate by ID to avoid seed overlays
  const seen = new Set();
  sessions = sessions.filter(s => {
    const double = seen.has(s.id);
    seen.add(s.id);
    return !double;
  });

  // Sort chronological ascending
  sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 1. Time Filter range check
  const now = Date.now();
  const timeLimitMap = {
    '7days': 7 * 24 * 60 * 60 * 1000,
    '30days': 30 * 24 * 60 * 60 * 1000,
    '6months': 180 * 24 * 60 * 60 * 1000
  };

  const selectedLimit = timeLimitMap[timeFilter];
  let filtered = sessions.filter(s => {
    if (!selectedLimit) return true;
    const sessionTime = new Date(s.date).getTime();
    return (now - sessionTime) <= selectedLimit;
  });

  // 2. Track / Mode switcher check
  filtered = filtered.filter(s => {
    const sMode = s.interviewMode || 'HR';
    if (modeFilter === 'TECHNICAL') return sMode === 'TECHNICAL';
    if (modeFilter === 'HR') return sMode === 'HR';
    return true;
  });

  // 3. Summaries computation
  const totalMockInterviews = filtered.length;
  const averageScore = totalMockInterviews > 0
    ? Math.round(filtered.reduce((acc, s) => acc + s.totalScore, 0) / totalMockInterviews)
    : 0;

  const totalTimeSeconds = filtered.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  const totalPracticeTimeHours = (totalTimeSeconds / 3600).toFixed(1);

  // Streak & Consistency (mocking 5-day streak placeholder)
  const currentStreak = 5;

  // Overall Readiness Index (weighted average of recent sessions)
  let readinessScore = averageScore;
  if (filtered.length > 0) {
    const recent = filtered.slice(-3);
    const sum = recent.reduce((acc, s) => acc + s.totalScore, 0);
    readinessScore = Math.round(sum / recent.length);
  }

  // 4. Line Chart Trend dataset
  const lineChartData = filtered.map(s => {
    const sMode = s.interviewMode || 'HR';
    const overall = s.totalScore;
    const technical = s.technicalScore || (sMode === 'TECHNICAL' ? overall : Math.round(overall * 0.8));
    const communication = s.communicationScore || (sMode === 'HR' ? overall : Math.round(overall * 0.9));

    return {
      date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      technical,
      communication,
      overall,
      title: s.roleTitle
    };
  });

  // 5. Domain Bar Charts
  const domainScoreMap = {};
  filtered.forEach(s => {
    // Map roles to key domains
    let domain = 'React & CSS';
    if (s.roleTitle.toLowerCase().includes('database') || s.roleTitle.toLowerCase().includes('sql')) {
      domain = 'SQL Tuning';
    } else if (s.roleTitle.toLowerCase().includes('design') || s.roleTitle.toLowerCase().includes('scale')) {
      domain = 'System Design';
    } else if (s.roleTitle.toLowerCase().includes('behavioral') || s.roleTitle.toLowerCase().includes('salary') || s.interviewMode === 'HR') {
      domain = 'HR STAR Fit';
    } else if (s.roleTitle.toLowerCase().includes('hook') || s.roleTitle.toLowerCase().includes('react')) {
      domain = 'React State';
    } else if (s.roleTitle.toLowerCase().includes('python') || s.roleTitle.toLowerCase().includes('algorithm')) {
      domain = 'Algorithms';
    }

    if (!domainScoreMap[domain]) {
      domainScoreMap[domain] = { sum: 0, count: 0 };
    }
    domainScoreMap[domain].sum += s.totalScore;
    domainScoreMap[domain].count += 1;
  });

  const barChartData = Object.keys(domainScoreMap).map(domain => ({
    domain,
    score: Math.round(domainScoreMap[domain].sum / domainScoreMap[domain].count)
  }));

  // Default fallbacks if empty
  if (barChartData.length === 0) {
    barChartData.push(
      { domain: 'React Components', score: 82 },
      { domain: 'System Design', score: 68 },
      { domain: 'STAR Alignment', score: 85 }
    );
  }

  // 6. Skill breakdowns: Strong vs. Weak areas
  const strongAreas = [
    { topic: "React Custom Hooks Hooks", mastery: 92, quote: "Excellent use of history state undo/redo patterns." },
    { topic: "STAR Method Contexts", mastery: 88, quote: "Well-structured behavioral outlines with clear numeric metrics." },
    { topic: "SQL Query Optimizations", mastery: 85, quote: "Sound schema decisions and database caching structures." }
  ];

  const weakAreas = [
    { topic: "System Design Scalability", score: 65, impact: "High Impact", rootCause: "Missing edge-case scaling analysis and replication trade-offs" },
    { topic: "Behavioral Conversational Pauses", score: 68, impact: "Medium Impact", rootCause: "Slight hesitation and starter word loops ('um', 'so yeah')" }
  ];

  // Recommendations next steps study roadmaps
  const suggestions = [
    {
      title: "Practice a System Design Mock Interview",
      type: "design",
      desc: "Boost your scalability score (currently 65%) by practicing multi-master partition questions.",
      linkTopic: "System Design"
    },
    {
      title: "Take a Custom React Hook Practice Session",
      type: "coding",
      desc: "Consolidate your 92% mastery in hook workflows by building custom state history limits.",
      linkTopic: "React"
    }
  ];

  return {
    totalMockInterviews,
    averageScore,
    totalPracticeTimeHours,
    currentStreak,
    readinessScore,
    lineChartData,
    barChartData,
    strongAreas,
    weakAreas,
    suggestions
  };
};
