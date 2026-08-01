import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Clock, FileText, ChevronRight, BookOpen } from 'lucide-react';
import Dashboard from '../components/feedback/Dashboard';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || null;

  const [selectedQIdx, setSelectedQIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!session) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4 animate-fade-in my-16">
        <p className="text-slate-400 font-semibold">No active evaluation session found.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-xs font-bold text-indigo-650 hover:underline flex items-center justify-center gap-1 mx-auto"
        >
          <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
        </button>
      </div>
    );
  }

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const activeAnswer = session.questions[selectedQIdx];

  // Dynamically map sub-breakdowns for the selected question feedback view
  const evaluationPayload = {
    overallScore: activeAnswer.aiFeedback.score,
    technicalScore: activeAnswer.aiFeedback.score,
    technicalBreakdown: {
      accuracy: activeAnswer.aiFeedback.score + 2 > 100 ? 100 : activeAnswer.aiFeedback.score + 2,
      completeness: activeAnswer.aiFeedback.score - 4,
      depth: activeAnswer.aiFeedback.score + 1 > 100 ? 100 : activeAnswer.aiFeedback.score + 1
    },
    communicationScore: Math.round(activeAnswer.aiFeedback.score * 0.95),
    communicationBreakdown: {
      clarity: Math.round(activeAnswer.aiFeedback.score * 0.98),
      pacing: 85,
      conciseness: 78
    },
    confidenceScore: Math.round(activeAnswer.aiFeedback.score * 1.02) > 100 ? 100 : Math.round(activeAnswer.aiFeedback.score * 1.02),
    confidenceBreakdown: {
      assertiveness: 88,
      fluency: 84,
      hesitation: 90
    },
    strengths: activeAnswer.aiFeedback.strengths,
    improvements: activeAnswer.aiFeedback.improvements,
    candidateAnswer: activeAnswer.candidateAnswer,
    grammarToneHighlights: [
      {
        snippet: activeAnswer.candidateAnswer.includes("Yeah, absolutely") ? "Yeah, absolutely." : activeAnswer.candidateAnswer.split(' ').slice(0, 2).join(' '),
        type: "weak",
        rewrite: "Certainly, let me walk you through my experience."
      }
    ],
    idealAnswer: activeAnswer.aiFeedback.idealAnswer
  };

  const handleSaveToHistory = () => {
    setIsSaving(true);
    // Mock save network delay
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => navigate('/history'), 1000);
    }, 1200);
  };

  const handleRetake = () => {
    // Redirects back to active practice simulator
    navigate('/practice');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      
      {/* Session Metadata Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div>
          <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg">
            {session.roleTitle} Evaluation
          </h3>
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1">
            Session completed on {new Date(session.date).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-4 text-xs font-semibold text-slate-550 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>Duration: {formatDuration(session.durationSeconds)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-slate-400" />
            <span>{session.questionsCount} Questions</span>
          </div>
        </div>
      </div>

      {/* Question Selector list */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-455 block">
          Select Question to Review Feedback
        </label>
        <select 
          value={selectedQIdx} 
          onChange={(e) => setSelectedQIdx(Number(e.target.value))}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-205 focus:outline-none focus:border-indigo-650"
        >
          {session.questions.map((q, idx) => (
            <option key={q.questionId} value={idx}>
              Q{idx + 1}: {q.questionText} ({q.aiFeedback.score}% Score)
            </option>
          ))}
        </select>
      </div>

      {/* Main Feedback Dashboard Visuals */}
      <div className="border-t border-slate-200/50 dark:border-slate-850 pt-4">
        <Dashboard 
          evaluation={evaluationPayload} 
          onRetake={handleRetake}
          onSave={handleSaveToHistory}
          isSaving={isSaving}
        />
      </div>

    </div>
  );
}
