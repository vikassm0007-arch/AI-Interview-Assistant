import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, HelpCircle, ChevronRight, ChevronDown, Sparkles, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';
import { STARTER_TEMPLATES } from '../../services/codeRunnerService';

export default function CodeEditorPane({ problem, code, setCode, language, setLanguage }) {
  const [expandedHintTier, setExpandedHintTier] = useState(null);
  const [unlockedHints, setUnlockedHints] = useState([]);

  const languages = [
    { id: 'javascript', label: 'JavaScript (Node.js)' },
    { id: 'python', label: 'Python 3' },
    { id: 'java', label: 'Java 17' },
    { id: 'cpp', label: 'C++ 20' },
    { id: 'c', label: 'C (GCC)' }
  ];

  const handleLanguageSwitch = (langId) => {
    setLanguage(langId);
    if (STARTER_TEMPLATES[langId]) {
      setCode(STARTER_TEMPLATES[langId]);
    }
  };

  const toggleHint = (tier) => {
    if (!unlockedHints.includes(tier)) {
      setUnlockedHints(prev => [...prev, tier]);
    }
    setExpandedHintTier(prev => prev === tier ? null : tier);
  };

  // Compute line numbers for editor
  const lineCount = (code || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(15, lineCount) }, (_, i) => i + 1);

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-stretch w-full min-h-[600px] text-left">
      
      {/* LEFT PANE: Problem Description & Progressive Hints */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm overflow-y-auto max-h-[750px]">
        <div className="space-y-6">
          
          {/* Header Title & Tags */}
          <div className="space-y-3 border-b border-slate-100 dark:border-slate-850 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-xl">
                {problem.title}
              </h3>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                problem.difficulty === 'Easy' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
              }`}>
                {problem.difficulty}
              </span>
            </div>

            {/* Topic Tags */}
            <div className="flex flex-wrap gap-2">
              {problem.topicTags?.map(tag => (
                <span key={tag} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed whitespace-pre-line">
            {problem.description}
          </div>

          {/* Example Test Cases */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sample Test Cases
            </h4>
            {problem.sampleTestCases?.map((tc, idx) => (
              <div key={tc.id} className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 space-y-1.5 font-mono text-xs">
                <div className="text-slate-500 dark:text-slate-400 font-bold">Example {idx + 1}:</div>
                <div><span className="text-indigo-600 dark:text-indigo-400 font-bold">Input:</span> {tc.input}</div>
                <div><span className="text-emerald-600 dark:text-emerald-400 font-bold">Output:</span> {tc.expectedOutput}</div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Constraints
              </h4>
              <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 3-Tier Progressive Hint Engine */}
          {problem.hints && problem.hints.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" /> Progressive Hint Engine
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">Unlocking hints incurs minor score penalty</span>
              </div>

              <div className="space-y-2">
                {problem.hints.map((hint) => {
                  const isUnlocked = unlockedHints.includes(hint.tier);
                  const isExpanded = expandedHintTier === hint.tier;

                  return (
                    <div key={hint.tier} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
                      <button
                        onClick={() => toggleHint(hint.tier)}
                        className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-850/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-5 w-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${isUnlocked ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                            {hint.tier}
                          </span>
                          <span>{hint.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!isUnlocked && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md">
                              -5% Score Penalty
                            </span>
                          )}
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-3.5 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-t border-slate-100 dark:border-slate-850"
                          >
                            {hint.text}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT PANE: Code Editor with Syntax Highlighting Mock & Language Config */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
        
        {/* Editor Toolbar Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-indigo-400" />
            <span className="font-extrabold text-slate-200 font-mono">solution.{language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'c' ? 'c' : 'js'}</span>
          </div>

          {/* Language Selector Dropdown */}
          <select
            value={language}
            onChange={(e) => handleLanguageSwitch(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {languages.map(l => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Code Editor Body */}
        <div className="flex-grow flex font-mono text-xs sm:text-sm bg-slate-950 relative overflow-hidden min-h-[420px]">
          {/* Line Numbers */}
          <div className="select-none py-4 px-3 text-right bg-slate-900/60 text-slate-600 border-r border-slate-850 min-w-[40px]">
            {lineNumbers.map(n => (
              <div key={n} className="leading-6">{n}</div>
            ))}
          </div>

          {/* Textarea Code Input */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Write code implementation here..."
            spellCheck="false"
            className="flex-grow w-full p-4 bg-transparent text-indigo-100 leading-6 resize-none focus:outline-none font-mono selection:bg-indigo-500/30"
          />
        </div>

        {/* Editor Status Bar */}
        <div className="bg-slate-900 border-t border-slate-850 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div>Length: {code.length} chars | Lines: {lineCount}</div>
          <div>Tab Size: 2 Spaces | UTF-8</div>
        </div>

      </div>

    </div>
  );
}
