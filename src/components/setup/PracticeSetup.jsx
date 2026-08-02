import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Settings, 
  Play, 
  HelpCircle, 
  Laptop, 
  ShieldCheck, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { generateHRQuestions } from '../../services/hrQuestionService';
import { generateTechnicalQuestions } from '../../services/technicalQuestionService';

export default function PracticeSetup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('HR');

  // HR Configs
  const [roleContext, setRoleContext] = useState('Mid-Level');
  const [cultureProfile, setCultureProfile] = useState('startup');
  const [hrFocus, setHrFocus] = useState(['conflict', 'adaptability']);

  // Technical Configs
  const [selectedSkills, setSelectedSkills] = useState(['React']);
  const [difficulty, setDifficulty] = useState('Mid');
  const [format, setFormat] = useState('coding');

  const skillsList = ["React", "TypeScript", "Node.js", "Python", "System Design", "SQL"];

  const handleToggleHrFocus = (focus) => {
    if (hrFocus.includes(focus)) {
      setHrFocus(hrFocus.filter(f => f !== focus));
    } else {
      setHrFocus([...hrFocus, focus]);
    }
  };

  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleStartInterview = () => {
    let questions = [];
    if (mode === 'HR') {
      questions = generateHRQuestions(roleContext, cultureProfile, hrFocus);
    } else {
      questions = generateTechnicalQuestions(selectedSkills, difficulty, format);
    }

    // Redirect to active interview simulation room
    navigate('/interview', {
      state: {
        mode,
        role: mode === 'HR' ? `${roleContext} (${cultureProfile === 'startup' ? 'Startup' : 'Enterprise'})` : `${selectedSkills.join(', ')} - ${difficulty}`,
        questions,
        technicalMetadata: mode === 'TECHNICAL' ? {
          selectedSkills,
          difficulty,
          format
        } : null,
        hrMetadata: mode === 'HR' ? {
          roleContext,
          cultureProfile,
          hrFocus
        } : null
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      <div>
        <span className="bg-indigo-50 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-850/60 font-bold px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
          <Sparkles className="h-3 w-3 fill-current" /> Practice Sandbox
        </span>
        <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">Interview Simulator Setup</h2>
        <p className="text-slate-505 dark:text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
          Configure your target role, stack, and focus variables to generate customized AI prompt questions.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Configuration form (2/3) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            
            {/* Mode Swapper Buttons */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Session Mode
              </label>
              <div className="grid grid-cols-2 gap-3.5 p-1 border border-slate-200/50 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  type="button"
                  onClick={() => setMode('HR')}
                  className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'HR'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  🎤 HR / Behavioral
                </button>
                <button
                  type="button"
                  onClick={() => setMode('TECHNICAL')}
                  className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'TECHNICAL'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  💻 Technical / Skills
                </button>
              </div>
            </div>

            {/* HR / BEHAVIORAL SETTINGS */}
            {mode === 'HR' && (
              <div className="space-y-5 animate-fade-in">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Context Role */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Seniority Context</label>
                    <select
                      value={roleContext}
                      onChange={(e) => setRoleContext(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-205 focus:outline-none focus:border-indigo-650"
                    >
                      <option value="Entry-Level">Entry-Level Developer</option>
                      <option value="Mid-Level">Mid-Level Engineer</option>
                      <option value="Senior-Level">Senior Engineer</option>
                      <option value="Engineering Manager">Engineering Manager</option>
                    </select>
                  </div>

                  {/* Culture profile */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Culture Profile</label>
                    <select
                      value={cultureProfile}
                      onChange={(e) => setCultureProfile(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-205 focus:outline-none focus:border-indigo-650"
                    >
                      <option value="startup">Fast-Paced Startup (High ownership)</option>
                      <option value="enterprise">Enterprise Tech (Scalable systems)</option>
                      <option value="agency">Consulting / Agency (Client deadlines)</option>
                    </select>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Focus Targets</label>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {[
                      { id: 'conflict', label: 'Conflict Resolution' },
                      { id: 'adaptability', label: 'Adaptability & Shift' },
                      { id: 'time_management', label: 'Time Management' },
                      { id: 'growth', label: 'Growth Expectations' }
                    ].map(focus => {
                      const active = hrFocus.includes(focus.id);
                      return (
                        <div 
                          key={focus.id}
                          onClick={() => handleToggleHrFocus(focus.id)}
                          className={`p-3 rounded-2xl border cursor-pointer flex justify-between items-center text-xs font-semibold transition-all ${
                            active 
                              ? 'border-indigo-650 bg-indigo-500/5 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400' 
                              : 'border-slate-200 dark:border-slate-850 hover:bg-slate-50'
                          }`}
                        >
                          <span>{focus.label}</span>
                          <CheckCircle className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-indigo-600 dark:text-indigo-400 fill-current text-white' : 'text-slate-200 dark:text-slate-800'}`} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TECHNICAL SETTINGS */}
            {mode === 'TECHNICAL' && (
              <div className="space-y-5 animate-fade-in">
                {/* Tech Stack skills selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Target Technologies</label>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map(skill => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <span 
                          key={skill}
                          onClick={() => handleToggleSkill(skill)}
                          className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            active 
                              ? 'bg-indigo-600 border-indigo-605 text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 text-slate-505 dark:text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Difficulty */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-205 focus:outline-none focus:border-indigo-650"
                    >
                      <option value="Junior">Junior / Fundamental Qs</option>
                      <option value="Mid">Mid-Level Applied Qs</option>
                      <option value="Senior">Senior / Architecture Qs</option>
                    </select>
                  </div>

                  {/* Question Format */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Question Format</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-205 focus:outline-none focus:border-indigo-650"
                    >
                      <option value="conceptual">Conceptual Q&A</option>
                      <option value="coding">Live Code Editor</option>
                      <option value="design">System Design Document</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Launch Practice button */}
            <button
              onClick={handleStartInterview}
              className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wider font-heading flex items-center justify-center gap-2 cursor-pointer"
            >
              Launch Practice Interview
              <Play className="h-4.5 w-4.5 fill-current" />
            </button>

          </div>
        </div>

        {/* Right Side: Setup Rules / Tips (1/3) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-5">
          <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-500" /> Mode Specs
          </h4>
          
          <ul className="space-y-4 text-xs text-slate-505 dark:text-slate-400 font-semibold leading-relaxed">
            <li className="space-y-1">
              <p className="text-slate-800 dark:text-slate-200 font-bold">🎤 HR / Behavioral</p>
              <p className="font-medium text-slate-500">Evaluates soft-skill dynamics, culture fits, and response structures. Injects speech-pace evaluations and check grids.</p>
            </li>
            <li className="space-y-1">
              <p className="text-slate-800 dark:text-slate-200 font-bold">💻 Technical / Skills</p>
              <p className="font-medium text-slate-500">Launches a split-pane layout featuring progressive score-penalty hints and integrated code editors supporting unit test runs.</p>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
