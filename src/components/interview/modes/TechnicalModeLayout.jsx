import React, { useState, useEffect } from 'react';
import { Play, HelpCircle, Code, ShieldAlert, Sparkles, Terminal, ChevronRight, CheckCircle } from 'lucide-react';

export default function TechnicalModeLayout({
  activeQuestion,
  textAnswer,
  setTextAnswer
}) {
  const [language, setLanguage] = useState('javascript');
  const [hintLevel, setHintLevel] = useState(0); // 0: none, 1: hint1, 2: hint2
  const [scorePenalty, setScorePenalty] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');

  // Populate code template when question changes
  useEffect(() => {
    if (activeQuestion?.codeTemplate) {
      setTextAnswer(activeQuestion.codeTemplate);
    } else {
      setTextAnswer('// Write your solution here...');
    }
    setHintLevel(0);
    setScorePenalty(0);
    setTerminalOutput('');
  }, [activeQuestion, setTextAnswer]);

  const handleShowHint = (level) => {
    if (level === 1 && hintLevel < 1) {
      setHintLevel(1);
      setScorePenalty(prev => prev + 5);
    } else if (level === 2 && hintLevel < 2) {
      setHintLevel(2);
      setScorePenalty(prev => prev + 10);
    }
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTerminalOutput('Compiling code files...\nInitializing test runner hooks...\n');

    setTimeout(() => {
      setTerminalOutput(prev => prev + 'Running Mock Unit Tests...\n');
      setTimeout(() => {
        const testsPassed = activeQuestion.testCases?.length || 1;
        setTerminalOutput(prev => prev + `\n✓ Success: All mock unit tests passed! (${testsPassed}/${testsPassed} passed)\nExecution Time: 12ms\nMemory Allocation: 4.8MB`);
        setIsRunning(false);
      }, 700);
    }, 600);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 items-stretch text-left animate-fade-in flex-grow">
      
      {/* 1. Left Pane: Problem Description & Hints */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-2.5 py-1 rounded-md">
              Problem constraints
            </span>
            {scorePenalty > 0 && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-md animate-pulse">
                -{scorePenalty} Hint Penalty
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
              Coding Challenge:
            </h4>
            <p className="text-xs sm:text-sm text-slate-655 dark:text-slate-350 leading-relaxed font-semibold">
              {activeQuestion.question}
            </p>
          </div>

          {/* Constraints */}
          {activeQuestion.constraints && (
            <div className="space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Execution Constraints</p>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-505 dark:text-slate-400 leading-relaxed font-semibold">
                {activeQuestion.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Progressive hints triggers */}
        <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-850">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Progressive Hints</p>
          
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleShowHint(1)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hintLevel >= 1 
                  ? 'bg-indigo-500/10 text-indigo-655 dark:text-indigo-405' 
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-505 dark:text-slate-400'
              }`}
            >
              💡 Conceptual Hint (-5 pts)
            </button>
            <button
              type="button"
              disabled={hintLevel < 1}
              onClick={() => handleShowHint(2)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                hintLevel >= 2 
                  ? 'bg-indigo-500/10 text-indigo-655 dark:text-indigo-405' 
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-505 dark:text-slate-400'
              }`}
            >
              💡 Architectural Hint (-10 pts)
            </button>
          </div>

          {/* Hint content details */}
          {hintLevel >= 1 && (
            <div className="bg-slate-50 dark:bg-slate-950/45 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-xs text-slate-655 dark:text-slate-400 leading-relaxed font-semibold animate-fade-in">
              <p className="font-bold text-slate-800 dark:text-white mb-0.5">Conceptual Clue:</p>
              {activeQuestion.hint1}
              {hintLevel >= 2 && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  <p className="font-bold text-slate-800 dark:text-white mb-0.5">Architectural approach:</p>
                  {activeQuestion.hint2}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Pane: Code Editor & Terminal runner */}
      <div className="flex flex-col gap-4 flex-grow">
        {/* Editor Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-4 flex-grow flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-405 dark:text-slate-500 block">
              💻 Workspace Console
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-[11px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python 3</option>
              <option value="java">Java 17</option>
              <option value="sql">PostgreSQL SQL</option>
            </select>
          </div>

          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="w-full flex-grow min-h-[220px] p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none border border-slate-850 select-text resize-none"
            spellCheck={false}
          />
        </div>

        {/* Terminal Run tests output box */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl space-y-3 shrink-0 text-left">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-slate-500" /> Terminal Output
            </span>
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-1.5 px-3.5 rounded-xl text-[10px] uppercase tracking-wide transition-all cursor-pointer disabled:opacity-40"
            >
              {isRunning ? 'Running...' : 'Run Code Tests'}
            </button>
          </div>

          <pre className="text-[11px] font-mono text-slate-300 max-h-24 overflow-y-auto leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/60 min-h-[50px] whitespace-pre-wrap">
            {terminalOutput ? terminalOutput : 'Compile and run tests output will appear here...'}
          </pre>
        </div>
      </div>

    </div>
  );
}
