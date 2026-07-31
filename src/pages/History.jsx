import React, { useState, useEffect } from 'react';
import { 
  getInterviewHistory, 
  deleteInterviewSession, 
  exportSessionToJsonFile 
} from '../services/storage';
import { 
  Search, 
  Trash2, 
  Download, 
  Calendar, 
  Clock, 
  X,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    setSessions(getInterviewHistory());
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this interview record?")) {
      const updated = deleteInterviewSession(id);
      setSessions(updated);
      if (selectedSession?.id === id) {
        setSelectedSession(null);
      }
    }
  };

  const handleExport = (e, session) => {
    e.stopPropagation();
    exportSessionToJsonFile(session);
  };

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450';
    if (score >= 70) return 'bg-amber-500/10 text-amber-600 dark:text-amber-500';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.roleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesScore = true;
    if (scoreFilter === 'high') matchesScore = session.totalScore >= 85;
    else if (scoreFilter === 'mid') matchesScore = session.totalScore >= 70 && session.totalScore < 85;
    else if (scoreFilter === 'low') matchesScore = session.totalScore < 70;

    let matchesDate = true;
    const sessionTime = new Date(session.date).getTime();
    const now = Date.now();
    if (dateFilter === '7days') matchesDate = (now - sessionTime) <= 7 * 24 * 60 * 60 * 1000;
    else if (dateFilter === '30days') matchesDate = (now - sessionTime) <= 30 * 24 * 60 * 60 * 1000;

    return matchesSearch && matchesScore && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Interview History</h2>
        <p className="text-slate-505 dark:text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
          Access your past mock practice sessions, replay transcripts, and read detailed AI evaluations.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl grid sm:grid-cols-3 gap-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by target role..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all"
          />
        </div>

        <div className="space-y-1 sm:space-y-0 flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 sm:block hidden shrink-0">Score Range</label>
          <select 
            value={scoreFilter} 
            onChange={(e) => setScoreFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs sm:text-sm text-slate-800 dark:text-slate-205 focus:outline-none focus:border-indigo-650"
          >
            <option value="all">All Scores</option>
            <option value="high">High Match (85%+)</option>
            <option value="mid">Average (70%-84%)</option>
            <option value="low">Needs Prep (&lt;70%)</option>
          </select>
        </div>

        <div className="space-y-1 sm:space-y-0 flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 sm:block hidden shrink-0">Date Range</label>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs sm:text-sm text-slate-800 dark:text-slate-205 focus:outline-none focus:border-indigo-650"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="border border-slate-200/60 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3 bg-white dark:bg-slate-900/60 shadow-inner">
          <p className="text-slate-400 text-sm font-semibold">No interview histories match your active filter search parameters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredSessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => { setSelectedSession(session); setSelectedAnswer(session.questions[0] || null); }}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl hover:shadow-xs hover:border-indigo-600/35 transition-all cursor-pointer flex flex-col justify-between min-h-[160px] text-left"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base truncate max-w-[200px] sm:max-w-[250px]">
                      {session.roleTitle}
                    </h4>
                    <p className="text-[10px] text-slate-405 dark:text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" /> {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${getScoreColor(session.totalScore)}`}>
                    {session.totalScore}% Match
                  </span>
                </div>

                <div className="flex gap-4 text-xs font-semibold text-slate-505 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDuration(session.durationSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span>{session.questionsCount} Questions</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850 mt-4">
                <button
                  onClick={(e) => handleExport(e, session)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Export JSON"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                  
                  <span className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-extrabold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-0.5">
                    View Report <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSession && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-5xl w-full h-[85vh] border border-slate-205 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left animate-scale-up">
            
            <div className="p-6 border-b border-slate-150 dark:border-slate-850 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/30">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 px-2.5 py-1 rounded-md">
                  Completed Practice Report
                </span>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white mt-2">
                  {selectedSession.roleTitle}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedSession(null)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow flex overflow-hidden flex-col md:flex-row">
              <div className="w-full md:w-80 border-r border-slate-150 dark:border-slate-850 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">Questions List</span>
                {selectedSession.questions.map((q) => (
                  <div 
                    key={q.questionId}
                    onClick={() => setSelectedAnswer(q)}
                    className={`p-3.5 rounded-2xl border cursor-pointer text-xs font-semibold transition-all ${
                      selectedAnswer?.questionId === q.questionId 
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-205 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        selectedAnswer?.questionId === q.questionId
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-500/10 text-indigo-655 dark:text-indigo-400'
                      }`}>
                        {q.category}
                      </span>
                      <span className="text-[9px] font-bold opacity-80">{q.aiFeedback.score}%</span>
                    </div>
                    <p className="line-clamp-2 leading-relaxed">{q.questionText}</p>
                  </div>
                ))}
              </div>

              {selectedAnswer && (
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Selected Question</span>
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-850 dark:text-white mt-1 leading-relaxed">
                        {selectedAnswer.questionText}
                      </h4>
                    </div>
                    
                    <div className={`px-4 py-2 rounded-xl text-center shrink-0 border ${getScoreColor(selectedAnswer.aiFeedback.score)}`}>
                      <p className="text-[8px] font-extrabold uppercase tracking-wider opacity-70">AI Score</p>
                      <span className="text-lg font-extrabold font-mono">{selectedAnswer.aiFeedback.score}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Your Answer Transcript</span>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/45 border border-slate-200/50 dark:border-slate-850 rounded-2.5xl text-xs sm:text-sm text-slate-800 dark:text-slate-205 leading-relaxed">
                      "{selectedAnswer.candidateAnswer}"
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-3 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-4 rounded-2.5xl">
                      <h5 className="font-heading font-extrabold text-xs text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4.5 w-4.5" /> Strengths Detected
                      </h5>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-semibold list-disc pl-4 leading-relaxed">
                        {selectedAnswer.aiFeedback.strengths.map((str, sIdx) => (
                          <li key={sIdx}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 p-4 rounded-2.5xl">
                      <h5 className="font-heading font-extrabold text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
                        <AlertTriangle className="h-4.5 w-4.5" /> Points to Improve
                      </h5>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-semibold list-disc pl-4 leading-relaxed">
                        {selectedAnswer.aiFeedback.improvements.map((imp, iIdx) => (
                          <li key={iIdx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 p-4 rounded-2.5xl">
                    <h5 className="font-heading font-extrabold text-xs text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5">
                      <TrendingUp className="h-4.5 w-4.5" /> Ideal Response Blueprint
                    </h5>
                    <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
                      {selectedAnswer.aiFeedback.idealAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
