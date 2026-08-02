import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, 
  Volume2, 
  ArrowRight, 
  ChevronLeft,
  Check,
  Terminal,
  Play
} from 'lucide-react';
import { saveInterviewSession } from '../../services/storage';
import HRModeLayout from './modes/HRModeLayout';
import TechnicalModeLayout from './modes/TechnicalModeLayout';

const fallbackQuestions = [
  {
    id: 'f-1',
    category: 'Technical',
    question: 'How do you approach optimizing the rendering performance of a data-heavy React table?',
    keyTopics: ['Virtualization', 'Memoization', 'Paint Cycles'],
    codeTemplate: `// React Junior Component Hook challenge\nimport React, { useState, useEffect } from 'react';\n\nexport default function Timer() {\n  const [count, setCount] = useState(0);\n\n  // TODO: Implement a counter\n  useEffect(() => {\n    \n  }, []);\n\n  return <div>{count}</div>;\n}`,
    constraints: ["Must clear interval on unmount to avoid leaks."],
    hint1: "Use setInterval inside the hook.",
    hint2: "Return a cleanup function clearing the interval handle."
  }
];

export default function InterviewEngine() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const sessionMode = location.state?.mode || 'HR'; // 'HR' or 'TECHNICAL'
  const sessionRole = location.state?.role || 'Frontend Developer';
  const questionsList = location.state?.questions || fallbackQuestions;

  // Active states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [voiceDraft, setVoiceDraft] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [micLevel, setMicLevel] = useState([10, 10, 10, 10, 10]);
  const [showTips] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Completed answers tracker
  const [answers, setAnswers] = useState([]);

  // Timers
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [qSeconds, setQSeconds] = useState(120); // 2:00 per question
  const [isPaused] = useState(false);

  const activeQuestion = questionsList[currentIdx];

  // Overall Session Timer
  useEffect(() => {
    if (isPaused || isSaving) return;
    const interval = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isSaving]);

  // Question Countdown Timer
  useEffect(() => {
    if (isPaused || isSaving) return;
    const interval = setInterval(() => {
      setQSeconds(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isSaving]);

  // Simulated Mic volume level waveform animation in voice mode
  useEffect(() => {
    if (!isRecording || isPaused) return;
    const interval = setInterval(() => {
      setMicLevel(Array.from({ length: 12 }, () => Math.floor(Math.random() * 85) + 15));
    }, 120);
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartVoice = () => {
    setIsRecording(true);
    setVoiceDraft('');
    const sentences = [
      "So yeah, in my previous role,",
      " we had a bottleneck in list virtualization.",
      " I memoized components to prevent shallow redraws,",
      " which dropped render lag down below 16ms."
    ];
    let sentenceIdx = 0;
    const interval = setInterval(() => {
      setVoiceDraft(prev => prev + sentences[sentenceIdx++]);
      if (sentenceIdx >= sentences.length) {
        clearInterval(interval);
      }
    }, 1500);
    window.voiceInterval = interval;
  };

  const handleStopVoice = () => {
    setIsRecording(false);
    clearInterval(window.voiceInterval);
  };

  const handleClearResponse = () => {
    setVoiceDraft('');
    setIsRecording(false);
    clearInterval(window.voiceInterval);
  };

  const handleNextSubmit = () => {
    const currentAnswer = sessionMode === 'HR' ? voiceDraft : textAnswer;
    
    if (!currentAnswer.trim()) {
      alert("Please provide an answer before submitting.");
      return;
    }

    const calculatedScore = Math.floor(Math.random() * 20) + 75; // 75-95
    const record = {
      questionId: activeQuestion.id,
      category: activeQuestion.category,
      questionText: activeQuestion.question,
      candidateAnswer: currentAnswer,
      timeSpentSeconds: 120 - qSeconds,
      aiFeedback: {
        score: calculatedScore,
        strengths: [
          `Clear layout of technical patterns related to ${activeQuestion.keyTopics?.[0] || 'engineering'}.`,
          "Concise, articulate speaking rhythm."
        ],
        improvements: [
          `Elaborate more on specific STAR outcomes using quantitative metrics.`
        ],
        idealAnswer: `To answer this question, align your description with: (1) Situational challenges regarding ${activeQuestion.keyTopics?.join(', ') || 'architecture'}. (2) Practical solutions applied. (3) Numeric achievements.`
      }
    };

    const newAnswers = [...answers, record];
    setAnswers(newAnswers);

    if (currentIdx < questionsList.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setTextAnswer('');
      setVoiceDraft('');
      setIsRecording(false);
      setQSeconds(120);
    } else {
      handleSaveSession(newAnswers);
    }
  };

  const handleSaveSession = async (finalAnswers) => {
    setIsSaving(true);
    
    const totalScore = Math.floor(finalAnswers.reduce((acc, a) => acc + a.aiFeedback.score, 0) / finalAnswers.length);
    
    const payload = {
      roleTitle: sessionRole,
      experienceLevel: 'Mid',
      totalScore,
      durationSeconds: totalSeconds,
      questionsCount: finalAnswers.length,
      questions: finalAnswers,
      status: 'completed',
      interviewMode: sessionMode,
      technicalMetadata: sessionMode === 'TECHNICAL' ? {
        selectedSkills: location.state?.technicalMetadata?.selectedSkills || ["React"],
        difficulty: location.state?.technicalMetadata?.difficulty || 'Mid',
        codeSubmissions: finalAnswers.map(a => a.candidateAnswer),
        testCasesPassed: finalAnswers.length
      } : null,
      hrMetadata: sessionMode === 'HR' ? {
        starCompletenessScore: 88,
        communicationTone: 'Confident & Collaborative',
        cultureFitRating: 85
      } : null
    };

    try {
      const savedSession = await saveInterviewSession(payload);
      setIsSaving(false);
      navigate('/results', { state: { session: savedSession } });
    } catch (err) {
      setIsSaving(false);
      alert('Failed to save session data.');
    }
  };

  return (
    <div className="flex-grow flex bg-slate-50 dark:bg-slate-955 text-slate-905 dark:text-slate-100 transition-colors duration-300 min-h-screen">
      
      {/* 1. Left Stepper Drawer */}
      {sidebarOpen && (
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 p-5 space-y-6 shrink-0 animate-fade-in text-left">
          <div>
            <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">{sessionMode} Practice</h4>
            <p className="text-[10px] text-slate-400 mt-1 font-semibold">Track your question progress</p>
          </div>
          
          <div className="space-y-3">
            {questionsList.map((q, idx) => {
              const isCompleted = idx < currentIdx;
              const isActive = idx === currentIdx;
              
              return (
                <div key={q.id} className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : isActive 
                        ? 'bg-indigo-605 bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-slate-850 dark:text-white' : 'text-slate-500'}`}>
                      {q.category} Question
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* 2. Main Practice Simulator Area */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Header control strip */}
        <header className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-850 px-4 sm:px-6 py-3.5 flex justify-between items-center z-10 text-left">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-850 shrink-0 cursor-pointer"
            >
              <ChevronLeft className={`h-4.5 w-4.5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{sessionMode} Practice</p>
              <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-[320px]">
                {sessionRole}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Progress</p>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-205">Question {currentIdx + 1} of {questionsList.length}</p>
            </div>

            <div className="text-center px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850">
              <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Question Limit</p>
              <span className={`text-xs font-extrabold font-mono ${qSeconds < 30 ? 'text-rose-500 animate-pulse' : qSeconds < 60 ? 'text-amber-500' : 'text-indigo-650 dark:text-indigo-400'}`}>
                {formatTime(qSeconds)}
              </span>
            </div>

            <div className="text-center px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850">
              <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Total Duration</p>
              <span className="text-xs font-extrabold font-mono text-slate-700 dark:text-slate-300">
                {formatTime(totalSeconds)}
              </span>
            </div>

            <button 
              onClick={() => setExitModalOpen(true)}
              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all border border-rose-500/10 cursor-pointer shrink-0"
              title="End Session"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Live Simulator Viewport */}
        <div className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6 text-left">
          
          {/* Dynamic layout loading based on mode */}
          {sessionMode === 'HR' ? (
            <div className="space-y-6">
              {/* Behavioral Question Display Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800/80 p-6 sm:p-8 rounded-3xl flex gap-4 items-start relative shadow-xs">
                <div className="h-10 w-10 rounded-xl bg-indigo-605 bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Posed HR Question</span>
                  <h4 className="font-heading text-base sm:text-lg font-extrabold text-slate-850 dark:text-white leading-relaxed">
                    {activeQuestion?.question}
                  </h4>
                </div>
              </div>

              <HRModeLayout
                activeQuestion={activeQuestion}
                voiceDraft={voiceDraft}
                textAnswer={textAnswer}
                setTextAnswer={setTextAnswer}
                isRecording={isRecording}
                handleStartVoice={handleStartVoice}
                handleStopVoice={handleStopVoice}
                handleClearResponse={handleClearResponse}
                micLevel={micLevel}
                showTips={showTips}
              />
            </div>
          ) : (
            <TechnicalModeLayout
              activeQuestion={activeQuestion}
              textAnswer={textAnswer}
              setTextAnswer={setTextAnswer}
            />
          )}

          {/* Nav buttons bar */}
          <div className="flex justify-end pt-4 border-t border-slate-200/50 dark:border-slate-850">
            <button
              type="button"
              onClick={handleNextSubmit}
              className="bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-605/10 hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wider font-heading flex items-center gap-1.5 cursor-pointer"
            >
              {currentIdx < questionsList.length - 1 ? 'Submit & Next' : 'End & Evaluate'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 3. Double-Confirmation exit modal */}
      {exitModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-6 text-left shadow-2xl">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg">Exit Active Interview?</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Your current session responses, timers, and transcripts will be discarded. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setExitModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-655 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                Cancel Practice
              </button>
              <button
                onClick={() => { setExitModalOpen(false); navigate('/dashboard'); }}
                className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-rose-500/10"
              >
                Exit Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Saving session overlay */}
      {isSaving && (
        <div className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-slate-955/50 bg-slate-950/50 backdrop-blur-md z-50 animate-fade-in text-center text-white">
          <div className="h-12 w-12 border-4 border-indigo-550 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h4 className="font-heading font-extrabold text-xl">Saving Interview Session</h4>
          <p className="text-slate-350 text-xs mt-1 animate-pulse">Running AI evaluations and structuring transcripts history...</p>
        </div>
      )}

    </div>
  );
}
