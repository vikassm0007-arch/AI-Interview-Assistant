import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Quote } from 'lucide-react';

export default function SkillBreakdown({ strongAreas, weakAreas }) {
  return (
    <div className="grid md:grid-cols-2 gap-6 text-left">
      
      {/* 1. Strong Competencies (Green) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
        <div>
          <h5 className="font-heading font-extrabold text-emerald-600 dark:text-emerald-450 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4.5 w-4.5" /> High Competency Areas
          </h5>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Core skills where you consistently score &ge; 85%</p>
        </div>

        <div className="space-y-4">
          {strongAreas.map((skill, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-100 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>{skill.topic}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-450">{skill.mastery}% Mastery</span>
              </div>
              
              {/* Mastery bar */}
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${skill.mastery}%` }}
                />
              </div>

              {/* Positive Quote */}
              <div className="flex gap-1.5 items-start p-2.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <Quote className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
                <p className="text-[10px] italic text-slate-500 font-semibold leading-relaxed">
                  "{skill.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Growth opportunities & Weakness blocks (Amber/Red) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
        <div>
          <h5 className="font-heading font-extrabold text-rose-500 dark:text-rose-450 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5" /> Opportunities for Growth
          </h5>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Focus targets where score drops &lt; 70% or flags filler words</p>
        </div>

        <div className="space-y-4">
          {weakAreas.map((skill, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-100 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center text-xs font-bold text-slate-805 dark:text-slate-200">
                <span>{skill.topic}</span>
                <span className="font-mono text-rose-500">{skill.score}% Score</span>
              </div>
              
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${skill.score}%` }}
                />
              </div>

              {/* Root Cause description banner */}
              <div className="flex gap-2 items-start p-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10 text-[10px] font-semibold leading-relaxed text-slate-505 dark:text-slate-400">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 uppercase tracking-wider">
                      {skill.impact}
                    </span>
                    <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400">Root Cause Target</span>
                  </div>
                  <p className="mt-1 font-medium text-slate-600 dark:text-slate-350">
                    {skill.rootCause}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
