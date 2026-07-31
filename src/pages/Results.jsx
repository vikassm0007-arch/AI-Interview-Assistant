import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, FileText, CheckCircle2, ChevronRight, LayoutDashboard } from 'lucide-react';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session || null;

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

  const getScoreMessage = (score) => {
    if (score >= 85) return 'Expert Match: Exceptional response structures!';
    if (score >= 70) return 'Strong Match: Good competency coverage. Minor adjustments recommended.';
    return 'Prep Recommended: Key concept coverage was thin. Try applying the STAR method.';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/20">
                Evaluation Complete
              </span>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl mt-3">
                {session.roleTitle} Mock Practice
              </h3>
              <p className="text-slate-405 text-xs sm:text-sm font-semibold mt-1">
                Completed on {new Date(session.date).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-indigo-600/30 border border-indigo-500/30 px-6 py-3 rounded-2.5xl text-center shrink-0 self-start sm:self-center">
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-350">Overall Match</p>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-300">{session.totalScore}%</span>
            </div>
          </div>

          <p className="text-xs text-indigo-300 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-800">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            {getScoreMessage(session.totalScore)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2.5xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Duration Elapsed</p>
            <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">{formatDuration(session.durationSeconds)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2.5xl flex items-center gap-4 shadow-xs">
          <div className="p-3 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 rounded-xl">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Questions Answered</p>
            <p className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">{session.questionsCount} Questions</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Q&A Score Breakdown</h4>
        <div className="space-y-3">
          {session.questions.map((q) => (
            <div 
              key={q.questionId}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-2.5xl flex items-center justify-between hover:shadow-xs transition-shadow"
            >
              <div className="min-w-0 pr-4 space-y-1.5">
                <span className="text-[8px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                  {q.category}
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white truncate">
                  {q.questionText}
                </p>
              </div>

              <span className="text-xs font-extrabold bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 px-3 py-1 rounded-xl shrink-0 font-mono">
                {q.aiFeedback.score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-850">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-655 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer flex items-center gap-1"
        >
          <LayoutDashboard className="h-4 w-4" /> Return to Dashboard
        </button>

        <button
          onClick={() => navigate('/history')}
          className="bg-indigo-605 bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wide font-heading flex items-center gap-1 cursor-pointer"
        >
          View Detailed History Report
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
