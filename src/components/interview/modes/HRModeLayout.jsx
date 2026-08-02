import React, { useState, useEffect } from 'react';
import { Mic, Square, Volume2, Info, CheckCircle, Video, ShieldAlert } from 'lucide-react';

export default function HRModeLayout({
  activeQuestion,
  voiceDraft,
  textAnswer,
  setTextAnswer,
  isRecording,
  handleStartVoice,
  handleStopVoice,
  handleClearResponse,
  micLevel,
  showTips
}) {
  const [starChecklist, setStarChecklist] = useState({
    situation: false,
    task: false,
    action: false,
    result: false
  });

  const [wpm, setWpm] = useState(0);

  // Compute pacing rate (words per minute) based on draft text length
  useEffect(() => {
    if (!voiceDraft) {
      setWpm(0);
      return;
    }
    const words = voiceDraft.trim().split(/\s+/).length;
    // Mock pacing WPM average
    setWpm(Math.round(words * 12 + 105));
  }, [voiceDraft]);

  const toggleStar = (key) => {
    setStarChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 items-start text-left animate-fade-in">
      
      {/* Left: Non-Verbal webcam visualizer and pacing meters (1/3) */}
      <div className="space-y-4">
        {/* Webcam Mockup */}
        <div className="bg-slate-950 rounded-2.5xl overflow-hidden border border-slate-800 relative aspect-video flex flex-col justify-between p-4 min-h-[180px]">
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center animate-pulse">
                <Video className="h-5 w-5 text-indigo-400" />
              </div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Webcam Mock Feed</p>
            </div>
          </div>

          <div className="relative z-10 bg-black/60 px-2 py-0.5 rounded-md text-[8px] font-bold text-emerald-400 self-start">
            LIVE ANALYTICS ACTIVE
          </div>

          {/* AI Eye Contact tracking status */}
          <div className="relative z-10 bg-black/60 p-2 rounded-xl text-[9px] text-slate-350 self-start border border-white/5 space-y-1">
            <p>👁 Eye Contact: <span className="text-emerald-405 font-bold">Stable (94%)</span></p>
            <p>👤 Posture: <span className="text-emerald-405 font-bold">Upright</span></p>
          </div>
        </div>

        {/* STAR Checklist panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-3.5 shadow-sm">
          <div>
            <h5 className="font-heading font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider">STAR Coverage Check</h5>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Check elements as you state them</p>
          </div>

          <div className="space-y-2">
            {[
              { id: 'situation', label: 'Situation (Challenge details)' },
              { id: 'task', label: 'Task (Role responsibilities)' },
              { id: 'action', label: 'Action (Your specific tasks)' },
              { id: 'result', label: 'Result (Quantifiable outcomes)' }
            ].map(item => {
              const checked = starChecklist[item.id];
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleStar(item.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex justify-between items-center text-xs transition-all ${
                    checked 
                      ? 'border-indigo-650 bg-indigo-500/5 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-405 font-bold' 
                      : 'border-slate-150 dark:border-slate-850 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <CheckCircle className={`h-4.5 w-4.5 shrink-0 ${checked ? 'text-indigo-600 dark:text-indigo-400 fill-current text-white' : 'text-slate-200 dark:text-slate-800'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Speech pacing meter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4.5 rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Speech Pacing</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">{wpm ? `${wpm} WPM` : 'Silent'}</p>
          </div>
          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            wpm === 0 ? 'bg-slate-100 text-slate-400' : wpm >= 110 && wpm <= 150 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
            {wpm === 0 ? 'Quiet' : wpm >= 110 && wpm <= 150 ? 'Ideal Tempo' : 'Too Fast'}
          </span>
        </div>
      </div>

      {/* Right: Question card and active recorders (2/3) */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Active Tips Box */}
        {showTips && (
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 p-4.5 rounded-2.5xl flex gap-3 items-start animate-fade-in shadow-inner">
            <Info className="h-4.5 w-4.5 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed font-semibold">
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">STAR Guidelines:</p>
              To rank as a Job Ready candidate, structure your response sequentially: frame the bottleneck, outline your responsibilities, specify what you did, and state the metrics outcomes.
            </div>
          </div>
        )}

        {/* Audio Waveform recorder panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-5">
          <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">🎤 Voice Answer Module</span>
            <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span className={`h-2 w-2 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
              <span>{isRecording ? 'Live Pacing feedback active' : 'Mic ready'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-6 border border-slate-100 dark:border-slate-850 rounded-2.5xl bg-slate-50/50 dark:bg-slate-950/20">
            {/* Wave amplitude */}
            <div className="flex gap-1 items-center h-10 w-44 shrink-0">
              {micLevel.map((lvl, idx) => (
                <div 
                  key={idx}
                  className="w-1.5 rounded-sm bg-indigo-600 transition-all duration-100"
                  style={{ height: isRecording ? `${lvl}%` : '8%' }}
                />
              ))}
            </div>

            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartVoice}
                className="h-16 w-16 rounded-full bg-indigo-650 bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Mic className="h-6 w-6" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopVoice}
                className="h-16 w-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 animate-pulse"
              >
                <Square className="h-5 w-5 fill-current" />
              </button>
            )}
          </div>

          {/* Draft text */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Live Transcript Draft</span>
            <div className="border border-slate-250 border-slate-200/50 dark:border-slate-850 p-4 rounded-2xl min-h-[100px] text-xs text-slate-805 dark:text-slate-205 bg-slate-50/20 italic font-semibold leading-relaxed">
              {voiceDraft ? (
                `"${voiceDraft}"`
              ) : (
                <span className="text-slate-400">Click the microphone button and start speaking to transcribe your live answer...</span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
