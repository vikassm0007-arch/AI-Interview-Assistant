import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return 'Email is required';
    if (!emailRegex.test(val)) return 'Please enter a valid email address';
    return '';
  };

  const handleBlur = () => {
    setError(validateEmail(email));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const isFormInvalid = !!validateEmail(email);

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Return to Landing Link */}
      <Link to="/login" className="absolute top-6 left-6 text-xs font-bold text-slate-550 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800/80 overflow-hidden grid md:grid-cols-2">
        
        {/* Left Side: Gradient Promo Block */}
        <div className="flex flex-col justify-between p-12 bg-gradient-to-b from-indigo-650 via-indigo-900 to-slate-950 text-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight">InterVue.AI</span>
          </div>

          {/* Center Info */}
          <div className="my-auto space-y-6 relative z-10 text-left">
            <div>
              <span className="bg-emerald-500/20 text-emerald-400 font-bold px-3.5 py-1.5 rounded-full text-[10px] tracking-wide uppercase border border-emerald-500/10">
                Encrypted Auth
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Trouble Logging In?
            </h2>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-normal">
              Enter your email address and we'll send you an encrypted link to reset your credentials.
            </p>
          </div>

          {/* Footer Text */}
          <div className="text-[10px] text-white/40 font-semibold tracking-wider uppercase relative z-10 text-left">
            Trusted by developers worldwide.
          </div>
        </div>

        {/* Right Side: Action Forms */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 text-left">
          
          {!submitted ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Forgot Password</h3>
                <p className="text-slate-500 dark:text-slate-405 text-xs sm:text-sm mt-2">
                  Enter your email address to receive a secure password reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 ${
                        error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500'
                      }`}
                      placeholder="name@company.com"
                    />
                  </div>
                  {error && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">{error}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || isFormInvalid}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Reset Link...</span>
                    </div>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>

              <div className="pt-2 flex justify-center">
                <Link to="/login" className="flex items-center gap-1.5 text-xs text-indigo-650 dark:text-indigo-400 font-bold hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="flex justify-center text-emerald-500">
                <CheckCircle2 className="h-14 w-14" />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Check Your Inbox</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  We've sent a secure password reset link to:
                  <br />
                  <strong className="text-slate-800 dark:text-slate-200 font-bold">{email}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-550">
                Didn't receive the email?{' '}
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline focus:outline-none cursor-pointer"
                >
                  Click to resend
                </button>
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                <Link to="/login" className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
