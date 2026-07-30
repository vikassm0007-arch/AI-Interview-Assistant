import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronDown, Award, HelpCircle, BookOpen, Check } from 'lucide-react';
import { GeneratedQuestion } from '../../server/services/questionGenerator'; // Import type reference

interface QuestionListProps {
  questions: GeneratedQuestion[];
  targetRole: string;
}

export default function QuestionList({ questions, targetRole }: QuestionListProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Technical' | 'Behavioral' | 'System Design' | 'Resume Deep Dive'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    { id: 'All', label: 'All Questions' },
    { id: 'Technical', label: 'Technical' },
    { id: 'Behavioral', label: 'Behavioral' },
    { id: 'System Design', label: 'System Design' },
    { id: 'Resume Deep Dive', label: 'Resume Specific' }
  ];

  const filteredQuestions = activeTab === 'All' 
    ? questions 
    : questions.filter(q => q.category === activeTab);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-500';
      case 'Hard':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
      default:
        return 'bg-slate-500/10 text-slate-600';
    }
  };

  const handleStartPractice = (categorySelection: string) => {
    // Redirect to active interview page passing category and role
    navigate('/interview', {
      state: {
        role: targetRole,
        focusType: categorySelection.toLowerCase(),
        difficulty: 'medium'
      }
    });
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-650 dark:text-indigo-400" /> AI-Generated Practice Set
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            We generated {questions.length} custom interview questions tailored specifically to your parsed qualifications.
          </p>
        </div>
        <button
          onClick={() => handleStartPractice(activeTab)}
          className="bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3 px-5 rounded-xl shadow-md hover:scale-[1.01] active:scale-99 transition-all text-xs uppercase tracking-wide font-heading flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Play className="h-4 w-4 fill-current" />
          Practice Selected Set
        </button>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex overflow-x-auto gap-1.5 p-1 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl bg-white/60 dark:bg-slate-950/20 backdrop-blur-md">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveTab(cat.id as any); setExpandedId(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === cat.id
                ? 'bg-indigo-605 bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredQuestions.map((q) => (
          <div 
            key={q.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2.5xl overflow-hidden transition-all duration-300 hover:shadow-xs"
          >
            {/* Header Accordion Toggle */}
            <div 
              onClick={() => toggleExpand(q.id)}
              className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
            >
              <div className="space-y-2 flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${getDifficultyStyles(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-650 dark:text-indigo-400">
                    {q.category === 'Resume Deep Dive' ? 'Resume Specific' : q.category}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-normal pr-4">
                  {q.question}
                </h4>
              </div>

              <button className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 shrink-0 text-slate-400 mt-1">
                <ChevronDown className={`h-5 w-5 transition-transform duration-350 ${expandedId === q.id ? 'rotate-185' : ''}`} />
              </button>
            </div>

            {/* Accordion Content Details */}
            {expandedId === q.id && (
              <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-850 pt-4 space-y-4 bg-slate-50/20 dark:bg-slate-950/10 animate-fade-in">
                {/* Reasoning Panel */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5 fill-current" /> Why this was asked
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {q.contextReasoning}
                  </p>
                </div>

                {/* Key Concepts list */}
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Suggested concepts to cover</p>
                  <div className="flex flex-wrap gap-1.5">
                    {q.keyTopics.map((topic, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-505 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 px-3 py-1 rounded-xl"
                      >
                        <Check className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practice Individual Question */}
                <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => handleStartPractice(q.category)}
                    className="bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> Practice this question
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
