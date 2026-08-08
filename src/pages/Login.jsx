import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Bot, Mail, Lock, LogIn, Eye, EyeOff, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('vikas@example.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return 'Email is required';
    if (!emailRegex.test(val)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (val) => {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleBlur = (field, val) => {
    let err = '';
    if (field === 'email') err = validateEmail(val);
    if (field === 'password') err = validatePassword(val);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setLoading(true);
    setErrors({});
    setApiError('');
    
    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setApiError(res.error || 'An error occurred during sign in');
    }
  };

  const isFormInvalid = !!validateEmail(email) || !!validatePassword(password);

  return (
    <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Return to Landing Link */}
      <Link to="/" className="absolute top-6 left-6 text-xs font-bold text-slate-550 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
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
                AI Heuristics Engine
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Master Your Next Technical Interview
            </h2>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-normal">
              Get real-time speech-to-text feedback, behavioral heuristics scoring, and tailored technical critiques to land your dream role.
            </p>
          </div>

          {/* Social Proof Badge */}
          <div className="relative z-10 flex items-center gap-2 text-left bg-white/5 border border-white/10 p-3 rounded-2xl">
            <div className="flex -space-x-2.5">
              <div className="h-6 w-6 rounded-full bg-slate-400 border border-slate-900 flex items-center justify-center font-bold text-[9px] text-white">U1</div>
              <div className="h-6 w-6 rounded-full bg-indigo-500 border border-slate-900 flex items-center justify-center font-bold text-[9px] text-white">U2</div>
              <div className="h-6 w-6 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center font-bold text-[9px] text-white">U3</div>
            </div>
            <div className="text-[11px] font-semibold text-slate-350">
              <span className="text-white font-bold">Trusted by 10,000+</span> tech candidates
            </div>
          </div>
        </div>

        {/* Right Side: Credentials Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 text-left">
          <div className="mb-6">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2">
              Please sign in to access your interview dashboard.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-405 block">
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
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500'
                  }`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-405 block">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Keep Logged In */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-350 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                Keep me logged in for 30 days
              </label>
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
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Link to Signup */}
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-center mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Social Divider */}
          <div className="relative flex items-center my-5">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
            <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Or Continue With
            </span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleLoginSubmit}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer bg-white dark:bg-slate-900"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              onClick={handleLoginSubmit}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer bg-white dark:bg-slate-900"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
