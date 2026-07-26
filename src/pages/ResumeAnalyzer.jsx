import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle2, FileText, X, AlertTriangle, ShieldCheck, ArrowRight, Play, Award, Sparkles, BookOpen } from 'lucide-react';

export default function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [role, setRole] = useState('frontend');
  const [jobDesc, setJobDesc] = useState('');
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState('');

  const prompts = {
    frontend: "Looking for a developer skilled in React, CSS grid layouts, web accessibility, and performance optimization.",
    backend: "Looking for a backend developer skilled in building APIs, database migrations, security best practices, and caching systems.",
    uiux: "Seeking a designer with skills in Figma, low/high-fidelity wireframes, heuristic evaluation, and interaction design.",
    fullstack: "Looking for a full stack engineer skilled in React, Node, SQL databases, API design, and system architecture."
  };

  const skillsDatabase = {
    frontend: ["HTML5", "CSS Grid", "React.js", "TailwindCSS", "TypeScript", "Web Accessibility", "Redux Toolkit", "Vite", "Jest & RTL"],
    backend: ["Node.js", "Express.js", "PostgreSQL", "Redis Caching", "RESTful APIs", "GraphQL", "Docker", "AWS S3/EC2", "MongoDB"],
    uiux: ["Figma Design", "Low/High-Fi Wireframes", "User Research", "Interactive Prototyping", "Usability Heuristics", "Typography", "Color Theory", "Information Architecture"],
    fullstack: ["React.js", "Node.js", "PostgreSQL", "REST APIs", "Git Version Control", "CSS Grid", "AWS Infrastructure", "Jest Integration"]
  };

  const suggestedQuestions = {
    frontend: [
      "Can you describe a time when you had to optimize the performance of a React web application?",
      "What is the difference between useMemo and useCallback? When would you use one over the other?",
      "How do you approach ensuring a web application is accessible to users with screen readers?"
    ],
    backend: [
      "Tell me about a time you had to debug a production database bottleneck. How did you resolve it?",
      "How would you design a scalable notification system that can handle 10,000 requests per second?",
      "Explain how Redis caching works and the strategies you would use for cache invalidation."
    ],
    uiux: [
      "Walk me through your design process for a mobile dashboard feature from discovery to handoff.",
      "How do you apply Nielsen's usability heuristics to simplify a complex, data-heavy dashboard?",
      "What are the common UI/UX mistakes you notice in AI chat systems today, and how would you solve them?"
    ],
    fullstack: [
      "Tell me about a project where you had to quickly learn a new technology stack to deliver a feature.",
      "How do you handle migrations in a live production database with minimal downtime?",
      "What security measures do you implement to protect a REST API against common vulnerabilities?"
    ]
  };

  // Sync JD template when role changes
  useEffect(() => {
    setJobDesc(prompts[role]);
  }, [role]);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0] || { name: 'resume_vikas_s.pdf', size: 245000 };
    setFile(uploadedFile);
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          // Set details
          setSkills(skillsDatabase[role]);
          setExperience('4.5 Years');
          
          // Animate score count
          let currentScore = 0;
          const scoreInterval = setInterval(() => {
            currentScore += 4;
            setScore(currentScore);
            if (currentScore >= 84) {
              clearInterval(scoreInterval);
            }
          }, 30);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleToggleSkill = (skillToToggle) => {
    if (skills.includes(skillToToggle)) {
      setSkills(skills.filter(s => s !== skillToToggle));
    } else {
      setSkills([...skills, skillToToggle]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setScore(0);
    setSkills([]);
    setExperience('');
  };

  const handleLaunchInterview = () => {
    navigate('/interview', { state: { role, skills, jobDesc } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Stepper Header */}
      <div className="flex items-center justify-center gap-4 max-w-lg mx-auto pb-2 border-b border-slate-150 dark:border-slate-850">
        <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
          <div className="h-7 w-7 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-xs shadow-md shadow-indigo-500/20">1</div>
          <span className="text-xs sm:text-sm">Upload</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-205 dark:bg-slate-800 flex-grow" />
        <div className={`flex items-center gap-2 font-bold ${file && progress === 100 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs ${file && progress === 100 ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800'}`}>2</div>
          <span className="text-xs sm:text-sm">Parse & Prep</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-205 dark:bg-slate-800 flex-grow" />
        <div className={`flex items-center gap-2 font-bold ${file && progress === 100 ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-400'}`}>
          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs ${file && progress === 100 ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800'}`}>3</div>
          <span className="text-xs sm:text-sm">Ready</span>
        </div>
      </div>

      {/* Hero Title */}
      <div className="text-left space-y-2">
        <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Resume Parser & Interview Builder
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
          Upload your resume and paste the target job description. Our AI parses relevant keywords to customize your mock simulation.
        </p>
      </div>

      {/* Upload Dropzone & Configuration Row */}
      <div className="grid lg:grid-cols-5 gap-8 items-stretch">
        
        {/* Left Column: Upload Dropzone (2/5) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-6 transition-colors duration-300">
          <div>
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white text-left">Upload Document</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs text-left mt-1">Upload your resume to extract qualifications.</p>
          </div>
          
          {!file ? (
            <label className="border-2 border-dashed border-indigo-600/50 hover:border-indigo-600 bg-indigo-50/20 dark:bg-slate-950/40 rounded-2.5xl p-8 text-center flex flex-col items-center justify-center min-h-[240px] transition-all cursor-pointer group">
              <UploadCloud className="h-12 w-12 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform" />
              <p className="text-slate-850 dark:text-slate-200 font-bold mt-4 text-sm sm:text-base">Drag & drop your resume here</p>
              <p className="text-slate-500 text-xs mt-1">PDF, DOCX, or TXT up to 10MB</p>
              <span className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-4.5 rounded-xl text-xs mt-5 shadow-sm transition-all">
                Browse Local Files
              </span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800/85 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-6 space-y-5 text-left flex-grow flex flex-col justify-center">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 p-2.5 rounded-lg border border-indigo-500/10">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{file.name}</p>
                    <p className="text-xs text-slate-550 dark:text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                {!uploading && (
                  <button onClick={handleRemoveFile} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-405">
                    <span>AI heuristic parser scanning...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {progress === 100 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Resume Parsed Successfully!</p>
                    <p className="opacity-95 leading-relaxed">Assessing experience, keywords, and questions based on credentials.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Configuration & Job description (3/5) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-6 transition-colors duration-300">
          <div>
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white text-left">Role Settings & context</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs text-left mt-1">Specify target parameters to map parsing metrics.</p>
          </div>

          <div className="space-y-4 flex-grow text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Target Job Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={uploading}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-650 transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <option value="frontend">Frontend Web Developer</option>
                <option value="backend">Backend Systems Engineer</option>
                <option value="uiux">UI/UX & Product Designer</option>
                <option value="fullstack">Full Stack Engineer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">Job Description (JD) Context</label>
              <textarea
                rows={4}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                disabled={uploading}
                placeholder="Paste the target job description to match skills and suggest tailor-made questions..."
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-indigo-650 transition-all text-xs sm:text-sm resize-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Parser Results Assessment Panel (Appears once file is processed successfully) */}
      {file && progress === 100 && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-8 animate-fade-in text-left transition-colors duration-300">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> AI Resume Assessment Results
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Review calculated strengths, extracted checklist, and recommended practices below.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-8 items-start">
            
            {/* Score ring & Experience Gauge (2/5) */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Score card ring */}
              <div className="bg-slate-50/60 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/70 flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="3"
                      strokeDasharray={`${score}, 100`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-heading text-lg font-extrabold text-slate-900 dark:text-white">
                    {score}%
                  </div>
                </div>
                <div className="space-y-1 text-left">
                  <span className="bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase border border-indigo-500/10">
                    Match Index
                  </span>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Ready for Interview</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Your profile is a strong fit for the requested description.</p>
                </div>
              </div>

              {/* parsed experience card */}
              <div className="bg-slate-50/60 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/70 space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-slate-405 dark:text-slate-400 tracking-wider">Detected Experience</div>
                <div className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  {experience} <Sparkles className="h-5 w-5 text-amber-500 fill-current animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Calculated based on chronological job indicators in the document.</p>
              </div>

            </div>

            {/* Suggested Interview Questions Accordion/List (3/5) */}
            <div className="md:col-span-3 bg-slate-50/60 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/70 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <BookOpen className="h-4.5 w-4.5 text-indigo-600" />
                <span>Suggested Interview Questions ({suggestedQuestions[role]?.length || 0})</span>
              </div>
              <div className="space-y-3.5">
                {suggestedQuestions[role]?.map((q, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 shadow-xs text-left">
                    <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 block mb-1">Question Heuristic {idx + 1}</span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">"{q}"</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Parsed Skills checklist toggle tags */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-heading text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="h-5 w-5 text-emerald-500" /> Verify Parsed Keywords & Skills
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Deselect any skills you do not want evaluated during the mock loop.</p>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {skillsDatabase[role]?.map((skill, index) => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    key={index}
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-650/15'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-350 hover:border-indigo-605 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>

            {/* Launch button */}
            <div className="flex justify-end pt-6 border-t border-slate-105 dark:border-slate-800 mt-6">
              <button
                onClick={handleLaunchInterview}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wide font-heading"
              >
                <Play className="h-4 w-4 fill-current text-white" />
                Launch AI Interview Room
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
