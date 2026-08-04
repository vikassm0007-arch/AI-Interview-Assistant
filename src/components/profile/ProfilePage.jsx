import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Briefcase, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Save, 
  AlertTriangle, 
  RefreshCw,
  Sparkles,
  Award,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import AvatarUpload from './AvatarUpload';
import { useToast } from '../ui/Toast';
import { apiFetch } from '../../api';

export default function ProfilePage() {
  const { addToast } = useToast();

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Vikas S.',
    email: 'vikas@example.com',
    targetJobTitle: 'Senior Full-Stack Engineer',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA'
  });

  // Avatar state
  const [avatar, setAvatar] = useState(null);

  // Interview Preferences State
  const [preferences, setPreferences] = useState({
    seniorityLevel: 'senior',
    preferredMode: 'TECHNICAL',
    targetRoles: ['Full Stack Engineer', 'Frontend Architect'],
    techStack: ['React.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS']
  });

  // New tag inputs
  const [newRole, setNewRole] = useState('');
  const [newTech, setNewTech] = useState('');

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Form Dirtiness & Saving states
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Attempt fetching user profile from API endpoint
    apiFetch('/auth/profile')
      .then(data => {
        if (data) {
          setPersonalInfo(prev => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            targetJobTitle: data.targetJobTitle || prev.targetJobTitle
          }));
        }
      })
      .catch(() => {
        // Fallback silently to local defaults
      });
  }, []);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Password Strength Calculator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500 text-rose-500' };
    if (score <= 3) return { score: 65, label: 'Medium', color: 'bg-amber-500 text-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500 text-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(security.newPassword);

  // Add / Remove Target Roles
  const handleAddRole = () => {
    if (newRole.trim() && !preferences.targetRoles.includes(newRole.trim())) {
      setPreferences(prev => ({
        ...prev,
        targetRoles: [...prev.targetRoles, newRole.trim()]
      }));
      setNewRole('');
      markDirty();
    }
  };

  const handleRemoveRole = (role) => {
    setPreferences(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.filter(r => r !== role)
    }));
    markDirty();
  };

  // Add / Remove Tech Stack
  const handleAddTech = () => {
    if (newTech.trim() && !preferences.techStack.includes(newTech.trim())) {
      setPreferences(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech('');
      markDirty();
    }
  };

  const handleRemoveTech = (tech) => {
    setPreferences(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
    markDirty();
  };

  // Profile Form Save Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    // Password validation check if user is filling security section
    if (security.newPassword || security.confirmPassword || security.currentPassword) {
      if (!security.currentPassword) {
        addToast({
          type: 'error',
          title: 'Current Password Required',
          message: 'Please enter your current password to update security settings.'
        });
        return;
      }
      if (security.newPassword !== security.confirmPassword) {
        addToast({
          type: 'error',
          title: 'Passwords Mismatch',
          message: 'New password and confirm password fields do not match.'
        });
        return;
      }
    }

    setSaving(true);

    // Simulate API delay
    setTimeout(() => {
      setSaving(false);
      setIsDirty(false);
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });

      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile settings and preferences have been saved successfully!'
      });
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left relative"
    >
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-850/60 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 fill-current" /> Account Settings
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            User Profile & Preferences
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
            Customize your interview readiness parameters, core tech stack, and profile credentials.
          </p>
        </div>

        {/* Save CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/15 text-xs uppercase tracking-wider font-heading flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-center"
        >
          {saving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Profile
            </>
          )}
        </motion.button>
      </div>

      {/* Unsaved Changes Banner */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-200 text-xs font-semibold flex items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <span>You have unsaved changes in your profile settings.</span>
            </div>
            <button
              onClick={handleSaveProfile}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-[11px] uppercase tracking-wide cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              Save Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Avatar & Account Meta (1/3) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl text-center space-y-5 shadow-sm">
            
            <AvatarUpload 
              currentAvatar={avatar}
              userName={personalInfo.name}
              onAvatarChange={(newUrl) => { setAvatar(newUrl); markDirty(); }}
            />

            <div className="space-y-1">
              <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg">
                {personalInfo.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {personalInfo.targetJobTitle}
              </p>
            </div>

            {/* Email Verified Badge */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 p-3 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span className="truncate max-w-[140px]">{personalInfo.email}</span>
              </div>
              <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Account Tier</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">PRO Candidate</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monthly Tokens</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">8 Credits Left</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Columns: Main Form Sections (2/3) */}
        <div className="md:col-span-2 space-y-8">
          
          {/* SECTION 1: Personal Information */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
            <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Personal Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => { setPersonalInfo(prev => ({ ...prev, name: e.target.value })); markDirty(); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Verified Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Email Address (Read-only)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={personalInfo.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Target Job Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Target Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={personalInfo.targetJobTitle}
                    onChange={(e) => { setPersonalInfo(prev => ({ ...prev, targetJobTitle: e.target.value })); markDirty(); }}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={personalInfo.phone}
                    onChange={(e) => { setPersonalInfo(prev => ({ ...prev, phone: e.target.value })); markDirty(); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Location / Timezone</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => { setPersonalInfo(prev => ({ ...prev, location: e.target.value })); markDirty(); }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Interview Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
            <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Interview Preferences
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Seniority Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Target Seniority Level</label>
                <select
                  value={preferences.seniorityLevel}
                  onChange={(e) => { setPreferences(prev => ({ ...prev, seniorityLevel: e.target.value })); markDirty(); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 font-medium"
                >
                  <option value="entry">Entry Level (&lt; 2 yrs)</option>
                  <option value="mid">Mid Level (2-5 yrs)</option>
                  <option value="senior">Senior Level (5-8 yrs)</option>
                  <option value="lead">Lead / Principal (8+ yrs)</option>
                </select>
              </div>

              {/* Preferred Mode */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Preferred Mode</label>
                <select
                  value={preferences.preferredMode}
                  onChange={(e) => { setPreferences(prev => ({ ...prev, preferredMode: e.target.value })); markDirty(); }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 font-medium"
                >
                  <option value="TECHNICAL">💻 Technical / Skill-Based</option>
                  <option value="HR">🎤 HR / Behavioral</option>
                </select>
              </div>
            </div>

            {/* Target Roles Tag List */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Target Job Roles</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 min-h-[44px]">
                {preferences.targetRoles.map(role => (
                  <span key={role} className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-xl text-xs">
                    {role}
                    <button type="button" onClick={() => handleRemoveRole(role)} className="hover:text-rose-500 font-extrabold text-[10px] cursor-pointer">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Backend Architect"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRole(); } }}
                  className="flex-grow px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Add Role
                </button>
              </div>
            </div>

            {/* Tech Stack Core Skills List */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Tech Stack / Core Skills</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/50 dark:border-slate-850 min-h-[44px]">
                {preferences.techStack.map(tech => (
                  <span key={tech} className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-xl text-xs">
                    {tech}
                    <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-rose-500 font-extrabold text-[10px] cursor-pointer">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g. Docker, GraphQL"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                  className="flex-grow px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </div>

          </div>

          {/* SECTION 3: Security & Credentials */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
            <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> Security & Password
            </h3>

            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={security.currentPassword}
                    onChange={(e) => { setSecurity(prev => ({ ...prev, currentPassword: e.target.value })); markDirty(); }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={security.newPassword}
                    onChange={(e) => { setSecurity(prev => ({ ...prev, newPassword: e.target.value })); markDirty(); }}
                    placeholder="New password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={security.confirmPassword}
                    onChange={(e) => { setSecurity(prev => ({ ...prev, confirmPassword: e.target.value })); markDirty(); }}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Password Strength Meter */}
              {security.newPassword && (
                <div className="space-y-1.5 pt-1 animate-fade-in">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-wider">Password Strength</span>
                    <span className={pwdStrength.color.split(' ')[1]}>{pwdStrength.label}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${pwdStrength.color.split(' ')[0]}`}
                      style={{ width: `${pwdStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}
