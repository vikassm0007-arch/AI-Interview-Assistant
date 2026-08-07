import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Clock, CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Brain, Sparkles } from 'lucide-react';

const SAMPLE_APTITUDE_QUESTIONS = [
  {
    id: 'apt-1',
    category: 'Quantitative Aptitude',
    topic: 'Speed, Distance & Time',
    questionText: 'A train 150 meters long passes a telegraph post in 12 seconds. Find the speed of the train in km/hr.',
    options: ['30 km/hr', '45 km/hr', '50 km/hr', '60 km/hr'],
    correctOption: 1, // 45 km/hr
    derivation: `Step 1: Calculate speed in m/s.\nSpeed = Distance / Time = 150m / 12s = 12.5 m/s.\n\nStep 2: Convert m/s to km/hr by multiplying by (18 / 5).\nSpeed in km/hr = 12.5 * (18 / 5) = 2.5 * 18 = 45 km/hr.\n\nShortcut Formula: Speed (km/h) = (Length in meters / Time in sec) * 3.6`
  },
  {
    id: 'apt-2',
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    questionText: 'If "COMPUTER" is written as "RFUVQNPC", how is "MEDICINE" written in that code?',
    options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'MFEDJJOE'],
    correctOption: 1, // EOJDEJFM
    derivation: `Step 1: Reverse the word: "COMPUTER" -> "RETUPMOC".\nStep 2: Add 1 to each character:\n R+1=S, E+1=F, T+1=U, U+1=V, P+1=Q, M+1=N, O+1=P, C+1=D -> "RFUVQNPC".\n\nApplying to "MEDICINE":\nReverse: "ENICIDEM".\nAdd 1 to each letter: E+1=F, N+1=O, I+1=J, C+1=D, I+1=J, D+1=E, E+1=F, M+1=N -> "EOJDEJFM".`
  },
  {
    id: 'apt-3',
    category: 'Verbal & Analytical',
    topic: 'Sentence Correction',
    questionText: 'Choose the grammatically correct sentence:',
    options: [
      'Neither the manager nor the engineers was available.',
      'Neither the manager nor the engineers were available.',
      'Neither the manager or the engineers was available.',
      'Neither the manager nor the engineers is available.'
    ],
    correctOption: 1, // 'were available'
    derivation: `Rule of Proximity: When subjects are joined by "neither... nor", the verb agrees with the closer subject ("engineers", which is plural). Therefore, "were available" is correct.`
  }
];

export default function AptitudeQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(90);

  const activeQuestion = SAMPLE_APTITUDE_QUESTIONS[currentIdx];

  // Timer countdown tick
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    if (selectedOption === activeQuestion.correctOption) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setTimerSeconds(90);
    if (currentIdx < SAMPLE_APTITUDE_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Completed quiz
    }
  };

  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe math evaluation snippet
        const res = Function(`"use strict"; return (${calcInput})`)();
        setCalcResult(res.toString());
      } catch (err) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-left relative">
      
      {/* Quiz Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
            {activeQuestion.category} • {activeQuestion.topic}
          </span>
          <h3 className="font-heading font-extrabold text-slate-900 dark:text-white text-xl mt-2">
            Aptitude & Reasoning Screening Drill
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer pill */}
          <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Clock className="h-4 w-4 text-amber-500" /> {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
          </div>

          {/* Calculator toggle */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
            title="Toggle Virtual Calculator"
          >
            <Calculator className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm relative">
        
        {/* Question Counter */}
        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
          Question {currentIdx + 1} of {SAMPLE_APTITUDE_QUESTIONS.length}
        </div>

        {/* Question Text */}
        <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-relaxed">
          {activeQuestion.questionText}
        </h4>

        {/* Options List */}
        <div className="grid gap-3 pt-2">
          {activeQuestion.options.map((opt, idx) => {
            let isSelected = selectedOption === idx;
            let isCorrect = activeQuestion.correctOption === idx;

            let optionStyle = 'border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-200 hover:border-indigo-500';

            if (submitted) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-300 font-bold';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-950 dark:text-rose-300';
              }
            } else if (isSelected) {
              optionStyle = 'border-indigo-600 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold';
            }

            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-extrabold flex items-center justify-center shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {submitted && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                {submitted && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Form Action Bar */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-heading cursor-pointer disabled:opacity-50 transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-heading flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              Next Question <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Step-by-Step Solution Breakdown Reveal */}
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-3 animate-fade-in text-xs"
          >
            <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white text-sm">
              <Brain className="h-4 w-4 text-indigo-500" /> Step-by-Step Solution Derivation
            </div>
            <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeQuestion.derivation}
            </pre>
          </motion.div>
        )}

      </div>

      {/* Virtual Calculator Drawer Modal */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-2xl w-64 space-y-3 font-mono text-white text-left"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs font-bold">
              <span className="flex items-center gap-1.5"><Calculator className="h-4 w-4 text-indigo-400" /> Virtual Calc</span>
              <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-white">×</button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right space-y-1">
              <div className="text-xs text-slate-400 h-4 overflow-hidden">{calcInput || '0'}</div>
              <div className="text-base font-bold text-emerald-400 h-6 overflow-hidden">{calcResult || '='}</div>
            </div>

            {/* Calculator Pad Grid */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleCalcClick(btn)}
                  className={`p-2.5 rounded-xl font-bold transition-colors cursor-pointer ${
                    btn === '=' ? 'bg-indigo-600 text-white col-span-1' : btn === 'C' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
