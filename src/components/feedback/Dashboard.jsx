import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  RefreshCw, 
  Download, 
  ChevronRight, 
  Volume2, 
  ArrowRight,
  ShieldCheck,
  User,
  ExternalLink
} from 'lucide-react';
import { getEvaluationStatus, getProgressColorClass } from '../../utils/scoringEngine';

export default function Dashboard({ evaluation, onRetake, onSave, isSaving }) {
  const [activeSection, setActiveSection] = useState<'overview' | 'transcript' | 'model'>('overview');
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  const status = getEvaluationStatus(evaluation.overallScore);

  // Helper to render text with highlights for Tone/Grammar analysis
  const renderHighlightedTranscript = () => {
    let text = evaluation.candidateAnswer || "";
    const highlights = evaluation.grammarToneHighlights || [];

    if (highlights.length === 0) {
      return <p className="text-slate-700 dark:text-slate-300 italic">"{text}"</p>;
    }

    // Sort highlights by length descending to avoid nested replacement index clashes
    const sortedHighlights = [...highlights].sort((a, b) => b.snippet.length - a.snippet.length);

    // Simple replacement token tag rendering
    let elements = [];
    let remainingText = text;

    // Loop and split
    sortedHighlights.forEach((hl, idx) => {
      const startIdx = remainingText.indexOf(hl.snippet);
      if (startIdx !== -1) {
        // Add text before highlight
        if (startIdx > 0) {
          elements.push(remainingText.substring(0, startIdx));
        }
        
        // Add highlighted element
        elements.push(
          <span 
            key={idx}
            onClick={() => setSelectedHighlight(hl)}
            className={`cursor-pointer px-1.5 py-0.5 rounded-md font-bold transition-all hover:scale-105 border ${
              hl.type === 'filler' 
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 hover:bg-amber-500/20'
            }`}
            title="Click to view suggestion"
          >
            {hl.snippet}
          </span>
        );
        
        remainingText = remainingText.substring(startIdx + hl.snippet.length);
      }
    });

    if (remainingText.length > 0) {
      elements.push(remainingText);
    }

    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-950/45 border border-slate-205 dark:border-slate-850 rounded-2.5xl text-xs sm:text-sm text-slate-800 dark:text-slate-205 leading-relaxed font-semibold">
          "{elements.length > 0 ? elements : text}"
        </div>
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
          * Click the highlighted words above to view AI recommendations.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* 1. Overall Scorecard Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.12),transparent)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3.5">
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${status.colorClass}`}>
              {status.label}
            </span>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight">AI Evaluation Scorecard</h3>
            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
              Weighted grading has been computed across Technical accuracy, Communication structure, and Confidence pacing indexes.
            </p>
          </div>

          {/* Radial score gauge */}
          <div className="flex items-center gap-4 bg-slate-800/40 border border-slate-700/30 p-4.5 rounded-2.5xl self-start md:self-center">
            <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeDasharray={`${evaluation.overallScore}, 100`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-mono font-extrabold text-lg">
                {evaluation.overallScore}%
              </div>
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450">Overall Rating</p>
              <p className="text-sm font-bold text-slate-200 mt-0.5">Composite Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Granular Dimensions Score Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* A. Technical Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <h5 className="font-heading font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Technical Accuracy</h5>
            <span className="text-sm font-extrabold font-mono text-indigo-650 dark:text-indigo-400">{evaluation.technicalScore}%</span>
          </div>

          {/* Progress Bar slider */}
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${getProgressColorClass(evaluation.technicalScore)}`}
              style={{ width: `${evaluation.technicalScore}%` }}
            />
          </div>

          <div className="space-y-3 pt-1">
            {/* Accuracy */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Domain Accuracy</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.technicalBreakdown?.accuracy || 80}%</span>
            </div>
            {/* Completeness */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Completeness</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.technicalBreakdown?.completeness || 85}%</span>
            </div>
            {/* Depth */}
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Problem-Solving Depth</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.technicalBreakdown?.depth || 75}%</span>
            </div>
          </div>
        </div>

        {/* B. Communication Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <h5 className="font-heading font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Communication Structure</h5>
            <span className="text-sm font-extrabold font-mono text-indigo-655 dark:text-indigo-400">{evaluation.communicationScore}%</span>
          </div>

          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${getProgressColorClass(evaluation.communicationScore)}`}
              style={{ width: `${evaluation.communicationScore}%` }}
            />
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Clarity & Structure (STAR)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.communicationBreakdown?.clarity || 80}%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Speech Pacing</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.communicationBreakdown?.pacing || 85}%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Conciseness</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.communicationBreakdown?.conciseness || 75}%</span>
            </div>
          </div>
        </div>

        {/* C. Confidence Score Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <h5 className="font-heading font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Confidence & Tone</h5>
            <span className="text-sm font-extrabold font-mono text-indigo-650 dark:text-indigo-400">{evaluation.confidenceScore}%</span>
          </div>

          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${getProgressColorClass(evaluation.confidenceScore)}`}
              style={{ width: `${evaluation.confidenceScore}%` }}
            />
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Tone Assertiveness</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.confidenceBreakdown?.assertiveness || 80}%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Fluency (Pause Index)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.confidenceBreakdown?.fluency || 85}%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Hesitation Index</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{evaluation.confidenceBreakdown?.hesitation || 75}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation section selectors */}
      <div className="flex gap-1.5 p-1 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl bg-white/60 dark:bg-slate-950/20 backdrop-blur-md">
        <button 
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Overview Report
        </button>
        <button 
          onClick={() => setActiveSection('transcript')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'transcript' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Grammar & Highlights
        </button>
        <button 
          onClick={() => setActiveSection('model')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeSection === 'model' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Ideal Answer Comparison
        </button>
      </div>

      {/* 3. Section Render Viewports */}

      {/* A. OVERVIEW SECTION */}
      {activeSection === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          {/* Key Strengths */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 p-5 rounded-3xl space-y-4">
            <h5 className="font-heading font-extrabold text-xs text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="h-4.5 w-4.5" /> Key Strengths
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold list-disc pl-4 leading-relaxed">
              {evaluation.strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="bg-amber-500/5 border border-amber-500/15 p-5 rounded-3xl space-y-4">
            <h5 className="font-heading font-extrabold text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertTriangle className="h-4.5 w-4.5" /> Areas for Improvement
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold list-disc pl-4 leading-relaxed">
              {evaluation.improvements.map((imp, idx) => (
                <li key={idx}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* B. TRANSCRIPT WITH WORD-HIGHLIGHTS */}
      {activeSection === 'transcript' && (
        <div className="grid md:grid-cols-3 gap-6 items-start animate-fade-in">
          {/* Highlighted text panel */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-4">
            <h5 className="font-heading font-extrabold text-slate-900 dark:text-white text-sm">Detected Transcript Analysis</h5>
            {renderHighlightedTranscript()}
          </div>

          {/* Highlight recommended rewrite details box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-4 text-xs font-semibold">
            <h5 className="font-heading font-extrabold text-slate-900 dark:text-white text-sm">Rewrite Suggestions</h5>
            {selectedHighlight ? (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Flagged Snippet</span>
                  <p className="text-slate-800 dark:text-slate-200 font-bold border-l-2 border-rose-500 pl-2 mt-1">"{selectedHighlight.snippet}"</p>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Category Tag</span>
                  <p className="text-indigo-650 dark:text-indigo-400 font-bold capitalize mt-0.5">{selectedHighlight.type} Phrasing</p>
                </div>
                {selectedHighlight.rewrite ? (
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">AI Recommended Rewrite</span>
                    <p className="text-emerald-650 dark:text-emerald-450 font-bold border-l-2 border-emerald-500 pl-2 mt-1">"{selectedHighlight.rewrite}"</p>
                  </div>
                ) : (
                  <p className="text-slate-455 font-bold italic mt-2">Recommended Action: Omit this filler pause to improve conciseness.</p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic">Select any highlighted words on the left transcript to load granular rewrite tips.</p>
            )}
          </div>
        </div>
      )}

      {/* C. SIDE-BY-SIDE IDEAL RESPONSE COMPARISON */}
      {activeSection === 'model' && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          {/* Candidate answer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 sm:p-6 rounded-3xl space-y-3">
            <h5 className="font-heading font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-slate-400" /> Your Response
            </h5>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-semibold italic border-l-2 border-slate-300 dark:border-slate-800 pl-3">
              "{evaluation.candidateAnswer}"
            </p>
          </div>

          {/* AI Model answer */}
          <div className="bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 p-5 sm:p-6 rounded-3xl space-y-3">
            <h5 className="font-heading font-extrabold text-xs text-indigo-650 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
              <TrendingUp className="h-4.5 w-4.5" /> AI Recommended Blueprint
            </h5>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold italic border-l-2 border-indigo-500/30 pl-3">
              "{evaluation.idealAnswer}"
            </p>
          </div>
        </div>
      )}

      {/* 4. Action bar footer */}
      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-slate-200/50 dark:border-slate-850">
        <button
          onClick={onRetake}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-655 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="h-4 w-4" /> Re-take This Question
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:scale-[1.01] active:scale-99 transition-all text-xs sm:text-sm uppercase tracking-wide font-heading flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4.5 w-4.5" /> Save Feedback to History
            </>
          )}
        </button>
      </div>

    </div>
  );
}
