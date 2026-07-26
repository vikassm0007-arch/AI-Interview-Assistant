import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12 flex-grow flex flex-col justify-center text-center">
      
      {/* Header */}
      <div className="space-y-3 max-w-xl mx-auto">
        <h2 className="font-heading text-4xl font-extrabold text-slate-900 tracking-tight">
          Invest in Your Career
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Unlock unlimited mock interviews, expert pacing diagnostics, and deep contextual resume keyword evaluations.
        </p>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch w-full">
        {/* Tier 1: Free */}
        <div className="bg-white border border-brand-platinum p-8 rounded-3xl text-left flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="font-heading text-lg font-bold text-slate-900">Practice Starter</h4>
            <p className="text-slate-500 text-xs leading-relaxed">For casual interview readiness checking.</p>
            <p className="font-heading text-3xl font-extrabold pt-2 text-slate-900">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></p>
          </div>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> 2 mock sessions / month</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Basic audio parsing</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Text transcripts</li>
          </ul>
          <button onClick={handleStartFree} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer">
            Get Started Free
          </button>
        </div>

        {/* Tier 2: Pro */}
        <div className="bg-white border-2 border-brand-indigo p-8 rounded-3xl text-left flex flex-col justify-between space-y-6 shadow-md relative">
          <span className="absolute top-0 right-8 -translate-y-1/2 bg-brand-indigo text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            Most Popular
          </span>
          <div className="space-y-2">
            <h4 className="font-heading text-lg font-bold text-brand-indigo">Pro Candidate</h4>
            <p className="text-slate-500 text-xs leading-relaxed">For active job seekers targeting top tier roles.</p>
            <p className="font-heading text-3xl font-extrabold pt-2 text-slate-900">$19 <span className="text-xs font-normal text-slate-400">/ month</span></p>
          </div>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Unlimited mock sessions</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Advanced speech analysis</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Line-by-line AI critique tooltips</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Custom resume skill parsing</li>
          </ul>
          <button onClick={handleStartFree} className="w-full bg-brand-indigo hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-brand-indigo/15">
            Go Pro Now
          </button>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="bg-white border border-brand-platinum p-8 rounded-3xl text-left flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="font-heading text-lg font-bold text-slate-900">Enterprise</h4>
            <p className="text-slate-500 text-xs leading-relaxed">For universities and coding bootcamps.</p>
            <p className="font-heading text-3xl font-extrabold pt-2 text-slate-900">Custom <span className="text-xs font-normal text-slate-400">pricing</span></p>
          </div>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Custom company question banks</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Bulk dashboard analytics</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-indigo" /> Dedicated advisor support</li>
          </ul>
          <button onClick={handleStartFree} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer">
            Contact Sales
          </button>
        </div>
      </div>

    </div>
  );
}
