import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, ArrowRight, FileText, X } from 'lucide-react';

export default function ResumeUpload() {
  const [role, setRole] = useState('frontend');
  const [jobDesc, setJobDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const prompts = {
    frontend: "Looking for a developer skilled in React, CSS grid layouts, web accessibility, and performance optimization.",
    backend: "Looking for a backend developer skilled in building APIs, database migrations, security best practices, and caching systems.",
    uiux: "Seeking a designer with skills in Figma, low/high-fidelity wireframes, heuristic evaluation, and interaction design.",
    fullstack: "Looking for a full stack engineer skilled in React, Node, SQL databases, API design, and system architecture."
  };

  const skillsDatabase = {
    frontend: ["HTML5", "CSS Grid/Flexbox", "React.js", "TailwindCSS", "TypeScript", "Web Accessibility (a11y)", "Redux / Zustand", "Vite & Webpack", "Jest & React Testing Library"],
    backend: ["Node.js", "Express.js", "PostgreSQL", "Redis Caching", "RESTful APIs", "GraphQL", "Docker Containers", "AWS (S3/EC2)", "MongoDB"],
    uiux: ["Figma Design", "Low/High-Fi Wireframing", "User Research & Personas", "Interactive Prototyping", "Usability Heuristics", "Typography System", "Harmonious Color Theory", "Information Architecture"],
    fullstack: ["React.js", "Node.js", "PostgreSQL", "REST APIs", "Git Version Control", "CSS Grid", "AWS Infrastructure", "Jest Integration Testing"]
  };

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
          // Set initial skills based on database
          setSkills(skillsDatabase[role]);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
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
    setSkills([]);
  };

  const handleProceed = () => {
    navigate('/interview', { state: { role, skills } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-grow">
      
      {/* Stepper Header */}
      <div className="flex items-center justify-center gap-4 max-w-lg mx-auto pb-4">
        <div className="flex items-center gap-2 font-semibold text-brand-indigo">
          <div className="h-7 w-7 rounded-full bg-brand-indigo text-white flex items-center justify-center text-xs">1</div>
          <span>Upload</span>
        </div>
        <div className="h-0.5 w-16 bg-brand-platinum flex-grow" />
        <div className={`flex items-center gap-2 font-semibold ${file && progress === 100 ? 'text-brand-indigo' : 'text-brand-charcoal/40'}`}>
          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs ${file && progress === 100 ? 'bg-brand-indigo text-white' : 'bg-brand-platinum text-brand-charcoal/60'}`}>2</div>
          <span>Verify</span>
        </div>
        <div className="h-0.5 w-16 bg-brand-platinum flex-grow" />
        <div className={`flex items-center gap-2 font-semibold ${file && progress === 100 ? 'text-brand-indigo' : 'text-brand-charcoal/40'}`}>
          <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs ${file && progress === 100 ? 'bg-brand-indigo text-white' : 'bg-brand-platinum text-brand-charcoal/60'}`}>3</div>
          <span>Ready</span>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Card: Drag Drop */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-platinum shadow-sm space-y-6">
          <div className="space-y-2">
            <h4 className="font-heading text-xl font-bold text-brand-charcoal">Upload Resume</h4>
            <p className="text-brand-charcoal/60 text-xs">Upload your professional profile to generate customized interview questions</p>
          </div>

          {!file ? (
            <label className="border-2 border-dashed border-brand-indigo/60 hover:border-brand-indigo bg-brand-indigo/5 hover:bg-brand-indigo/10 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition-all cursor-pointer group">
              <UploadCloud className="h-12 w-12 text-brand-indigo group-hover:scale-105 transition-transform" />
              <p className="text-brand-charcoal font-bold mt-4 text-sm sm:text-base">Drag & drop your resume file here</p>
              <p className="text-brand-charcoal/60 text-xs mt-1">PDF, DOCX, or TXT up to 10MB</p>
              <span className="bg-white border border-brand-platinum hover:bg-brand-alabaster text-brand-charcoal font-bold py-2 px-4 rounded-lg text-xs mt-4 shadow-sm transition-all">
                Browse Files
              </span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          ) : (
            <div className="border border-brand-platinum bg-brand-alabaster rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-brand-platinum shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-indigo/10 text-brand-indigo p-2 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-brand-charcoal truncate max-w-[180px]">{file.name}</p>
                    <p className="text-xs text-brand-charcoal/60">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                </div>
                {!uploading && (
                  <button onClick={handleRemoveFile} className="text-brand-charcoal/40 hover:text-red-500 p-1.5 rounded-lg hover:bg-brand-platinum transition-all cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-brand-charcoal/80">
                    <span>Extracting skills...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-brand-platinum h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-indigo h-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {progress === 100 && (
                <div className="bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald p-4 rounded-xl flex items-start gap-2.5">
                  <CheckCircle className="h-5 w-5 shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Resume Parsed Successfully!</p>
                    <p className="opacity-90 leading-relaxed">We extracted {skillsDatabase[role].length} skills tailored to your target job profile. Verify them below.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Card: Config */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-platinum shadow-sm space-y-6">
          <div className="space-y-2">
            <h4 className="font-heading text-xl font-bold text-brand-charcoal">Role Configuration</h4>
            <p className="text-brand-charcoal/60 text-xs">Configure the targeted role to shape the AI interviewer's questions</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal/80 block">Select Job Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={uploading}
                className="w-full py-3 px-4 rounded-lg border border-brand-platinum bg-brand-alabaster focus:border-brand-indigo focus:bg-white focus:outline-none transition-all text-sm cursor-pointer disabled:opacity-50"
              >
                <option value="frontend">Frontend Web Developer</option>
                <option value="backend">Backend Systems Engineer</option>
                <option value="uiux">UI/UX & Product Designer</option>
                <option value="fullstack">Full Stack Engineer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal/80 block">Job Description / Context (Optional)</label>
              <textarea
                rows={4}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                disabled={uploading}
                placeholder="Paste the job description context here to target specific qualifications..."
                className="w-full p-4 rounded-lg border border-brand-platinum bg-brand-alabaster focus:border-brand-indigo focus:bg-white focus:outline-none transition-all text-sm resize-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Verification Skills panel */}
      {file && progress === 100 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-platinum shadow-sm space-y-6 animate-fade-in">
          <div>
            <h4 className="font-heading text-lg font-bold text-brand-charcoal">Parsed Skills Checklist</h4>
            <p className="text-brand-charcoal/60 text-xs mt-1">Deselect any skills you do not want to be evaluated on during the mock session.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {skillsDatabase[role].map((skill, index) => {
              const isChecked = skills.includes(skill);
              return (
                <button
                  key={index}
                  onClick={() => handleToggleSkill(skill)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-brand-indigo border-brand-indigo text-white shadow-sm'
                      : 'bg-brand-alabaster border-brand-platinum text-brand-charcoal hover:border-brand-indigo hover:text-brand-indigo'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-brand-platinum">
            <button
              onClick={handleProceed}
              className="bg-brand-indigo hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              Proceed to Interview Room
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
