import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  GraduationCap, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Layers, 
  MessageSquare, 
  Brain, 
  X, 
  Sparkles, 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { getFilteredQuestions } from '../../services/questionBankService';
import { evaluateAnswerWithAI, EvaluationStates } from '../../services/aiEvaluationService';
import EvaluationDashboard from '../interview/EvaluationDashboard';

export default function QuestionBank() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive Practice Modal State
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [evaluationState, setEvaluationState] = useState(EvaluationStates.IDLE);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // STAR Checklist for Behavioral workspace
  const [starChecklist, setStarChecklist] = useState({
    situation: false,
    task: false,
    action: false,
    result: false
  });

  const categories = ['All', 'React', 'System Design', 'Algorithms', 'Behavioral', 'Aptitude'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const states = ['All Questions', 'Practiced', 'Bookmarked'];

  const filteredQuestions = getFilteredQuestions({
    category: selectedCategory,
    difficulty: selectedDifficulty,
    stateFilter: selectedState === 'All Questions' ? 'All' : selectedState,
    search: searchTerm
  });

  const handleOpenPracticeModal = (question) => {
    setActiveQuestion(question);
    setPracticeAnswer(question.codeTemplate || '');
    setEvaluationResult(null);
    setEvaluationState(EvaluationStates.IDLE);
    setStarChecklist({ situation: false, task: false, action: false, result: false });
  };

  const handleClosePracticeModal = () => {
    setActiveQuestion(null);
    setEvaluationResult(null);
    setEvaluationState(EvaluationStates.IDLE);
  };

  const handleSubmitPractice = async () => {
    if (!activeQuestion || !practiceAnswer.trim()) return;

    try {
      const result = await evaluateAnswerWithAI(
        'Candidate Role',
        activeQuestion,
        practiceAnswer,
        180,
        (state) => setEvaluationState(state)
      );

      // Attach star metrics if behavioral
      if (activeQuestion.category === 'Behavioral') {
        result.starCompliance = starChecklist;
      }

      setEvaluationResult(result);
    } catch (err) {
      console.error("Evaluation error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow text-left">
      
      {/* Header Summary */}
      <div className="space-y-2">
        <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Categorized Practice & Question Bank
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
          Filter curated technical, architectural, and behavioral challenges to launch category-tailored practice workspaces.
        </p>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Top Row: Search input & State filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, question title or key concepts..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-600 focus:outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-950 font-medium"
            />
          </div>

          {/* State Filter */}
          <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850">
            {states.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedState === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Row: Category Pills & Difficulty Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-850">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0">Difficulty:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* QUESTION CARDS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredQuestions.map((q) => {
          const diffBadges = {
            Easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
            Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
            Hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
          };

          return (
            <div 
              key={q.id} 
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 text-left hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Header Metadata */}
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${diffBadges[q.difficulty] || diffBadges.Medium}`}>
                    {q.difficulty}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> {q.estimatedTime}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {q.category}
                  </span>
                  <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                    {q.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed">
                  {q.description}
                </p>
              </div>

              {/* Action Trigger */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">
                  {q.practiced ? '✓ Practiced' : 'Not Attempted'}
                </span>
                <button
                  onClick={() => handleOpenPracticeModal(q)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-heading flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Practice <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CATEGORY-TAILORED INTERACTIVE PRACTICE WORKSPACE MODAL */}
      <AnimatePresence>
        {activeQuestion && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 max-w-4xl w-full border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto relative"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-850">
                <div className="space-y-1">
                  <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
                    {activeQuestion.category} Practice Workspace
                  </span>
                  <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl mt-1">
                    {activeQuestion.title}
                  </h3>
                </div>
                <button
                  onClick={handleClosePracticeModal}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* EVALUATION RESULTS VIEW IF SUBMITTED */}
              {evaluationResult ? (
                <div className="space-y-6">
                  <EvaluationDashboard evaluation={evaluationResult} />
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleClosePracticeModal}
                      className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Close Workspace
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Problem Prompt */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    <p>{activeQuestion.description}</p>
                    {activeQuestion.constraints && (
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-850">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Constraints:</span>
                        <ul className="list-disc pl-5 text-xs text-slate-500 font-mono space-y-0.5">
                          {activeQuestion.constraints.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* TAILORED WORKSPACE INPUT PANELS */}

                  {/* 1. React & Algorithms: Code / Markdown Editor */}
                  {(activeQuestion.category === 'React' || activeQuestion.category === 'Algorithms') && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Code Solution & Technical Implementation
                      </label>
                      <textarea
                        rows={10}
                        value={practiceAnswer}
                        onChange={(e) => setPracticeAnswer(e.target.value)}
                        placeholder="// Write your solution implementation here..."
                        className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-indigo-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-indigo-600 resize-none"
                      />
                    </div>
                  )}

                  {/* 2. System Design: Architectural Notes Workspace */}
                  {activeQuestion.category === 'System Design' && (
                    <div className="space-y-4">
                      {activeQuestion.architecturalPrompt?.checklist && (
                        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-2 text-xs">
                          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px] block">
                            Key Architectural Checklist Items
                          </span>
                          <div className="grid sm:grid-cols-2 gap-2 font-medium text-slate-700 dark:text-slate-300">
                            {activeQuestion.architecturalPrompt.checklist.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                          Architectural Design & Data Flow Write-up
                        </label>
                        <textarea
                          rows={8}
                          value={practiceAnswer}
                          onChange={(e) => setPracticeAnswer(e.target.value)}
                          placeholder="Detail your component architecture, database choices, caching layers, and throughput calculations..."
                          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:border-indigo-600 resize-none font-sans"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. Behavioral: STAR Method Tracker Panel */}
                  {activeQuestion.category === 'Behavioral' && (
                    <div className="space-y-4">
                      {/* STAR Checklist Pills */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 space-y-2 text-xs">
                        <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] block">
                          STAR Method Response Coverage Tracker
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { key: 'situation', label: 'Situation' },
                            { key: 'task', label: 'Task' },
                            { key: 'action', label: 'Action' },
                            { key: 'result', label: 'Result' }
                          ].map(s => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => setStarChecklist(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                              className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                                starChecklist[s.key]
                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-400'
                              }`}
                            >
                              {starChecklist[s.key] ? '✓ ' : '+ '}{s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                          Behavioral Response Transcript
                        </label>
                        <textarea
                          rows={8}
                          value={practiceAnswer}
                          onChange={(e) => setPracticeAnswer(e.target.value)}
                          placeholder="Type or record your STAR method behavioral response..."
                          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:border-indigo-600 resize-none font-sans"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Aptitude: Written Calculation Workspace */}
                  {activeQuestion.category === 'Aptitude' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Scratchpad Calculation & Formula Output
                      </label>
                      <textarea
                        rows={6}
                        value={practiceAnswer}
                        onChange={(e) => setPracticeAnswer(e.target.value)}
                        placeholder="Write your step-by-step mathematical steps and final answer..."
                        className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:outline-none focus:border-indigo-600 resize-none font-mono"
                      />
                    </div>
                  )}

                  {/* Loading Shimmer State */}
                  {evaluationState !== EvaluationStates.IDLE && (
                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>
                        {evaluationState === EvaluationStates.SENDING_PAYLOAD && "Formatting payload with rubric constraints..."}
                        {evaluationState === EvaluationStates.ANALYZING_TRANSCRIPT && "Analyzing technical depth & STAR structure..."}
                        {evaluationState === EvaluationStates.GENERATING_METRICS && "Computing Tri-Factor scores & model benchmarks..."}
                      </span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <button
                      onClick={handleClosePracticeModal}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSubmitPractice}
                      disabled={!practiceAnswer.trim() || evaluationState !== EvaluationStates.IDLE}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md text-xs uppercase tracking-wider font-heading flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" /> Submit to AI Evaluation
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
