import Interview from '../models/Interview.js';

const interviewData = {
  frontend: [
    { category: "Behavioral", question: "Can you describe a time when you had to optimize the performance of a React web application?" },
    { category: "Technical", question: "What is the difference between useMemo and useCallback? When would you use one over the other?" },
    { category: "Accessibility", question: "How do you approach ensuring a web application is accessible to users with screen readers?" }
  ],
  backend: [
    { category: "Behavioral", question: "Tell me about a time you had to debug a production database bottleneck. How did you resolve it?" },
    { category: "Architecture", question: "How would you design a scalable notification system that can handle 10,000 requests per second?" },
    { category: "Caching", question: "Explain how Redis caching works and the strategies you would use for cache invalidation." }
  ],
  uiux: [
    { category: "Portfolio", question: "Walk me through your design process for a mobile dashboard feature from discovery to handoff." },
    { category: "Heuristics", question: "How do you apply Nielsen's usability heuristics to simplify a complex, data-heavy dashboard?" },
    { category: "Critique", question: "What are the common UI/UX mistakes you notice in AI chat systems today, and how would you solve them?" }
  ],
  fullstack: [
    { category: "Behavioral", question: "Tell me about a project where you had to quickly learn a new technology stack to deliver a feature." },
    { category: "Database", question: "How do you handle migrations in a live production database with minimal downtime?" },
    { category: "Security", question: "What security measures do you implement to protect a REST API against common vulnerabilities?" }
  ]
};

// @desc    Start new mock interview session
// @route   POST /api/interviews/start
export const startInterviewSession = async (req, res) => {
  try {
    const { role, type, difficulty } = req.body;

    if (!role || !type || !difficulty) {
      return res.status(400).json({ message: 'Please provide role, type, and difficulty' });
    }

    const questions = interviewData[role] || interviewData.frontend;

    const interview = await Interview.create({
      userId: req.user ? req.user.id : null,
      role,
      type,
      difficulty,
      questions
    });

    res.status(201).json({
      sessionId: interview._id,
      questions: interview.questions,
      role: interview.role,
      type: interview.type
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit transcript responses & calculate heuristics report
// @route   POST /api/interviews/:id/submit
export const submitInterviewSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { transcript } = req.body;

    if (!transcript || !Array.isArray(transcript)) {
      return res.status(400).json({ message: 'Please provide an array of transcript dialogues' });
    }

    const session = await Interview.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Mock speech evaluation heuristics calculation
    let fillerWordCount = 0;
    transcript.forEach(line => {
      if (line.text) {
        const words = line.text.toLowerCase().split(' ');
        fillerWordCount += words.filter(w => w === 'so' || w === 'like' || w === 'um' || w === 'uh').length;
      }
    });

    // Calculate score details
    const technicalAccuracy = Math.floor(Math.random() * 15) + 80; // 80 - 95
    const communicationClarity = Math.max(50, 95 - (fillerWordCount * 4)); 
    const starCompliance = 90;
    const overallScore = Math.floor((technicalAccuracy + communicationClarity + starCompliance) / 3);

    const actionItems = [
      "Minimize repetitive introductory filler words (e.g. 'So yeah') during technical segments.",
      "Excellent explanation structure describing DOM virtualization loops.",
      "Slowing down speaking pace slightly will yield higher confidence scores."
    ];

    session.transcript = transcript;
    session.score = overallScore;
    session.evalDetails = {
      technicalAccuracy,
      communicationClarity,
      starCompliance,
      actionItems
    };

    await session.save();

    res.json({
      _id: session._id,
      score: session.score,
      evalDetails: session.evalDetails,
      transcript: session.transcript,
      message: 'Interview session evaluated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get interview session by ID
// @route   GET /api/interviews/:id
export const getInterviewSession = async (req, res) => {
  try {
    const session = await Interview.findById(req.params.id);
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ message: 'Interview session report card not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all interview session records (history)
// @route   GET /api/interviews/history
export const getInterviewHistory = async (req, res) => {
  try {
    const filter = req.user ? { userId: req.user.id } : {};
    const history = await Interview.find(filter).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
