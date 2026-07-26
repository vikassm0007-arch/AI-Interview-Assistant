import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, LogOut, ArrowRight, Play, MessageSquare, AlertCircle, Volume2, HelpCircle, CornerDownLeft, Sparkles, X } from 'lucide-react';

export default function Interview() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const role = location.state?.role || 'frontend';

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

  const simulatedAnswers = [
    "Yeah, absolutely. So we had a large list rendering in a dashboard that was really slow. I fixed it by implementing list virtualization using React Window, which cut rendering down to under 10ms. Also, we had some heavy computations that I memoized with useMemo.",
    "So useMemo returns a memoized value, while useCallback returns a memoized callback function. I use useMemo for heavy calculations to avoid running them on every render, and useCallback to prevent unnecessary re-renders of child components that receive callbacks as props.",
    "I focus on writing HTML5 semantic tags, ensuring correct alternative descriptors for image media, and using ARIA attributes where custom controls are needed. I also enforce automated contrast checking."
  ];

  const questions = interviewData[role] || interviewData.frontend;
  const [qIndex, setQIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [speechText, setSpeechText] = useState('Click the "Simulate Answer" button below to mock speaking, or type in your response.');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [history, setHistory] = useState([]);
  
  const [waveHeights, setWaveHeights] = useState([60, 60, 60, 60, 60]);
  
  const timerRef = useRef(null);
  const waveIntervalRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Trigger AI speaking animation on start of each question
  useEffect(() => {
    setIsAiSpeaking(true);
    const duration = 3000; // AI speaks for 3 seconds
    const timeout = setTimeout(() => {
      setIsAiSpeaking(false);
    }, duration);

    startTimer();

    return () => {
      clearTimeout(timeout);
      stopTimer();
    };
  }, [qIndex]);

  const startTimer = () => {
    stopTimer();
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
  };

  const toggleMic = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const simulateSpeaking = () => {
    if (isMuted) {
      alert("Please unmute your microphone to answer!");
      return;
    }
    if (isListening || isAiSpeaking) return;

    setIsListening(true);
    setSpeechText('');
    
    // Animate Candidate mic wave height
    waveIntervalRef.current = setInterval(() => {
      setWaveHeights(Array.from({ length: 5 }, () => Math.floor(Math.random() * 80) + 20));
    }, 150);

    const answer = simulatedAnswers[qIndex % simulatedAnswers.length];
    const words = answer.split(' ');
    let wordIndex = 0;

    typingIntervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        setSpeechText((prev) => prev + (wordIndex === 0 ? '' : ' ') + words[wordIndex]);
        wordIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        clearInterval(waveIntervalRef.current);
        setIsListening(false);
        setWaveHeights([60, 60, 60, 60, 60]);

        // Add to transcript history
        setHistory(prev => [
          ...prev,
          { sender: 'AI', text: questions[qIndex].question },
          { sender: 'Candidate', text: answer }
        ]);
      }
    }, 120);
  };

  const handleNextQuestion = () => {
    // If user has not simulated an answer, push the fallback text
    if (speechText.includes('Click the "Simulate Answer"')) {
      const fallback = simulatedAnswers[qIndex % simulatedAnswers.length];
      setHistory(prev => [
        ...prev,
        { sender: 'AI', text: questions[qIndex].question },
        { sender: 'Candidate', text: fallback }
      ]);
    }

    if (qIndex + 1 < questions.length) {
      setSpeechText('Click the "Simulate Answer" button below to mock speaking, or type in your response.');
      setQIndex(qIndex + 1);
    } else {
      navigate('/results');
    }
  };

  const strokeDash = (timeLeft / 60) * 100;
  
  const getTimerColor = () => {
    if (timeLeft <= 10) return '#EF4444'; // Red
    if (timeLeft <= 25) return '#F59E0B'; // Amber
    return '#6366F1'; // Indigo
  };

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      
      {/* Top Question Indicator Banner */}
      <div className="bg-indigo-600 dark:bg-slate-900 border-b border-indigo-700 dark:border-slate-800 text-white py-3.5 px-4 sm:px-6 shadow-sm text-left">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Question {qIndex + 1} of {questions.length}
            </span>
            <span className="bg-white/10 text-indigo-100 font-semibold text-xs px-2.5 py-1 rounded-full uppercase">
              {questions[qIndex].category}
            </span>
          </div>
          
          <div className="text-xs sm:text-sm font-semibold text-indigo-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Role: <strong className="text-white capitalize">{role} Developer</strong>
          </div>
        </div>
      </div>

      {/* Main Workspace split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow flex items-stretch gap-6">
        
        {/* Left Side: Video/Audio Viewports */}
        <div className={`flex-grow flex flex-col gap-6 transition-all duration-300 ${showTranscript ? 'lg:max-w-[65%]' : 'w-full'}`}>
          <div className="grid md:grid-cols-2 gap-6 items-stretch flex-grow">
            
            {/* Candidate Box */}
            <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col relative aspect-[4/3] md:aspect-auto justify-between p-5 min-h-[300px]">
              
              {/* Webcam state representation */}
              <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center">
                {!isVideoOff ? (
                  <div className="space-y-4 text-center">
                    {/* Pulsing visual element representing a camera */}
                    <div className="mx-auto h-20 w-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500 flex items-center justify-center animate-pulse">
                      <Video className="h-8 w-8 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white tracking-wide uppercase">Webcam active</p>
                      <p className="text-[10px] text-slate-400">Evaluating visual confidence & posture</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-center">
                    <VideoOff className="h-10 w-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500">Camera Feed Paused</p>
                  </div>
                )}
              </div>

              {/* Status Header Overlay */}
              <div className="relative z-10 flex justify-between items-center w-full">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Candidate Feed
                </div>

                {/* Mic Visualizer overlay */}
                <div className="bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full flex items-center gap-2 border border-white/10 text-white text-[10px]">
                  <span className={isMuted ? 'text-rose-500' : 'text-emerald-400'}>
                    {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  </span>
                  <div className="flex items-center gap-0.5 h-3">
                    {waveHeights.map((h, i) => (
                      <div
                        key={i}
                        className={`w-0.5 rounded-sm transition-all duration-150 ${isMuted ? 'bg-rose-500/40' : 'bg-emerald-400'}`}
                        style={{ height: `${isMuted ? 20 : h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Label Overlay */}
              <div className="relative z-10 text-left bg-black/45 backdrop-blur-xs p-2 rounded-xl text-[10px] text-slate-350 self-start border border-white/5">
                👨‍💻 Vikas S.
              </div>
            </div>

            {/* AI Intervener Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between p-6 text-left relative min-h-[300px] transition-colors duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 w-full z-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-xl bg-indigo-650 text-white flex items-center justify-center font-heading font-extrabold text-xs">
                    AI
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200">Interviewer Assistant</h5>
                    <p className="text-[9px] text-indigo-650 dark:text-indigo-400 font-semibold">Active speech evaluation</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${isAiSpeaking ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAiSpeaking ? 'Speaking' : 'Listening'}</span>
                </div>
              </div>

              {/* AI avatar Waveform visualizer */}
              <div className="flex-grow flex flex-col items-center justify-center my-6 space-y-4">
                
                {/* 20 soundwave bars */}
                <div className="flex items-end gap-1.5 h-16">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const activeHeight = Math.floor(Math.sin((i / 3) * Math.PI) * 25) + 35;
                    const randomDelay = (i * 0.05).toFixed(2);
                    return (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isAiSpeaking 
                            ? 'bg-indigo-600 dark:bg-indigo-500 animate-soundwave' 
                            : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                        style={{
                          height: isAiSpeaking ? `${activeHeight}px` : '10px',
                          animationDelay: `${randomDelay}s`
                        }}
                      />
                    );
                  })}
                </div>

                <p className="text-[10px] text-slate-400 tracking-wide uppercase font-bold text-center">
                  {isAiSpeaking ? 'AI interviewer is posing a question...' : 'Ready for Candidate Response'}
                </p>
              </div>

              {/* Current Question Text panel */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-150 dark:border-slate-850 flex items-start gap-2.5 z-10">
                <Volume2 className="h-4.5 w-4.5 text-indigo-650 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{questions[qIndex].question}"
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Panel: Live input Transcription */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between space-y-4 transition-colors duration-300">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-405 dark:text-slate-500 block">
                Speech Heuristics Input
              </span>
              
              <div className="flex items-center gap-4">
                {/* Circular timer */}
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke={getTimerColor()}
                        strokeWidth="3"
                        strokeDasharray={`${strokeDash}, 100`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-slate-800 dark:text-slate-200">
                      {timeLeft}s
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-550 dark:text-slate-400">Response limit</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4.5 border border-slate-200/50 dark:border-slate-800/80 border-dashed min-h-[100px] flex flex-col justify-between">
              <div className="overflow-y-auto max-h-24 text-xs sm:text-sm leading-relaxed text-slate-650 dark:text-slate-300">
                {isListening && (
                  <span className="text-indigo-650 dark:text-indigo-400 text-xs font-bold block mb-1.5 animate-pulse flex items-center gap-1">
                    🎤 Speech feedback active (translating voice waves)...
                  </span>
                )}
                <p className="italic font-medium leading-relaxed">
                  {speechText}
                </p>
              </div>
            </div>

            {/* Input Action controls */}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={simulateSpeaking}
                disabled={isListening || isMuted || isAiSpeaking}
                className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100/60 dark:hover:bg-indigo-950 border border-indigo-200/40 dark:border-indigo-850 disabled:opacity-40 font-bold py-2.5 px-4.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Play className="h-4 w-4" />
                Simulate Answer
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={isListening || isAiSpeaking}
                className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 text-xs sm:text-sm border border-indigo-605"
              >
                {qIndex + 1 < questions.length ? (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Finish Evaluation
                    <CornerDownLeft className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Transcript Drawer (slides in/collapses) */}
        {showTranscript && (
          <div className="w-[35%] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-6 flex flex-col justify-between space-y-4 animate-fade-in hidden lg:flex text-left transition-colors duration-300">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-indigo-600" />
                <h4 className="font-heading text-sm font-extrabold text-slate-900 dark:text-white">Real-Time transcript</h4>
              </div>
              <button 
                onClick={() => setShowTranscript(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conversation Log */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 max-h-[480px] text-xs">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 py-10">
                  <MessageSquare className="h-8 w-8 text-slate-300 dark:text-slate-800" />
                  <p className="font-medium">No speech log yet.</p>
                  <p className="text-[10px]">Your simulated answer text will log here in real time.</p>
                </div>
              ) : (
                history.map((h, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${
                    h.sender === 'AI' 
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100/50 dark:border-indigo-850/60' 
                      : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-850/60'
                  }`}>
                    <span className={`font-bold block text-[10px] uppercase mb-1 ${
                      h.sender === 'AI' ? 'text-indigo-650 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {h.sender}
                    </span>
                    <p className="text-slate-700 dark:text-slate-350 leading-relaxed font-normal italic">
                      "{h.text}"
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-150 dark:border-slate-850 text-[10px] text-slate-405 flex items-start gap-1.5">
              <AlertCircle className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>Transcribing is automated. High filler word occurrences are auto-flagged for the evaluation score.</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/80 py-4 px-6 sticky bottom-0 z-40 transition-colors duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Left info status */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className={`h-2.5 w-2.5 rounded-full ${isMuted ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
            Microphone: {isMuted ? 'Muted' : 'Receiving high definition audio'}
          </div>

          {/* Central Controls */}
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            {/* Mic Button */}
            <button
              onClick={toggleMic}
              className={`h-11 w-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-sm ${
                isMuted 
                  ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            {/* Video Button */}
            <button
              onClick={toggleVideo}
              className={`h-11 w-11 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-sm ${
                isVideoOff 
                  ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
              title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </button>

            {/* Toggle Drawer button */}
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`h-11 px-4.5 rounded-full border transition-all cursor-pointer shadow-sm flex items-center gap-2 text-xs font-bold ${
                showTranscript 
                  ? 'bg-indigo-650 border-indigo-650 text-white hover:bg-indigo-750' 
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
              title="Toggle Live Transcript Drawer"
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Speech Log</span>
            </button>
          </div>

          {/* Right Exit button */}
          <button
            onClick={() => setShowExitModal(true)}
            className="bg-rose-600 hover:bg-rose-700 border border-rose-600 text-white font-bold py-2.5 px-5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer text-xs shadow-md shadow-rose-605/10"
            title="End Session"
          >
            <LogOut className="h-4 w-4" />
            End Practice
          </button>

        </div>
      </div>

      {/* Double confirmation exit React modal overlay */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2.5xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-left space-y-6 animate-fade-in transition-colors duration-300">
            
            <div className="flex gap-3.5 items-start">
              <div className="bg-rose-500/10 text-rose-500 p-3 rounded-2xl border border-rose-500/10">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">End Interview Practice?</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                  Are you sure you want to end this interview session? Your response evaluation progress will be discarded, and no report card will be evaluated.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer"
              >
                Continue Practice
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  navigate('/dashboard');
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer shadow-md shadow-rose-605/10"
              >
                Yes, End Session
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
