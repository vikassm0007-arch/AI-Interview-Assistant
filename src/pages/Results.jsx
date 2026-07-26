import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, Info, FileDown, BookOpen, User, Volume2, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Trophy } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('technical');
  const [expandedQuestion, setExpandedQuestion] = useState(0);
  const [showModelAnswer, setShowModelAnswer] = useState({});
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handlePracticeAgain = () => {
    navigate('/resume-analyzer');
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate file download
      alert("Simulated PDF Report downloaded successfully!");
    }, 1500);
  };

  const toggleModelAnswer = (idx) => {
    setShowModelAnswer(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const questionsData = [
    {
      question: "Can you describe a time when you had to optimize the performance of a React web application?",
      category: "Behavioral",
      score: 88,
      critique: "Excellent demonstration of list virtualization. Pacing was slightly fast, and starting with 'so' was flagged as a filler word.",
      modelAnswer: "In my previous role, our main dashboard loaded a list of 5,000 active server logs, causing visual lag (FID of 180ms). I virtualization-rendered the DOM nodes via react-window. By recycling DOM elements, we reduced list rendering from 120ms to 8ms. I also wrapped calculation functions in useMemo, which kept the UI fully interactive during heavy sorting operations.",
      transcript: [
        { type: "text", content: "Yeah, absolutely. So " },
        {
          type: "highlight-warning",
          content: "so",
          tooltip: "Filler Word: Try to avoid starting sentences with introductory filler words like 'so' or 'um'. Starting straight with the context yields higher clarity."
        },
        { type: "text", content: " we had a large list rendering in a dashboard that was really slow. I fixed it by " },
        {
          type: "highlight-success",
          content: "implementing list virtualization",
          tooltip: "Strong Skill: Excellent inclusion of list virtualization! It indicates knowledge of browser rendering limits (DOM nodes recycling)."
        },
        { type: "text", content: " using React Window, which cut rendering down to under 10ms. Also, we had some heavy computations that I memoized with " },
        {
          type: "highlight-info",
          content: "useMemo",
          tooltip: "Technical Accuracy: Perfect. Correct reference of the useMemo hook for caching expensive calculations."
        },
        { type: "text", content: "." }
      ]
    },
    {
      question: "What is the difference between useMemo and useCallback? When would you use one over the other?",
      category: "Technical",
      score: 85,
      critique: "Correct core definitions. Could provide a clearer explanation of hook reference comparison.",
      modelAnswer: "useMemo caches the returned result of an expensive calculation function and only runs on dependency change. useCallback caches the function instance itself. You use useCallback when passing callback functions to optimized child components that rely on shallow reference equality (`React.memo`) to prevent redundant child renders.",
      transcript: [
        { type: "text", content: "So " },
        {
          type: "highlight-warning",
          content: "useMemo",
          tooltip: "Explanation Depth: Good distinction. You explained useMemo returns a memoized value, while useCallback returns a memoized function."
        },
        { type: "text", content: " returns a memoized value, while useCallback returns a memoized callback function. I use useMemo for heavy calculations to avoid running them on every render, and useCallback to prevent unnecessary re-renders of child components that receive callbacks as props." }
      ]
    },
    {
      question: "How do you approach ensuring a web application is accessible to users with screen readers?",
      category: "Accessibility",
      score: 73,
      critique: "Good mention of semantic markup and ARIA. Missing references to keyboard accessibility and NVDA/VoiceOver screen reader verification.",
      modelAnswer: "Ensuring web accessibility starts with writing standard semantic HTML tags (nav, main, section). All interactive elements must support keyboard focus indicators (outline offsets) and logical tab orders. For custom toggles or dropdowns, I apply appropriate ARIA roles, states, and properties, validating color contrast against WCAG AA requirements (4.5:1 ratio). Finally, I manually verify workflows using screen readers like NVDA.",
      transcript: [
        { type: "text", content: "I focus on writing semantic HTML, ensuring correct alt tags for images, and using " },
        {
          type: "highlight-info",
          content: "aria attributes",
          tooltip: "Accessibility Insight: Mentioning ARIA roles is good, but make sure to emphasize actual screen reader testing (e.g. using NVDA or VoiceOver)."
        },
        { type: "text", content: " where custom UI controls are needed. I also enforce contrast compliance during styling." }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Overview & Score Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row items-center gap-8 text-left transition-colors duration-300">
        
        {/* Score Gauge Ring */}
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="3.2" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="#10B981"
              strokeWidth="3.2"
              strokeDasharray="82, 100"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white leading-none">82%</span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest mt-1">Readiness</span>
          </div>
        </div>

        {/* Evaluation Metadata */}
        <div className="space-y-4 flex-grow text-center md:text-left">
          <div className="space-y-2">
            <span className="bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 text-xs font-bold px-3 py-1 rounded-full inline-block">
              Session Evaluation Complete
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Frontend Developer Evaluation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Completed on July 25, 2026 • 3 Questions Evaluated • 4.5 Years Exp Config</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <button
              onClick={handleBackToDashboard}
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-slate-800 dark:border-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <button
              onClick={handlePracticeAgain}
              className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-455 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 border border-indigo-200/40 dark:border-indigo-850 font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Practice Again
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-250 border border-slate-200 dark:border-slate-800 font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {downloading ? (
                <div className="h-4 w-4 border-2 border-slate-800 dark:border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              <span>{downloading ? 'Downloading...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Tabbed details & Question Accordions */}
      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Side Accordions: Question Review (3/5) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="text-left">
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Question-by-Question Review</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Review speech logs. Click on highlighted phrases to view AI critique tooltips.</p>
          </div>

          <div className="space-y-4">
            {questionsData.map((qObj, idx) => {
              const isOpen = expandedQuestion === idx;
              const isModelOpen = !!showModelAnswer[idx];

              return (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-slate-900 rounded-2.5xl border border-slate-205/60 dark:border-slate-800/80 shadow-xs overflow-hidden transition-colors duration-300 text-left"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setExpandedQuestion(isOpen ? null : idx)}
                    className="w-full p-5 flex justify-between items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all cursor-pointer"
                  >
                    <div className="space-y-1 text-left flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-650 dark:text-indigo-400 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase">
                          Question {idx + 1}
                        </span>
                        <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          qObj.score >= 80 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : qObj.score >= 70 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          Score: {qObj.score}%
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200 leading-relaxed pr-2">
                        {qObj.question}
                      </h5>
                    </div>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
                  </button>

                  {/* Accordion Panel Content */}
                  {isOpen && (
                    <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10 space-y-5 animate-fade-in">
                      
                      {/* Critique Bullet */}
                      <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 p-4 rounded-xl flex items-start gap-2.5 text-left">
                        <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-amber-600 dark:text-amber-400">AI Evaluation Feedback</p>
                          <p className="text-slate-650 dark:text-slate-350 leading-relaxed">{qObj.critique}</p>
                        </div>
                      </div>

                      {/* Interactive Transcript Segment */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-405 dark:text-slate-500 block">Candidate Speech Log</label>
                        <div className="bg-white dark:bg-slate-900 p-4.5 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          <p className="leading-relaxed">
                            {qObj.transcript.map((segment, sIdx) => {
                              if (segment.type === 'text') {
                                return <span key={sIdx}>{segment.content}</span>;
                              }

                              const highlightStyles = {
                                'highlight-warning': 'bg-amber-500/10 dark:bg-amber-500/15 border-b-2 border-amber-500 text-amber-700 dark:text-amber-400 cursor-pointer font-bold px-0.5 rounded-sm hover:bg-amber-500/20',
                                'highlight-success': 'bg-emerald-500/10 dark:bg-emerald-500/15 border-b-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 cursor-pointer font-bold px-0.5 rounded-sm hover:bg-emerald-500/20',
                                'highlight-info': 'bg-indigo-500/10 dark:bg-indigo-500/15 border-b-2 border-indigo-500 text-indigo-700 dark:text-indigo-400 cursor-pointer font-bold px-0.5 rounded-sm hover:bg-indigo-500/20'
                              };

                              const tooltipId = `${idx}-${sIdx}`;
                              const isTooltipActive = activeTooltip === tooltipId;

                              return (
                                <span key={sIdx} className="relative inline-block">
                                  <button
                                    onClick={() => setActiveTooltip(isTooltipActive ? null : tooltipId)}
                                    className={highlightStyles[segment.type]}
                                  >
                                    {segment.content}
                                  </button>
                                  
                                  {isTooltipActive && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 dark:bg-slate-800 text-white text-xs p-3.5 rounded-xl shadow-xl z-20 space-y-1.5 transition-all animate-fade-in text-left border border-slate-700/50">
                                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px]">
                                        {segment.type === 'highlight-warning' && <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                                        {segment.type === 'highlight-success' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                                        {segment.type === 'highlight-info' && <Info className="h-3.5 w-3.5 text-indigo-400" />}
                                        AI Critique Heuristic
                                      </div>
                                      <p className="text-[11px] leading-relaxed font-normal text-slate-200">{segment.tooltip}</p>
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
                                    </div>
                                  )}
                                </span>
                              );
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Model Answer Drawer */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <button
                          onClick={() => toggleModelAnswer(idx)}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="h-4 w-4" />
                          {isModelOpen ? 'Hide Suggested Model Answer' : 'Reveal Suggested Model Answer'}
                        </button>

                        {isModelOpen && (
                          <div className="bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/10 p-4.5 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 text-left leading-relaxed animate-fade-in">
                            <span className="text-[9px] font-extrabold text-indigo-650 dark:text-indigo-400 block mb-1.5 uppercase tracking-wide">Suggested AI Model Response</span>
                            <p className="italic font-medium leading-relaxed">"{qObj.modelAnswer}"</p>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side detailed breakdown Tabs (2/5) */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-205/60 dark:border-slate-800/80 shadow-md overflow-hidden transition-colors duration-300">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 p-1.5 gap-1">
              <button
                onClick={() => setActiveTab('technical')}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'technical'
                    ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/40 dark:border-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200'
                }`}
              >
                Technical
              </button>
              <button
                onClick={() => setActiveTab('communication')}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'communication'
                    ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/40 dark:border-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200'
                }`}
              >
                Clarity
              </button>
              <button
                onClick={() => setActiveTab('star')}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'star'
                    ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/40 dark:border-slate-800'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-750 dark:hover:text-slate-200'
                }`}
              >
                STAR Form
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 space-y-6">
              
              {/* Tab 1: Technical Accuracy */}
              {activeTab === 'technical' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-slate-850 dark:text-slate-200">Domain Knowledge accuracy</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Evaluates depth of reference hooks, virtualization, and screen-readers metrics.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                        <span>List Virtualization depth</span>
                        <span className="text-emerald-500">95%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: '95%' }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                        <span>Hook memoization lifecycle</span>
                        <span className="text-indigo-600 dark:text-indigo-400">85%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 dark:bg-indigo-500 h-full" style={{ width: '85%' }} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350">
                        <span>Accessibility screen-reader bounds</span>
                        <span className="text-amber-500">68%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: '68%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-600/5 dark:bg-indigo-500/10 border border-indigo-500/10 p-3.5 rounded-xl flex items-start gap-2 text-left mt-2">
                    <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                      Excellent performance explaining DOM recycling via react-window. Expand keyboard navigation references to score higher in accessibility.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Communication & Clarity */}
              {activeTab === 'communication' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-slate-850 dark:text-slate-200">Clarity & Pacing heuristics</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Tone metrics, delivery speeds, and filler word detection logs.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
                      <span className="text-[9px] font-extrabold uppercase text-slate-405 block">Speaking Pacing</span>
                      <span className="font-heading text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">138 Words/min</span>
                      <span className="text-[10px] text-emerald-500 font-bold">Optimal Speed</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
                      <span className="text-[9px] font-extrabold uppercase text-slate-405 block">Filler word count</span>
                      <span className="font-heading text-lg font-extrabold text-rose-500 mt-1 block">3 Flagged</span>
                      <span className="text-[10px] text-rose-550 font-bold">Mainly 'so', 'yeah'</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-350">
                      <span>Grammar & Vocabulary Density</span>
                      <span className="text-emerald-500">Excellent</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-350">
                      <span>Delivery Tone & Modulation</span>
                      <span className="text-indigo-600">Professional</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-350">
                      <span>Volume & Clarity</span>
                      <span className="text-emerald-500">Optimal</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: STAR Method Compliance */}
              {activeTab === 'star' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-slate-850 dark:text-slate-200">STAR Method Compliance</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Measures structure compliance for behavioral questions (Situation, Task, Action, Result).</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">S - Situation Outline</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">100% Complete</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">T - Task Breakdown</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">90% Complete</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">A - Actions Undertaken</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">85% Complete</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-850/80">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">R - Result Metrics</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">90% Complete</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Key Actions Bullet Widget */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 text-left transition-colors duration-300">
            <h4 className="font-heading text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Trophy className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Key Action Items
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-655 dark:text-slate-400 leading-normal">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0 text-sm">❌</span>
                <span>Minimize repetitive introductory filler words (e.g. "So yeah") during technical segments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0 text-sm">✅</span>
                <span>Exceptional architectural depth detailing virtualization layouts and useMemo cache controls.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 shrink-0 text-sm">💡</span>
                <span>Slowing down delivery pace by 10% will yield a higher modulation score and display elevated calmness.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
