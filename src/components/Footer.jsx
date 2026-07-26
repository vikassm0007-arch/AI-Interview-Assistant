import { Bot, Heart, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white mt-auto border-t border-slate-200/10 transition-colors duration-300">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column (Span 2) */}
          <div className="space-y-5 text-left md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-600/10">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight">
                InterVue<span className="text-indigo-400">.AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              Empowering global candidates to master high-pressure technical, behavioral, and system design interviews with state-of-the-art AI speech heuristics.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold text-slate-200 tracking-wide uppercase">Weekly prep tips & features</p>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your professional email"
                  className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-xs w-full focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/15 shrink-0 cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Subscribed successfully!
                </p>
              )}
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="text-left space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Product & Tools</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">AI Interview Sim</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resume Analyzer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">STAR Framework Prep</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing Plans</a></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="text-left space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Resources</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">System Design Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Behavioral Accordions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Filler Word Databases</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Platform Compliance</a></li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance Badges */}
          <div className="text-left space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Trust & Security</h5>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-800/50 border border-slate-700/40 p-2 rounded-lg flex flex-col justify-between h-14">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-[9px] font-extrabold uppercase text-slate-300">GDPR Ready</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/40 p-2 rounded-lg flex flex-col justify-between h-14">
                <Lock className="h-4 w-4 text-indigo-400" />
                <span className="text-[9px] font-extrabold uppercase text-slate-300">SOC 2 TYPE II</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/40 p-2 rounded-lg flex flex-col justify-between h-14">
                <FileText className="h-4 w-4 text-cyan-400" />
                <span className="text-[9px] font-extrabold uppercase text-slate-300">HIPAA Compliant</span>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/40 p-2 rounded-lg flex flex-col justify-between h-14">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span className="text-[9px] font-extrabold uppercase text-slate-300">100% Secure</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Footer */}
      <div className="border-t border-slate-800 bg-slate-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5 text-xs text-slate-500 font-semibold">
            <span>&copy; {new Date().getFullYear()} InterVue.AI Inc.</span>
            <span className="h-3 w-px bg-slate-800" />
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <span className="h-3 w-px bg-slate-800" />
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
          </div>

          {/* Socials & Attribution */}
          <div className="flex items-center gap-5">
            <div className="flex gap-4 text-slate-500">
              <a href="#" className="hover:text-white transition-colors" title="Twitter / X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" title="GitHub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-current" /> for Vikas
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
