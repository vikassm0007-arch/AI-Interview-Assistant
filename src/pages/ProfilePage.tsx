import React, { useState, useEffect } from 'react';
import { User, Settings, Award, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '../api';

interface UserProfile {
  name: string;
  email: string;
  targetJobTitle: string;
  experienceLevel: string;
  credits: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Vikas S.',
    email: 'vikas@example.com',
    targetJobTitle: 'Frontend Developer',
    experienceLevel: 'mid',
    credits: 8
  });
  const [techStack, setTechStack] = useState<string[]>(["React.js", "TypeScript", "TailwindCSS", "Node.js"]);
  const [newTech, setNewTech] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load initial user details from backend auth profile endpoint
    apiFetch('/auth/profile')
      .then(data => {
        if (data) {
          setProfile({
            name: data.name,
            email: data.email,
            targetJobTitle: data.targetJobTitle || '',
            experienceLevel: data.experienceLevel || 'mid',
            credits: data.credits || 8
          });
        }
      })
      .catch(() => {
        // Fallback to local default states in offline mode
      });
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    // Mock save delay - in production this POSTs /api/auth/profile
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 800);
  };

  const addTechTag = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack(prev => [...prev, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTechTag = (tag: string) => {
    setTechStack(prev => prev.filter(t => t !== tag));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Profile Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
          Manage your default role configurations, target technology stacks, and monthly tokens.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Avatar & Account Meta (1/3) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4">
            <div className="h-20 w-20 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/25 text-indigo-650 dark:text-indigo-400 flex items-center justify-center font-heading font-extrabold text-2xl border border-indigo-500/10 mx-auto shadow-inner">
              VS
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg">{profile.name}</h4>
              <p className="text-xs text-slate-405 dark:text-slate-500 font-semibold">{profile.email}</p>
            </div>

            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-3 rounded-2xl flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Monthly Balance</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-450">{profile.credits} Credits</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Forms Settings (2/3) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Job Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Target Job Title
                </label>
                <input 
                  type="text" 
                  value={profile.targetJobTitle}
                  onChange={(e) => setProfile(prev => ({ ...prev, targetJobTitle: e.target.value }))}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-650"
                />
              </div>

              {/* Experience level */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Experience Level
                </label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-650"
                >
                  <option value="entry">Entry Level (&lt; 2 yrs)</option>
                  <option value="mid">Mid Level (2-5 yrs)</option>
                  <option value="senior">Senior Level (5-8 yrs)</option>
                  <option value="lead">Lead / Principal (8+ yrs)</option>
                </select>
              </div>
            </div>

            {/* Preferred Technologies Tags */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Preferred Technologies
              </label>
              
              {/* Tag Checklist */}
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850">
                {techStack.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center gap-1.5 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 font-bold px-3 py-1 rounded-xl text-xs"
                  >
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTechTag(tag)}
                      className="hover:text-rose-500 font-extrabold text-[10px] shrink-0"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {techStack.length === 0 && (
                  <span className="text-slate-400 text-xs font-semibold">No skills added yet.</span>
                )}
              </div>

              {/* Add tags bar */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g. Docker"
                  className="flex-grow px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-650"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTechTag(); } }}
                />
                <button
                  type="button"
                  onClick={addTechTag}
                  className="bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </div>

            {saved && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-605 dark:text-emerald-400 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* Save Profile Button */}
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:scale-[1.01] active:scale-99 transition-all text-xs uppercase tracking-wider font-heading cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving changes...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
