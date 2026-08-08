import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, Mail, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();

  // Password strength checker helper
  const getPasswordStrength = (val) => {
    if (!val) return { score: 0, text: 'No Password', color: 'bg-slate-200 dark:bg-slate-800' };
    if (val.length < 8) return { score: 1, text: 'Weak (Min 8 chars)', color: 'bg-red-500' };
    
    let criteriaMet = 0;
    if (/[A-Z]/.test(val)) criteriaMet++;
    if (/[0-9]/.test(val)) criteriaMet++;
    if (/[^A-Za-z0-9]/.test(val)) criteriaMet++;

    if (criteriaMet < 2) {
      return { score: 2, text: 'Medium (Add symbols/numbers)', color: 'bg-amber-500' };
    }
    if (criteriaMet === 3) {
      return { score: 3, text: 'Strong', color: 'bg-emerald-500' };
    }
    return { score: 2, text: 'Medium', color: 'bg-amber-500' };
  };

  const strength = getPasswordStrength(password);

  const validateName = (val) => {
    if (!val) return 'Full Name is required';
    return '';
  };

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) return 'Email is required';
    if (!emailRegex.test(val)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (val) => {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(val)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(val)) return 'Password must contain at least one special character';
    return '';
  };

  const validateConfirmPassword = (val) => {
    if (!val) return 'Confirm Password is required';
    if (val !== password) return 'Passwords do not match';
    return '';
  };

  const handleBlur = (field, val) => {
    let err = '';
    if (field === 'name') err = validateName(val);
    if (field === 'email') err = validateEmail(val);
    if (field === 'password') err = validatePassword(val);
    if (field === 'confirmPassword') err = validateConfirmPassword(val);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confErr = validateConfirmPassword(confirmPassword);

    if (nameErr || emailErr || passErr || confErr || !agree) {
      setErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confErr });
      return;
    }

    setLoading(true);
    setErrors({});
    setApiError('');

    await login({ email, password });
    updateUser({ name, email });
    setLoading(false);
    navigate('/dashboard');
  };

  const isFormInvalid = 
    !!validateName(name) || 
    !!validateEmail(email) || 
    !!validatePassword(password) || 
    !!validateConfirmPassword(confirmPassword) ||
    !agree;

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
              Create Your Free Account
            </h2>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-normal">
              Practice mock interviews customized to your actual resume. Get instant voice transcripts and delivery recommendations.
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

        {/* Right Side: Signup Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 text-left">
          <div className="mb-4">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sign Up</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
              Start building your interview confidence today.
            </p>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  onBlur={(e) => handleBlur('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1">
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
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500'
                  }`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Password
              </label>
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
                  className={`w-full pl-10 pr-10 py-2 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-655 ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500'
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
                <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.password}</p>
              )}

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1 pt-1 animate-fade-in">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">
                    <span>Complexity Check</span>
                    <span className={strength.score === 3 ? 'text-emerald-500' : strength.score === 2 ? 'text-amber-500' : 'text-red-500'}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex gap-0.5 border border-slate-200/20">
                    <div className={`h-full transition-all duration-305 ${strength.color}`} style={{ width: strength.score === 1 ? '33.3%' : strength.score === 2 ? '66.6%' : strength.score === 3 ? '100%' : '0%' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] font-bold text-red-500 mt-0.5">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Agree Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-505 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded cursor-pointer mt-0.5"
              />
              <label htmlFor="agree" className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer select-none leading-tight">
                I agree to the <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Terms</a> & <a href="#" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Privacy Policy</a>
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold text-center mt-3.5">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              Log In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
