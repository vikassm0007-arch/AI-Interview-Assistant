import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, XCircle, RefreshCw, Cpu, HardDrive, Sparkles, Terminal, BookOpen, AlertOctagon } from 'lucide-react';
import { executeCode } from '../../services/codeRunnerService';

export default function TestCaseRunner({ problem, code, language }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [showOptimalSolution, setShowOptimalSolution] = useState(false);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    const result = await executeCode(code, language, problem.sampleTestCases || []);
    setExecutionResult(result);
    setIsExecuting(false);
  };

  const handleSubmitCode = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    const allCases = [...(problem.sampleTestCases || []), ...(problem.hiddenTestCases || [])];
    const result = await executeCode(code, language, allCases);
    setExecutionResult(result);
    setIsExecuting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm text-left">
      
      {/* Control Bar: Run vs Submit */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base">
            Test Case Execution Console
          </h4>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider font-heading flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />} Run Code
          </button>

          <button
            onClick={handleSubmitCode}
            disabled={isExecuting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-emerald-600/20 text-xs uppercase tracking-wider font-heading flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Submit Solution
          </button>
        </div>
      </div>

      {/* Execution Results View */}
      {executionResult ? (
        <div className="space-y-5 animate-fade-in">
          
          {/* Compilation Error View */}
          {executionResult.compilationError ? (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertOctagon className="h-5 w-5" /> Compilation Failed
              </div>
              <pre className="whitespace-pre-wrap">{executionResult.compilationError}</pre>
            </div>
          ) : (
            <>
              {/* Top Metrics Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850">
                <div className="flex items-center gap-3">
                  {executionResult.allPassed ? (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 border border-emerald-500/20">
                      <CheckCircle2 className="h-4 w-4" /> All Test Cases Passed
                    </span>
                  ) : (
                    <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 border border-rose-500/20">
                      <XCircle className="h-4 w-4" /> Test Cases Failed
                    </span>
                  )}
                </div>

                {executionResult.metrics && (
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-indigo-500" /> Runtime: <span className="font-bold text-slate-900 dark:text-white">{executionResult.metrics.overallRuntime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="h-3.5 w-3.5 text-indigo-500" /> Memory: <span className="font-bold text-slate-900 dark:text-white">{executionResult.metrics.memoryConsumed}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Test Case Tabs & Detail */}
              <div className="space-y-3">
                <div className="flex gap-2 border-b border-slate-100 dark:border-slate-850 overflow-x-auto pb-2">
                  {executionResult.testResults.map((tc, idx) => (
                    <button
                      key={tc.id}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition-colors ${
                        activeTab === idx 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {tc.passed ? (
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-rose-400" />
                      )}
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Active Test Case Detail Card */}
                {executionResult.testResults[activeTab] && (
                  <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 space-y-3 text-xs font-mono">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold block">Input:</span>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                          {executionResult.testResults[activeTab].input}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold block">Expected Output:</span>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-bold">
                          {executionResult.testResults[activeTab].expectedOutput}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold block">Actual Output:</span>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
                        {executionResult.testResults[activeTab].actualOutput}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Solution Analysis & Optimal Solution Button */}
              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={() => setShowOptimalSolution(!showOptimalSolution)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" /> {showOptimalSolution ? 'Hide Optimal Solution' : 'Reveal AI Optimal Solution & Complexity Analysis'}
                </button>
              </div>

              {/* Optimal Solution Side-by-Side Reveal */}
              {showOptimalSolution && (
                <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-4 animate-fade-in text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                    <Sparkles className="h-4 w-4 text-indigo-500" /> AI Optimal Solution Benchmarks
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 font-mono">
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/10">
                      <div className="font-bold text-slate-500 mb-1">Time Complexity Target</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">O(N) - Linear Scan</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/10">
                      <div className="font-bold text-slate-500 mb-1">Space Complexity Target</div>
                      <div className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">O(N) - Hash Table</div>
                    </div>
                  </div>

                  {problem.optimalSolutions?.[language] && (
                    <div className="space-y-1.5 font-mono">
                      <span className="text-slate-400 font-bold block">Optimal Code Reference:</span>
                      <pre className="p-4 rounded-xl bg-slate-950 text-indigo-200 overflow-x-auto">
                        {problem.optimalSolutions[language]}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-xs font-semibold">
          Click "Run Code" to test sample test cases or "Submit Solution" to run against all hidden validation cases.
        </div>
      )}

    </div>
  );
}
