import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, TrendingUp, Plus, ArrowRight, ShieldAlert, Award, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quickRole, setQuickRole] = useState('frontend');
  const [quickType, setQuickType] = useState('technical');
  const [quickDifficulty, setQuickDifficulty] = useState('medium');

  const handleStartInterview = () => {
    navigate('/resume-analyzer');
  };

  const handleQuickStart = (e) => {
    e.preventDefault();
    navigate('/interview', { state: { role: quickRole, type: quickType, difficulty: quickDifficulty } });
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const candidateFirstName = user?.name ? user.name.split(' ')[0] : 'Candidate';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-650/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2.5 relative z-10">
          <span className="bg-indigo-500/25 text-indigo-350 border border-indigo-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Premium Candidate Workspace
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold flex items-center gap-2.5 tracking-tight">
            Welcome back, {candidateFirstName}! <Sparkles className="h-6 w-6 text-amber-400 fill-current animate-pulse" />
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
            Your prep score is up 4% this week. You are currently in the top 15% of candidates preparers! Let's get you ready for your next big loop.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3.5 relative z-10 shrink-0 w-full lg:w-auto">
          <button
            onClick={handleStartInterview}
            className="flex-grow lg:flex-grow-0 bg-indigo-650 hover:bg-indigo-750 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm hover:scale-[1.02] active:scale-95 border border-indigo-600/35"
          >
            <Plus className="h-4.5 w-4.5" />
            Upload Resume
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="flex-grow lg:flex-grow-0 bg-white/10 hover:bg-white/15 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm border border-white/10 hover:border-white/20 active:scale-95"
          >
            Start Setup Prep
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Interviews */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2.5xl border border-slate-205/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between text-left transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Interviews Taken</span>
            <div className="bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-2.5 rounded-xl">
              <FileText className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">12 Sessions</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">8 completed, 4 drafts remaining</p>
          </div>
        </div>

        {/* Average Feedback Score */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2.5xl border border-slate-205/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between text-left transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Average Score</span>
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">82% Rating</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">+4% improvement vs last week</p>
          </div>
        </div>

        {/* Top Strengths */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2.5xl border border-slate-205/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between text-left transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Top Strengths</span>
            <div className="bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 p-2.5 rounded-xl">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-heading text-lg font-bold text-slate-900 dark:text-white truncate">React & virtual lists</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">Excellent technical precision & structural depth</p>
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2.5xl border border-slate-205/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between text-left transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">Areas to Improve</span>
            <div className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-heading text-lg font-bold text-slate-900 dark:text-white truncate">Filler Words & Pacing</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">Frequent use of "so" during behavioral STAR answers</p>
          </div>
        </div>
      </div>

      {/* Grid: Charts & Quick Start Widget */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Performance Chart Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm lg:col-span-2 space-y-4 text-left transition-colors duration-300">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Performance History</h4>
            <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Weekly Progression</span>
          </div>
          
          <div className="h-64 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl flex items-center justify-center p-4">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Axes & Grids */}
              <line x1="40" y1="20" x2="40" y2="170" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="currentColor" className="text-slate-100 dark:text-slate-900" strokeDasharray="4 4" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="currentColor" className="text-slate-100 dark:text-slate-900" strokeDasharray="4 4" />
              
              {/* Plot Path */}
              <path
                d="M40 150 L120 130 L200 110 L280 85 L360 95 L440 60"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Markers */}
              <circle cx="40" cy="150" r="5" fill="#4F46E5" />
              <circle cx="120" cy="130" r="5" fill="#4F46E5" />
              <circle cx="200" cy="110" r="5" fill="#4F46E5" />
              <circle cx="280" cy="85" r="5" fill="#4F46E5" />
              <circle cx="360" cy="95" r="5" fill="#4F46E5" />
              <circle cx="440" cy="60" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              
              {/* Axis Labeling */}
              <text x="15" y="154" fontSize="10" className="fill-slate-400 dark:fill-slate-655 font-bold">50%</text>
              <text x="15" y="124" fontSize="10" className="fill-slate-400 dark:fill-slate-655 font-bold">70%</text>
              <text x="15" y="74" fontSize="10" className="fill-slate-400 dark:fill-slate-655 font-bold">90%</text>
              
              <text x="40" y="188" fontSize="10" className="fill-slate-400 dark:fill-slate-500 font-semibold" textAnchor="middle">Session 1</text>
              <text x="120" y="188" fontSize="10" className="fill-slate-400 dark:fill-slate-500 font-semibold" textAnchor="middle">Session 2</text>
              <text x="200" y="188" fontSize="10" className="fill-slate-400 dark:fill-slate-500 font-semibold" textAnchor="middle">Session 3</text>
              <text x="280" y="188" fontSize="10" className="fill-slate-400 dark:fill-slate-500 font-semibold" textAnchor="middle">Session 4</text>
              <text x="360" y="188" fontSize="10" className="fill-slate-400 dark:fill-slate-500 font-semibold" textAnchor="middle">Session 5</text>
              <text x="440" y="188" fontSize="10" fill="#4F46E5" className="font-extrabold" textAnchor="middle">Latest</text>
            </svg>
          </div>
        </div>

        {/* Quick Start Widget */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between text-left transition-colors duration-300">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Quick Start Session</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Bypass resume analysis and launch directly</p>
          </div>

          <form onSubmit={handleQuickStart} className="space-y-4 pt-4 flex-grow flex flex-col justify-between">
            <div className="space-y-3">
              {/* Target Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Target Role</label>
                <select
                  value={quickRole}
                  onChange={(e) => setQuickRole(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
                >
                  <option value="frontend">Frontend Web Developer</option>
                  <option value="backend">Backend Systems Engineer</option>
                  <option value="uiux">UI/UX & Product Designer</option>
                  <option value="fullstack">Full Stack Engineer</option>
                </select>
              </div>

              {/* Focus Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Focus Type</label>
                <select
                  value={quickType}
                  onChange={(e) => setQuickType(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
                >
                  <option value="technical">Technical Coding & Frameworks</option>
                  <option value="behavioral">Behavioral (STAR Method)</option>
                  <option value="system_design">System Architecture Design</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Difficulty</label>
                <select
                  value={quickDifficulty}
                  onChange={(e) => setQuickDifficulty(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer"
                >
                  <option value="easy">Easy (Associate / Junior)</option>
                  <option value="medium">Medium (Mid-level Developer)</option>
                  <option value="hard">Hard (Lead / Architect)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 text-xs font-heading tracking-wide uppercase"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Launch Room
            </button>
          </form>
        </div>

      </div>

      {/* History List Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-4 text-left transition-colors duration-300">
        <div>
          <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Recent Practice History</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Showing evaluation summaries of your last three mock sessions</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-550 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="pb-3.5 pt-2">Session Date</th>
                <th className="pb-3.5 pt-2">Target Interview Role</th>
                <th className="pb-3.5 pt-2">Focus Mode</th>
                <th className="pb-3.5 pt-2">Evaluated Duration</th>
                <th className="pb-3.5 pt-2">Overall Score</th>
                <th className="pb-3.5 pt-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                <td className="py-4 text-slate-650 dark:text-slate-400 font-medium">Jul 22, 2026</td>
                <td className="py-4 font-bold text-slate-900 dark:text-white">Frontend Web Developer</td>
                <td className="py-4 text-slate-600 dark:text-slate-400 text-xs">Technical (Vite, virtual lists)</td>
                <td className="py-4 text-slate-600 dark:text-slate-400">18 mins</td>
                <td className="py-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm">82% Good</span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={handleViewResults} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-all cursor-pointer">
                    View Report
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                <td className="py-4 text-slate-650 dark:text-slate-400 font-medium">Jul 19, 2026</td>
                <td className="py-4 font-bold text-slate-900 dark:text-white">Full Stack Engineer</td>
                <td className="py-4 text-slate-600 dark:text-slate-400 text-xs">System Architecture Design</td>
                <td className="py-4 text-slate-600 dark:text-slate-400">22 mins</td>
                <td className="py-4">
                  <span className="bg-indigo-605 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm">75% Competent</span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={handleViewResults} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-all cursor-pointer">
                    View Report
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                <td className="py-4 text-slate-650 dark:text-slate-400 font-medium">Jul 15, 2026</td>
                <td className="py-4 font-bold text-slate-900 dark:text-white">UI/UX & Product Designer</td>
                <td className="py-4 text-slate-600 dark:text-slate-400 text-xs">Behavioral (STAR Method)</td>
                <td className="py-4 text-slate-600 dark:text-slate-400">15 mins</td>
                <td className="py-4">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm">68% Needs Review</span>
                </td>
                <td className="py-4 text-right">
                  <button onClick={handleViewResults} className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold transition-all cursor-pointer">
                    View Report
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
