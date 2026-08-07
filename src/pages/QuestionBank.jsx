import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, GraduationCap, ArrowRight, Code2, Brain, Target, BookOpen } from 'lucide-react';
import CodeEditorPane from '../components/coding/CodeEditorPane';
import TestCaseRunner from '../components/coding/TestCaseRunner';
import AptitudeQuiz from '../components/aptitude/AptitudeQuiz';
import TopicDrills from '../components/practice/TopicDrills';
import { SAMPLE_CODING_CHALLENGES, STARTER_TEMPLATES } from '../services/codeRunnerService';

export default function QuestionBank() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'coding'); // 'coding', 'aptitude', 'drills', 'bank'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');

  // Coding Sandbox State
  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(STARTER_TEMPLATES.javascript);

  const activeChallenge = SAMPLE_CODING_CHALLENGES[selectedChallengeIdx] || SAMPLE_CODING_CHALLENGES[0];

  const questions = [
    { id: 1, topic: "react", difficulty: "medium", question: "What is the difference between useMemo and useCallback? When would you use one over the other?" },
    { id: 2, topic: "react", difficulty: "easy", question: "Explain the virtual DOM and how React updates the UI on state changes." },
    { id: 3, topic: "system_design", difficulty: "hard", question: "How would you design a scalable notification system that can handle 10,000 requests per second?" },
    { id: 4, topic: "system_design", difficulty: "hard", question: "Design a rate limiter for an API. What strategies and data structures would you use?" },
    { id: 5, topic: "algorithms", difficulty: "medium", question: "Given a binary tree, write a function to return its level-order traversal." },
    { id: 6, topic: "algorithms", difficulty: "easy", question: "Write a function to check if a string is a valid palindrome, ignoring casing and special characters." },
    { id: 7, topic: "behavioral", difficulty: "medium", question: "Describe a time when you had to debug a production bottleneck. How did you resolve it?" },
    { id: 8, topic: "behavioral", difficulty: "easy", question: "How do you handle disagreements with engineering peers regarding architectural decisions?" }
  ];

  const handlePractice = (q) => {
    navigate('/practice', { state: { role: q.topic === 'react' ? 'frontend' : 'fullstack' } });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === 'all' || q.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow text-left">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Assessment & Practice Hub
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Master live programming challenges, quantitative aptitude drills, and targeted skill practice.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex gap-1.5 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start">
          {[
            { id: 'coding', label: 'Coding Sandbox', icon: Code2 },
            { id: 'aptitude', label: 'Aptitude Tests', icon: Brain },
            { id: 'drills', label: 'Topic Drills', icon: Target },
            { id: 'bank', label: 'Question Bank', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-heading flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: CODING SANDBOX */}
      {activeTab === 'coding' && (
        <div className="space-y-6 animate-fade-in">
          {/* Challenge Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Select Challenge:</span>
            {SAMPLE_CODING_CHALLENGES.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => { setSelectedChallengeIdx(idx); setCode(STARTER_TEMPLATES[language] || ''); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedChallengeIdx === idx
                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {ch.title}
              </button>
            ))}
          </div>

          <CodeEditorPane
            problem={activeChallenge}
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
          />

          <TestCaseRunner
            problem={activeChallenge}
            code={code}
            language={language}
          />
        </div>
      )}

      {/* TAB 2: APTITUDE TESTS */}
      {activeTab === 'aptitude' && (
        <div className="animate-fade-in">
          <AptitudeQuiz />
        </div>
      )}

      {/* TAB 3: TOPIC DRILLS */}
      {activeTab === 'drills' && (
        <div className="animate-fade-in">
          <TopicDrills />
        </div>
      )}

      {/* TAB 4: CURATED QUESTION BANK */}
      {activeTab === 'bank' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filter and Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
            <div className="relative w-full md:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search interview questions..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-600 focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['all', 'react', 'system_design', 'algorithms', 'behavioral'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setFilterTopic(topic)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filterTopic === topic
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {topic.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid sm:grid-cols-2 gap-6 items-stretch">
            {filteredQuestions.map((q) => {
              const diffColors = {
                easy: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
                medium: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
                hard: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
              };

              return (
                <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 text-left hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${diffColors[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" /> {q.topic.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-850">
                    <button
                      onClick={() => handlePractice(q)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Practice this question <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
