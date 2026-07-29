import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { apiFetch } from '../api';

interface ParsedResume {
  id: string;
  fileName: string;
  fileSize: number;
  parsedRole: string;
  skills: string[];
  experience: string;
  matchScore: number;
  createdAt: string;
}

export default function ResumeUploadComponent() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState('frontend');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resumes, setResumes] = useState<ParsedResume[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side file size and format validations
  const validateFile = (selectedFile: File): boolean => {
    setError('');
    
    // Check MIME type
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Invalid file type: Please select a PDF document (.pdf)');
      return false;
    }
    
    // Check file size (5 MB limit)
    const maxFileSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxFileSize) {
      setError('File is too large: Maximum upload size is 5 MB');
      return false;
    }
    
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError('');
    setSuccess(false);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', role);

      // Backend API call passing multipart payload
      const data = await apiFetch('/resumes/upload', {
        method: 'POST',
        // Note: Headers are injected without Content-Type to let the browser configure multipart boundary tags
        headers: {},
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setSuccess(true);
        setFile(null);
        setResumes(prev => [data.resume, ...prev]);
      }, 300);

    } catch (err: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setError(err.message || 'An error occurred during resume uploading');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left">
      <div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Resume Upload Pipeline</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
          Upload your PDF qualifications. Our AI parser extracts experience metrics and customizes interview checks.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Columns: Upload Zone (2/3) */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleUploadSubmit} className="space-y-5">
            {/* Target Role Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Target Role
              </label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-650"
              >
                <option value="frontend">Frontend Engineer</option>
                <option value="backend">Backend Architect</option>
                <option value="fullstack">Full-Stack Engineer</option>
                <option value="uiux">UI/UX Product Designer</option>
              </select>
            </div>

            {/* Drop Zone Box */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] ${
                dragActive 
                  ? 'border-indigo-600 bg-indigo-500/5 dark:bg-indigo-500/10 scale-[1.01]' 
                  : 'border-slate-205 dark:border-slate-800 hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-950/20'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf"
                onChange={handleChange}
              />
              
              <div className="p-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-4">
                <UploadCloud className="h-8 w-8" />
              </div>
              
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Drag and drop your PDF resume here, or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Supports PDF only (Max 5 MB)</p>
            </div>

            {/* Selected File Summary Block */}
            {file && (
              <div className="bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-850 p-4 rounded-2xl flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[320px]">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="p-2 text-slate-405 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            )}

            {/* Alert Logs */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-semibold flex gap-2.5 items-start animate-fade-in">
                <AlertCircle className="h-4 w-4 mt-0.5 text-rose-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-605 dark:text-emerald-400 p-4 rounded-2xl text-xs font-semibold flex gap-2.5 items-start animate-fade-in">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>Resume parsed successfully! Check the extracted skills and target matching scores.</span>
              </div>
            )}

            {/* Upload Progress Loader */}
            {isUploading && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Uploading & Extracting text...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-150 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || isUploading}
              className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-605/10 hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wider font-heading flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              Parse Qualifications
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Columns: File Specs & Details (1/3) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-5">
          <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base">Pipeline Rules</h4>
          <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Accepts only **PDF format** `.pdf` extension documents.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Max file size constraint **5 Megabytes (MB)**.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600 font-bold">✓</span>
              <span>Performs server-side text extraction using **pdf-parse** heuristics.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
