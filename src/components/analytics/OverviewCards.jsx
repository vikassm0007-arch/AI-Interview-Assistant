import React from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Flame, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function OverviewCards({ metrics }) {
  const getReadinessStatus = (score) => {
    if (score >= 85) {
      return { label: 'Interview Ready', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20' };
    }
    if (score >= 70) {
      return { label: 'Improving Profile', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20' };
    }
    return { label: 'Needs Practice', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20' };
  };

  const status = getReadinessStatus(metrics.readinessScore);

  return (
    <div className="space-y-6 text-left">
      
      {/* Hero Overview Block */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-indigo-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${status.color}`}>
              {status.label}
            </span>
            <h3 className="font-heading font-extrabold text-2xl tracking-tight">Performance Summary</h3>
            <p className="text-indigo-200/70 text-xs sm:text-sm font-medium max-w-xl">
              Track your conceptual depth, speaking pacing, and coding score progressions compiled directly from active sandbox runs.
            </p>
          </div>

          {/* Dial readiness gauge */}
          <div className="flex items-center gap-4 bg-indigo-950/40 border border-indigo-800/40 p-4.5 rounded-2.5xl self-start md:self-center">
            <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-indigo-900/60" strokeWidth="3.2" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="3.2"
                  strokeDasharray={`${metrics.readinessScore}, 100`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-extrabold text-lg text-white">
                {metrics.readinessScore}%
              </div>
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">Readiness Score</p>
              <p className="text-xs font-bold text-slate-350 mt-0.5">Mock Evaluation Index</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Mock taken */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Mocks Taken</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 rounded-xl">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {metrics.totalMockInterviews}
            </p>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-450 font-extrabold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="h-3 w-3" /> +3 this week
            </p>
          </div>
        </div>

        {/* Avg score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 rounded-xl">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {metrics.averageScore}%
            </p>
            <p className="text-[9px] text-indigo-650 dark:text-indigo-400 font-extrabold flex items-center gap-0.5 mt-0.5">
              Target Bar: 80%
            </p>
          </div>
        </div>

        {/* Time spent */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Practice Time</span>
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {metrics.totalPracticeTimeHours} <span className="text-xs font-semibold text-slate-400 font-sans">hrs</span>
            </p>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5">
              Accumulated hours
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between min-h-[125px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Daily Streak</span>
            <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
              <Flame className="h-4.5 w-4.5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
              {metrics.currentStreak} <span className="text-xs font-semibold text-slate-450 font-sans">days</span>
            </p>
            <p className="text-[9px] text-rose-550 dark:text-rose-400 font-extrabold flex items-center gap-0.5 mt-0.5">
              Streak Active 🔥
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
