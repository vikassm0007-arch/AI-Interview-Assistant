import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, ShieldAlert, Target, Award, Calendar } from 'lucide-react';
import { generateHRQuestions } from '../../services/hrQuestionService';
import { generateTechnicalQuestions } from '../../services/technicalQuestionService';

export default function SuggestionsEngine({ suggestions, averageScore }) {
  const navigate = useNavigate();

  // Goal states
  const [targetScore, setTargetScore] = useState(85);
  const [targetMode, setTargetMode] = useState('TECHNICAL');
  const [targetDate, setTargetDate] = useState('2026-08-30');
  const [goalSaved, setGoalSaved] = useState(true);

  // Compute progress percent (capped 100)
  const progressPercent = Math.min(100, Math.round((averageScore / targetScore) * 100));

  const handleStartSuggestion = (item) => {
    let questions = [];
    if (item.type === 'design' || item.type === 'coding') {
      questions = generateTechnicalQuestions([item.linkTopic], 'Mid', item.type);
      navigate('/interview', {
        state: {
          mode: 'TECHNICAL',
          role: `${item.linkTopic} - Mid Practice`,
          questions,
          technicalMetadata: { selectedSkills: [item.linkTopic], difficulty: 'Mid', format: item.type }
        }
      });
    } else {
      questions = generateHRQuestions('Mid-Level', 'startup', ['conflict']);
      navigate('/interview', {
        state: {
          mode: 'HR',
          role: `Behavioral Practice`,
          questions,
          hrMetadata: { roleContext: 'Mid-Level', cultureProfile: 'startup', hrFocus: ['conflict'] }
        }
      });
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 text-left">
      
      {/* 1. Suggestions Roadmap (Col-span 2) */}
      <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4">
        <div>
          <h5 className="font-heading font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-indigo-500 fill-current" /> Actionable Study Blueprint
          </h5>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Recommended drill paths synthesized from your scores</p>
        </div>

        <div className="space-y-3.5">
          {suggestions.map((item, idx) => (
            <div 
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-950/45 border border-slate-200/50 dark:border-slate-850 rounded-2.5xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-slate-100/30"
            >
              <div className="space-y-1">
                <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-550 bg-indigo-600 text-white uppercase tracking-wider">
                  {item.type} Practice Drill
                </span>
                <h6 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-1">
                  {item.title}
                </h6>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => handleStartSuggestion(item)}
                className="bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-md shadow-indigo-600/10"
              >
                Start Practice <Play className="h-3 w-3 fill-current" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Target Goal Tracker (Col-span 1) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <h5 className="font-heading font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Target className="h-4.5 w-4.5 text-indigo-500" /> Milestones Tracker
            </h5>
            <button 
              onClick={() => setGoalSaved(!goalSaved)}
              className="text-[9px] font-extrabold text-indigo-650 hover:underline uppercase"
            >
              {goalSaved ? 'Edit Goal' : 'Save Goal'}
            </button>
          </div>

          {goalSaved ? (
            <div className="space-y-4 animate-fade-in text-xs font-semibold">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-2.5xl border border-slate-200/50 dark:border-slate-850">
                {/* Circular ring */}
                <div className="relative h-14 w-14 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeDasharray={`${progressPercent}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-extrabold text-xs">
                    {progressPercent}%
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Milestone Progress</p>
                  <p className="text-slate-800 dark:text-white font-bold mt-0.5">{averageScore}% / {targetScore}% Target</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> Target Mode</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{targetMode}</span>
                </p>
                <p className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Deadline Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{targetDate}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5 animate-fade-in text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-455 uppercase tracking-wider block">Target Score (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={targetScore}
                  onChange={(e) => setTargetScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-455 uppercase tracking-wider block">Goal Target Mode</label>
                <select
                  value={targetMode}
                  onChange={(e) => setTargetMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-805 dark:text-slate-200 focus:outline-none"
                >
                  <option value="TECHNICAL">TECHNICAL MODE</option>
                  <option value="HR">HR MODE</option>
                  <option value="ALL">ALL MODES</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-455 uppercase tracking-wider block">Deadline Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {!goalSaved && (
          <button
            onClick={() => setGoalSaved(true)}
            className="w-full bg-indigo-650 bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-transform active:scale-95 shadow-sm"
          >
            Apply Target Milestone
          </button>
        )}
      </div>

    </div>
  );
}
