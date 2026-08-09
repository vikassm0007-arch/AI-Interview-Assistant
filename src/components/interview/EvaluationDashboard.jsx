import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { getEvaluationStatus, getProgressColorClass } from '../../utils/scoringEngine';

export default function EvaluationDashboard({ evaluation, onRetake, onSave, isSaving }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'star', 'highlights', 'model'
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  if (!evaluation) return null;

  const status = getEvaluationStatus(evaluation.overallScore || 85);

  const starMetrics = evaluation.starCompliance || {
    situation: true,
    task: true,
    action: true,
    result: true
  };

  const highlights = evaluation.grammarToneHighlights || [
    { snippet: "Yeah, like...", type: "filler", rewrite: "In my experience," },
    { snippet: "a bit slow", type: "weak", rewrite: "exceeding acceptable latency bounds" }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      
      {/* Header Summary Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${status.colorClass}`}>
              {status.label}
            </span>
            <span className="text-xs text-slate-400 font-bold">Session Evaluation Complete</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Performance & Scoring Scorecard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
            Multi-dimensional evaluation measuring technical precision, communication structure, and confidence pacing.
          </p>
        </div>

        {/* Overall Composite Score Dial */}
        <div className="flex items-center gap-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-500/20 p-5 rounded-2.5xl shrink-0">
          <div className="text-center">
            <div className="font-heading font-extrabold text-4xl text-indigo-600 dark:text-indigo-400">
              {evaluation.overallScore || 85}
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">
              Overall Score
            </div>
          </div>
        </div>
      </div>

      {/* TRI-FACTOR SCORING METRICS GRID (0-100 Scale) */}
      <div className="grid sm:grid-cols-3 gap-6">
        
        {/* 1. Technical Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <Cpu className="h-4 w-4" /> Technical Score
            </div>
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
              {evaluation.technicalScore || 88}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(evaluation.technicalScore || 88)}`}
              style={{ width: `${evaluation.technicalScore || 88}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            Accuracy, terminology depth & edge-case handling.
          </p>
        </div>

        {/* 2. Communication Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <MessageSquare className="h-4 w-4" /> Communication Score
            </div>
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
              {evaluation.communicationScore || 82}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(evaluation.communicationScore || 82)}`}
              style={{ width: `${evaluation.communicationScore || 82}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            Structure clarity, STAR compliance & conciseness.
          </p>
        </div>

        {/* 3. Confidence Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <Zap className="h-4 w-4" /> Confidence Score
            </div>
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
              {evaluation.confidenceScore || 85}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(evaluation.confidenceScore || 85)}`}
              style={{ width: `${evaluation.confidenceScore || 85}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            Response pacing, assertiveness & low hesitation.
          </p>
        </div>

      </div>

      {/* TABBED GRANULAR FEEDBACK SECTIONS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-100 dark:border-slate-850 overflow-x-auto pb-3">
          {[
            { id: 'overview', label: 'Strengths & Growth Areas' },
            { id: 'star', label: 'STAR Method Compliance' },
            { id: 'highlights', label: 'Grammar & Tone Rewrites' },
            { id: 'model', label: 'Side-by-Side Model Answer' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: STRENGTHS & GROWTH AREAS */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {/* Key Strengths */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 space-y-3">
              <h4 className="font-heading font-extrabold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Key Candidate Strengths
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {(evaluation.strengths || [
                  "Strong explanation of virtualization and rendering performance.",
                  "Organized explanation using clear domain-specific terminology."
                ]).map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-3">
              <h4 className="font-heading font-extrabold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Areas for Growth
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                {(evaluation.improvements || [
                  "Reduce informal conversational filler words at opening.",
                  "Include quantitative metrics (e.g., render latency dropped from 45ms to 12ms)."
                ]).map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: STAR METHOD COMPLIANCE */}
        {activeTab === 'star' && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 space-y-4 animate-fade-in">
            <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> STAR Method Alignment Breakdown
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
              {[
                { key: 'situation', label: 'Situation', desc: 'Context & Background' },
                { key: 'task', label: 'Task', desc: 'Core Challenge' },
                { key: 'action', label: 'Action', desc: 'Steps Executed' },
                { key: 'result', label: 'Result', desc: 'Measurable Outcome' }
              ].map(star => {
                const passed = starMetrics[star.key] !== false;
                return (
                  <div key={star.key} className={`p-4 rounded-xl border text-center space-y-1 ${passed ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600' : 'border-rose-500/30 bg-rose-500/10 text-rose-600'}`}>
                    <div className="font-extrabold text-sm">{star.label}</div>
                    <div className="text-[10px] opacity-80">{star.desc}</div>
                    <div className="text-[10px] font-mono mt-1 font-bold">
                      {passed ? '✓ Covered' : '✕ Missing'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: GRAMMAR & TONE REWRITES */}
        {activeTab === 'highlights' && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-sm">
              Highlighted Tone & Grammar Enhancements
            </h4>
            <div className="grid gap-3">
              {highlights.map((hl, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Original Snippet</span>
                    <div className="font-mono text-rose-500 font-bold">"{hl.snippet}"</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">AI Professional Rewrite</span>
                    <div className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">"{hl.rewrite}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SIDE-BY-SIDE MODEL ANSWER */}
        {activeTab === 'model' && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-500" /> Side-by-Side Response Benchmark
            </h4>

            <div className="grid md:grid-cols-2 gap-6 text-xs font-mono">
              {/* Candidate Submission */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Candidate Submitted Answer</span>
                <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                  {evaluation.candidateAnswer || "Candidate provided written code and verbal explanation for list virtualization..."}
                </p>
              </div>

              {/* AI Recommended Model Answer */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">AI Recommended Benchmark</span>
                <p className="text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                  {evaluation.idealAnswer || evaluation.idealModelAnswer || "An optimal response frames the architecture problem clearly, explains windowing/memoization trade-offs, and quantifies performance latency improvements under 16ms."}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
