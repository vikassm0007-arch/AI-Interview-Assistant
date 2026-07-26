import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, AlertCircle, FileText } from 'lucide-react';

export default function Practice() {
  const [role, setRole] = useState('frontend');
  const [difficulty, setDifficulty] = useState('medium');
  const [type, setType] = useState('technical');
  const [jobDesc, setJobDesc] = useState('');
  const navigate = useNavigate();

  const prompts = {
    frontend: "Looking for a developer skilled in React, CSS grid layouts, web accessibility, and performance optimization.",
    backend: "Looking for a backend developer skilled in building APIs, database migrations, security best practices, and caching systems.",
    uiux: "Seeking a designer with skills in Figma, low/high-fidelity wireframes, heuristic evaluation, and interaction design.",
    fullstack: "Looking for a full stack engineer skilled in React, Node, SQL databases, API design, and system architecture."
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (prompts[selectedRole]) {
      setJobDesc(prompts[selectedRole]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to interview page passing state parameters
    navigate('/interview', { state: { role, difficulty, type, jobDesc } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col justify-center space-y-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <h2 className="font-heading text-3xl font-extrabold text-slate-905 dark:text-white tracking-tight flex items-center gap-2">
          Setup Your Interview <Sparkles className="h-6 w-6 text-indigo-650 dark:text-indigo-400 animate-pulse" />
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">
          Select target parameters to shape the AI interviewer's questions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Job Role Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Target Job Role
              </label>
              <select
                value={role}
                onChange={handleRoleChange}
                className="w-full py-3 px-4 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-650 transition-all text-xs sm:text-sm cursor-pointer"
              >
                <option value="frontend">Frontend Web Developer</option>
                <option value="backend">Backend Systems Engineer</option>
                <option value="uiux">UI/UX & Product Designer</option>
                <option value="fullstack">Full Stack Engineer</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-650 transition-all text-xs sm:text-sm cursor-pointer"
              >
                <option value="easy">Easy (Associate / Junior)</option>
                <option value="medium">Medium (Mid-Level Developer)</option>
                <option value="hard">Hard (Senior / Lead Architect)</option>
              </select>
            </div>

            {/* Interview Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Interview Focus Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-650 transition-all text-xs sm:text-sm cursor-pointer"
              >
                <option value="technical">Technical Coding & Frameworks</option>
                <option value="hr">HR & Cultural Fit</option>
                <option value="system_design">System Architecture Design</option>
                <option value="behavioral">Behavioral (STAR Method)</option>
              </select>
            </div>

            {/* Brief Instructions banner */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-150 dark:border-indigo-850 p-4 rounded-2xl flex items-start gap-2.5 text-left md:row-span-1">
              <AlertCircle className="h-5 w-5 text-indigo-650 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-indigo-650 dark:text-indigo-400">Simulator Guidelines</p>
                <p className="text-slate-500 dark:text-slate-400 leading-normal">
                  Ensure your webcam and microphone are connected. Each mock session evaluates pacing, delivery, and structure.
                </p>
              </div>
            </div>

          </div>

          {/* Job Description Textarea */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Job Description / Targeted Keywords (Optional)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-3.5 text-slate-400">
                <FileText className="h-4 w-4" />
              </span>
              <textarea
                rows={4}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description context here to target specific qualifications..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-205 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-850 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-650 transition-all text-xs sm:text-sm resize-none"
              />
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wide font-heading"
            >
              <Play className="h-4 w-4 fill-current" />
              Launch Interview Room
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
