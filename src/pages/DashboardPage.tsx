import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Award, 
  User, 
  Play 
} from 'lucide-react';
import { apiFetch } from '../api';

interface DashboardStats {
  resumeCount: number;
  sessionCount: number;
  averageScore: number;
  readinessLevel: string;
}

interface RecentActivity {
  id: string;
  type: 'resume' | 'interview';
  title: string;
  subtitle: string;
  score?: number;
  timestamp: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    resumeCount: 0,
    sessionCount: 0,
    averageScore: 0,
    readinessLevel: 'Calculating'
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Pull resumes and session histories concurrently using apiFetch
        const [resumes, interviews] = await Promise.all([
          apiFetch('/resumes').catch(() => []),
          apiFetch('/interviews/history').catch(() => [])
        ]);

        const average = interviews.length > 0
          ? Math.floor(interviews.reduce((acc: number, item: any) => acc + item.score, 0) / interviews.length)
          : 0;

        let readiness = 'Entry';
        if (average >= 90) readiness = 'Expert';
        else if (average >= 80) readiness = 'Strong';
        else if (average >= 70) readiness = 'Moderate';
        else if (average > 0) readiness = 'Needs Prep';

        setStats({
          resumeCount: resumes.length,
          sessionCount: interviews.length,
          averageScore: average,
          readinessLevel: readiness
        });

        // Map recent actions feed
        const mappedResumes: RecentActivity[] = resumes.slice(0, 3).map((r: any) => ({
          id: r.id,
          type: 'resume',
          title: `Resume Parsed: ${r.fileName}`,
          subtitle: `Target: ${r.parsedRole} | Exp: ${r.experience}`,
          score: r.matchScore,
          timestamp: new Date(r.createdAt).toLocaleDateString()
        }));

        const mappedInterviews: RecentActivity[] = interviews.slice(0, 3).map((i: any) => ({
          id: i._id || i.id,
          type: 'interview',
          title: `Mock Interview: ${i.role}`,
          subtitle: `Mode: ${i.type} | Difficulty: ${i.difficulty}`,
          score: i.score,
          timestamp: new Date(i.createdAt).toLocaleDateString()
        }));

        const combined = [...mappedResumes, ...mappedInterviews]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        setActivities(combined);
      } catch (err) {
        console.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      {/* Hero Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-indigo-900 to-slate-950 p-6 sm:p-8 rounded-3xl text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-350 text-xs sm:text-sm font-medium">Track your resume matches, mock practice scores, and AI evaluations.</p>
        </div>
        <button
          onClick={() => navigate('/resume-upload')}
          className="bg-white text-indigo-905 hover:bg-slate-50 text-slate-900 font-bold py-3 px-5 rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-center font-heading uppercase tracking-wider cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Upload New Resume
        </button>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Resumes Uploaded</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-850 dark:text-white mt-0.5">{stats.resumeCount}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-455">
            <Play className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Interviews Done</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-850 dark:text-white mt-0.5">{stats.sessionCount}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Average Rating</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-850 dark:text-white mt-0.5">{stats.averageScore}%</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Readiness Level</p>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-850 dark:text-white mt-0.5">{stats.readinessLevel}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activities (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Recent Activities</h3>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-slate-850 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl text-center space-y-3 bg-white dark:bg-slate-900/60">
              <p className="text-slate-400 text-sm font-medium">No actions logged yet. Upload your resume to start.</p>
              <button 
                onClick={() => navigate('/resume-upload')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                Go to Resume Upload <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div 
                  key={act.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-2.5xl flex items-center justify-between hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      act.type === 'resume' 
                        ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400' 
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450'
                    }`}>
                      {act.type === 'resume' ? <FileText className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-850 dark:text-white truncate max-w-[200px] sm:max-w-[350px]">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-slate-405 dark:text-slate-500 font-semibold">{act.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      {act.score !== undefined && (
                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                          act.score >= 85 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-455' 
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'
                        }`}>
                          {act.score}%
                        </span>
                      )}
                      <p className="text-[9px] text-slate-400 mt-1 font-semibold">{act.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Action Shortcuts (1/3) */}
        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">Quick Start Practice</h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Start a custom mock session instantly. We'll generate questions matching your default profile stack.
            </p>
            <button
              onClick={() => navigate('/practice')}
              className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3 px-5 rounded-xl shadow-md hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wide font-heading flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="h-4.5 w-4.5 fill-current" />
              Launch Interview Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
