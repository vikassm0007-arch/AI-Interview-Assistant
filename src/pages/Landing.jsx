import { useNavigate } from 'react-router-dom';
import { Bot, Shield, Zap, Target, Star, Check, ArrowRight, Video, Mic, LayoutDashboard, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 text-center space-y-8 relative z-10 text-left">
        <div className="flex justify-center">
          <span className="bg-indigo-50 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-850/60 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
            <Zap className="h-3.5 w-3.5 fill-current" /> Next-Gen AI Heuristics Prep
          </span>
        </div>
        
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight text-center">
          Ace Your Next Interview with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-305">Real-Time AI Feedback</span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed text-center font-medium">
          Upload your resume and target job descriptions. Our simulated video evaluator checks technical accuracy, behavioral STAR structure, and flags speech filler words in real time.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => navigate('/practice')}
            className="w-full sm:w-auto bg-indigo-605 bg-indigo-605 bg-indigo-600 hover:bg-indigo-750 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wide font-heading"
          >
            Start Free Practice
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/resume-analyzer')}
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold py-3.5 px-8 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer uppercase tracking-wide font-heading"
          >
            Analyze Resume
          </button>
        </div>

        {/* Visual Mockup/Preview of Active Interview */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-850 shadow-2xl relative mt-12 animate-fade-in group transition-colors duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.02),transparent)] pointer-events-none rounded-3xl" />
          
          <div className="grid md:grid-cols-5 gap-5 items-stretch">
            {/* Left Column: Mock Webcam Panel (2/5) */}
            <div className="md:col-span-2 aspect-[4/3] bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center text-white border border-slate-800 shadow-inner">
              <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-full text-[9px] font-bold text-emerald-400 flex items-center gap-1 border border-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Camera
              </div>
              <div className="h-14 w-14 rounded-full bg-indigo-500/10 flex items-center justify-center border-2 border-indigo-500 animate-pulse">
                <Video className="h-6 w-6 text-indigo-400" />
              </div>
              <p className="text-slate-400 text-[10px] mt-2 font-bold tracking-wide uppercase">Webcam active</p>
              
              {/* Mic Meter Dot waveform */}
              <div className="absolute top-3 right-3 bg-black/70 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-[9px] border border-white/10">
                <Mic className="h-3 w-3 text-emerald-400" />
                <div className="flex gap-0.5 items-center h-3">
                  <div className="w-0.5 h-2 bg-emerald-400 rounded-sm" />
                  <div className="w-0.5 h-3.5 bg-emerald-400 rounded-sm animate-pulse" />
                  <div className="w-0.5 h-1.5 bg-emerald-400 rounded-sm" />
                  <div className="w-0.5 h-2.5 bg-emerald-400 rounded-sm animate-pulse" />
                </div>
              </div>
            </div>

            {/* Right Column: Interview Question Panel (3/5) */}
            <div className="md:col-span-3 bg-slate-50/60 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-850 text-left flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <span className="bg-indigo-100 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Question 1 of 3
                </span>
                <span className="text-[9px] font-extrabold text-[#EF4444] bg-red-500/10 px-2 py-0.5 rounded-full">
                  48s remaining
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/40 dark:border-slate-850 shadow-xs flex gap-3 items-start transition-colors duration-300">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AI
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400">InterVue AI</p>
                  <p className="text-xs text-slate-800 dark:text-slate-205 font-bold leading-relaxed">
                    Can you describe a time when you had to optimize the performance of a React web application?
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/50 dark:border-slate-850 flex-grow min-h-[60px] flex items-end">
                <span className="text-xs text-indigo-650 dark:text-indigo-400 font-bold block animate-pulse mr-1.5">🎤</span>
                <p className="text-[11px] italic text-slate-550 dark:text-slate-400 leading-normal font-medium">
                  "Yeah, absolutely. So we had a large list rendering in a dashboard that was really slow..."
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 scroll-mt-16 relative z-10 border-t border-slate-200/40 dark:border-slate-850 mt-4">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Why Practice with InterVue.AI?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">Engineered to simulate actual high-pressure technical and behavioral interviews</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left space-y-4 group">
            <div className="bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-3.5 rounded-xl inline-block group-hover:scale-110 transition-transform">
              <Bot className="h-6 w-6" />
            </div>
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Custom Heuristics Evaluation</h4>
            <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
              Our parser matches your uploaded resume against target job roles, seeding questions that match your concrete technology stack.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left space-y-4 group">
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3.5 rounded-xl inline-block group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6" />
            </div>
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Pacing & Filler Word Alerts</h4>
            <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
              A voice amplitude meter analyzes response velocities and flags repetitive connector filler words (like "so" or "um").
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2.5xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left space-y-4 group">
            <div className="bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-3.5 rounded-xl inline-block group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <h4 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Granular Interactive Reports</h4>
            <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
              Interactive transcripts outline feedback annotations in context. Click marked phrases to expand corrections and view model answers.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center border-t border-slate-200/40 dark:border-slate-850 z-10 relative">
        <div className="text-center space-y-2 mb-12">
          <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">Real Success Stories</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">See how preparers are optimizing their pacing and STAR accuracy</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2.5xl border border-slate-205/60 dark:border-slate-800/80 shadow-sm text-left space-y-4 relative transition-colors duration-300">
            <div className="flex gap-1 text-amber-500">
              <Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" />
            </div>
            <p className="text-slate-700 dark:text-slate-350 text-xs sm:text-sm leading-relaxed italic font-medium">
              "The speech feedback is incredible. It caught that I kept starting sentences with 'So yeah' and urged me to describe my list virtualization project more cleanly. Got the offer last week!"
            </p>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Alex M.</p>
              <p className="text-[10px] text-slate-400">Frontend Web Developer</p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2.5xl border border-slate-205/60 dark:border-slate-800/80 shadow-sm text-left space-y-4 relative transition-colors duration-300">
            <div className="flex gap-1 text-amber-500">
              <Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" /><Star className="h-4.5 w-4.5 fill-current" />
            </div>
            <p className="text-slate-700 dark:text-slate-350 text-xs sm:text-sm leading-relaxed italic font-medium">
              "I utilized the UI/UX critique module. The questions about usability heuristics were spot-on with what my Google panel eventually asked. Excellent prep!"
            </p>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Anjali R.</p>
              <p className="text-[10px] text-slate-400">Product Lead Designer</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
