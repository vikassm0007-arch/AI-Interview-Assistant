import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, Building2, Code2, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopicDrills() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState('coding'); // 'coding' or 'aptitude'
  const [targetCompany, setTargetCompany] = useState('FAANG');
  const [selectedTopic, setSelectedTopic] = useState('Arrays & Dynamic Programming');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);

  const codingTopics = [
    'Arrays & Dynamic Programming',
    'Trees, Graphs & BFS/DFS',
    'System Architecture & Microservices',
    'SQL, Indexing & Query Tuning'
  ];

  const aptitudeTopics = [
    'Quantitative Aptitude & Math Speed',
    'Logical Reasoning & Matrix Puzzles',
    'Verbal Deduction & Reading Comprehension'
  ];

  const companies = ['FAANG / Big Tech', 'FinTech & Trading', 'High-Growth Startup', 'Enterprise / Consulting'];

  const handleLaunchDrill = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (selectedDomain === 'coding') {
        navigate('/interview', { 
          state: { 
            mode: 'TECHNICAL', 
            role: selectedTopic,
            difficulty 
          } 
        });
      } else {
        // Launch Aptitude drill
        navigate('/question-bank', { state: { tab: 'aptitude' } });
      }
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8 text-left">
      
      {/* Header */}
      <div>
        <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3 fill-current" /> Standalone Practice Engine
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Targeted Topic Drills & Practice
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
          Generate infinite fresh coding challenges and aptitude speed tests customized to your target company and weak areas.
        </p>
      </div>

      {/* Configuration Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        
        {/* Domain Switcher */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
            1. Select Assessment Domain
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedDomain('coding')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedDomain === 'coding'
                  ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Code2 className="h-6 w-6 text-indigo-500 shrink-0" />
              <div>
                <div className="text-sm font-bold">Coding & Algorithms</div>
                <div className="text-[11px] font-normal text-slate-500">Live multi-language code runner with test cases</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedDomain('aptitude')}
              className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                selectedDomain === 'aptitude'
                  ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Brain className="h-6 w-6 text-indigo-500 shrink-0" />
              <div>
                <div className="text-sm font-bold">Aptitude & Reasoning</div>
                <div className="text-[11px] font-normal text-slate-500">Timed MCQs with virtual calculator & derivations</div>
              </div>
            </button>
          </div>
        </div>

        {/* Target Company Setting */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
            2. Target Company Persona
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {companies.map((c) => (
              <button
                key={c}
                onClick={() => setTargetCompany(c)}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  targetCompany === c
                    ? 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Focus */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
            3. Weak Area Focus Area
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
          >
            {(selectedDomain === 'coding' ? codingTopics : aptitudeTopics).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Launch Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
          <button
            onClick={handleLaunchDrill}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-600/20 text-xs uppercase tracking-wider font-heading flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Zap className="h-4 w-4" /> Launch {selectedDomain === 'coding' ? 'Coding Challenge' : 'Aptitude Speed Test'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
