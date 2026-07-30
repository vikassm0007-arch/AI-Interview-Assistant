import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import ParsedResumeView from '../components/ParsedResumeView';
import QuestionList from '../components/QuestionList';
import { apiFetch } from '../api';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('frontend');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsingStep, setParsingStep] = useState(''); // 'Extracting text...', 'Analyzing skills with AI...', etc.
  
  const [parsedData, setParsedData] = useState(null);
  const [questions, setQuestions] = useState(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Invalid file format: Only PDF documents are allowed');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Invalid file format: Only PDF documents are allowed');
      }
    }
  };

  const handleStartParsing = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setParsingStep('Extracting text from PDF...');
    setError('');

    // Simulate progress tracker increments
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 45 && prev < 75) {
          setParsingStep('Analyzing candidate profile with AI...');
          return prev + 10;
        }
        if (prev >= 75 && prev < 90) {
          setParsingStep('Extracting skills schema tags...');
          return prev + 5;
        }
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Pings the backend parse-resume multipart API endpoint
      const response = await apiFetch('/parse-resume', {
        method: 'POST',
        headers: {}, // Bound without content-type for boundary allocations
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setParsingStep('Complete!');

      setTimeout(() => {
        setIsUploading(false);
        setParsedData(response.parsedResume);
      }, 300);

    } catch (err) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(err.message || 'An error occurred during resume text parsing');
    }
  };

  const handleGenerateQuestions = async () => {
    if (!parsedData) return;

    setIsGenerating(true);
    setError('');

    try {
      // Pings the backend generate-questions API endpoint
      const response = await apiFetch('/generate-questions', {
        method: 'POST',
        body: JSON.stringify({
          extractedResumeData: parsedData,
          targetRole: role === 'frontend' ? 'Frontend Engineer' : role === 'backend' ? 'Backend Architect' : role === 'fullstack' ? 'Full-Stack Engineer' : 'UI/UX Designer',
          experienceLevel: parsedData.experience.toLowerCase().includes('entry') ? 'Entry' : 'Mid'
        })
      });

      setQuestions(response.questions);
      setIsGenerating(false);
    } catch (err) {
      setIsGenerating(false);
      setError(err.message || 'An error occurred while generating tailored questions');
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setQuestions(null);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left transition-colors duration-300">
      
      {/* Step 1: Upload & Form selection */}
      {!parsedData && !isUploading && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div>
            <span className="bg-indigo-50 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-850/60 font-bold px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
              <Sparkles className="h-3 w-3 fill-current" /> AI Parsing Core
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">Resume Parsing Pipeline</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Upload your resume in PDF format to extract structured experience summaries and generate tailored prep prompts.
            </p>
          </div>

          <form onSubmit={handleStartParsing} className="space-y-6 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xs">
            {/* Target Role Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-550 dark:text-slate-400 block">
                Target Role
              </label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-650 focus:bg-white transition-all"
              >
                <option value="frontend">Frontend Engineer</option>
                <option value="backend">Backend Architect</option>
                <option value="fullstack">Full-Stack Engineer</option>
                <option value="uiux">UI/UX Product Designer</option>
              </select>
            </div>

            {/* Drag & Drop File Container */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2.5xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-950/20 transition-all duration-300 min-h-[200px]"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf"
                onChange={handleFileChange}
              />
              <div className="p-3.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 mb-3.5">
                <UploadCloud className="h-7 w-7" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Drag and drop your PDF resume here, or <span className="text-indigo-605 dark:text-indigo-400">browse</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Supports PDF format only (Max 5 MB)</p>
            </div>

            {/* Selected File Box */}
            {file && (
              <div className="bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 p-4 rounded-xl flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[400px]">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-405 dark:text-slate-500 font-semibold">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-450 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-fade-in">
                <AlertCircle className="h-4 w-4 mt-0.5 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Parse CTA Button */}
            <button
              type="submit"
              disabled={!file}
              className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wider font-heading flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              Start Parsing File
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Parsing Loader Skeleton */}
      {isUploading && (
        <div className="max-w-xl mx-auto space-y-6 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-8 rounded-3xl shadow-xs text-center animate-fade-in my-12">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          
          <div className="space-y-1.5">
            <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg">AI Parsing Pipeline Active</h4>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider animate-pulse">{parsingStep}</p>
          </div>

          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-200 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-extrabold tracking-wider">{uploadProgress}% Complete</p>
          </div>
        </div>
      )}

      {/* Step 2: Display Structured Parsed Resume Details & Generate Prompt Set */}
      {parsedData && !questions && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-850 pb-5">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Structured Qualifications</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Review extracted details before generating tailored mock questions.</p>
            </div>
            
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-655 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              Parse Another Resume
            </button>
          </div>

          {/* Parsed Resume View component */}
          <ParsedResumeView data={parsedData} />

          {/* Error Alert */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-650 dark:text-rose-455 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2 max-w-xl mx-auto animate-fade-in">
              <AlertCircle className="h-4 w-4 mt-0.5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Trigger for questions generation */}
          <div className="flex justify-center pt-4 border-t border-slate-200/50 dark:border-slate-850">
            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="bg-indigo-650 bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wider font-heading flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating Prep Set...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Tailored Interview Questions
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Display Tailored Practice Questions Accordions */}
      {questions && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-850 pb-5">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Tailored Questions</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Review difficulty badges and concepts. Launch the practice simulator below.</p>
            </div>
            
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-655 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              Restart Pipeline
            </button>
          </div>

          {/* Question List Accordion Component */}
          <QuestionList 
            questions={questions} 
            targetRole={role === 'frontend' ? 'Frontend Engineer' : role === 'backend' ? 'Backend Architect' : role === 'fullstack' ? 'Full-Stack Engineer' : 'UI/UX Designer'} 
          />
        </div>
      )}

    </div>
  );
}
