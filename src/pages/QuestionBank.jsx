import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GraduationCap, ArrowRight, Star } from 'lucide-react';

export default function QuestionBank() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');

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
    // Navigate to practice setup with prefilled parameters
    navigate('/practice', { state: { role: q.topic === 'react' ? 'frontend' : 'fullstack' } });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === 'all' || q.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
          Curated Question Bank
        </h2>
        <p className="text-slate-500 text-sm">
          Browse and filter mock interview questions prepared by industry experts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-brand-platinum shadow-sm">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md text-left">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search interview questions..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-platinum focus:border-brand-indigo focus:outline-none text-sm text-slate-800 bg-slate-50/50"
          />
        </div>

        {/* Topics Filter */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['all', 'react', 'system_design', 'algorithms', 'behavioral'].map((topic) => (
            <button
              key={topic}
              onClick={() => setFilterTopic(topic)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterTopic === topic
                  ? 'bg-brand-indigo text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {topic.replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Questions list */}
      <div className="grid sm:grid-cols-2 gap-6 items-stretch">
        {filteredQuestions.map((q) => {
          const diffColors = {
            easy: 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20',
            medium: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20',
            hard: 'bg-red-500/10 text-red-600 border-red-500/20'
          };

          return (
            <div key={q.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 text-left hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${diffColors[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" /> {q.topic.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {q.question}
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => handlePractice(q)}
                  className="text-xs font-bold text-brand-indigo hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Practice this question
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
