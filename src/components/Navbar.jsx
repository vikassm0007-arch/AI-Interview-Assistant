import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bot, Menu, X, LayoutDashboard, UploadCloud, GraduationCap, DollarSign, Play, Briefcase, Sun, Moon, User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';

export default function Navbar({ theme, toggleTheme, isLoggedIn, setIsLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCTAClick = () => {
    setIsOpen(false);
    if (isLoggedIn) {
      navigate('/practice');
    } else {
      navigate('/login');
    }
  };

  const handleSignOut = () => {
    setShowProfile(false);
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: null },
    { to: '/practice', label: 'Practice', icon: Play },
    { to: '/resume-analyzer', label: 'Resume Prep', icon: UploadCloud },
    { to: '/question-bank', label: 'Questions', icon: GraduationCap },
    { to: '/pricing', label: 'Pricing', icon: DollarSign },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];

  // Filter links depending on logged-in state
  const filteredLinks = isLoggedIn
    ? navLinks
    : navLinks.filter(link => ['/', '/question-bank', '/pricing'].includes(link.to));

  const activeStyle = ({ isActive }) => 
    `px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-605/10' 
        : 'text-slate-655 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  const mobileActiveStyle = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;

  return (
    <nav className="bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo - Left */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="bg-indigo-600 text-white p-2 rounded-xl transition-transform group-hover:scale-105 shadow-md shadow-indigo-600/10">
                <Bot className="h-5 w-5" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                InterVue<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
              </span>
            </NavLink>
          </div>

          {/* Navigation Links - Desktop Center */}
          <div className="hidden lg:flex items-center gap-1.5">
            {filteredLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={activeStyle}>
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Action Buttons - Desktop Right */}
          <div className="hidden lg:flex items-center gap-3.5">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-500 fill-current" /> : <Moon className="h-4.5 w-4.5 text-indigo-650" />}
            </button>

            {isLoggedIn ? (
              <>
                {/* Quick Stats: Credits Left */}
                <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 px-3.5 py-1.5 rounded-full" title="Your monthly practice tokens">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">8/10 Credits</span>
                </div>

                {/* User Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2.5 p-1 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-heading font-extrabold text-sm border border-indigo-500/10">
                      VS
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Vikas S.</p>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-left animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 dark:text-slate-500">Signed in as</p>
                        <p className="text-sm font-bold text-slate-850 dark:text-slate-200 truncate">Vikas S.</p>
                        <p className="text-xs text-slate-505 dark:text-slate-400 truncate">vikas@example.com</p>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={() => { setShowProfile(false); navigate('/dashboard'); }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-705 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400" />
                          Candidate Dashboard
                        </button>
                        <button
                          onClick={() => { setShowProfile(false); navigate('/practice'); }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-705 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
                        >
                          <Sparkles className="h-4 w-4 text-indigo-500" />
                          Start Mock Session
                        </button>
                        <button
                          onClick={() => { setShowProfile(false); navigate('/pricing'); }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-705 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer"
                        >
                          <Settings className="h-4 w-4 text-slate-400" />
                          Upgrade Plan
                        </button>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 p-1">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-sm font-semibold text-slate-655 dark:text-slate-350 hover:text-indigo-650">
                  Sign In
                </NavLink>
                <button
                  onClick={handleCTAClick}
                  className="bg-indigo-605 bg-indigo-600 hover:bg-indigo-705 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm cursor-pointer border border-indigo-505"
                >
                  Start Free Mock
                </button>
              </>
            )}

          </div>

          {/* Mobile Menu Button & Mobile Toggle - Right */}
          <div className="flex lg:hidden items-center gap-2">
            
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500 fill-current" /> : <Moon className="h-5 w-5 text-indigo-600" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-650 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-all cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-205 dark:border-slate-800 shadow-xl z-40 p-4 space-y-4 animate-fade-in transition-colors duration-300">
          
          {isLoggedIn && (
            <div className="flex justify-between items-center bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 p-3 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Usage Balance</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">8 of 10 Credits Remaining</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {filteredLinks.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={mobileActiveStyle}
                onClick={() => setIsOpen(false)}
              >
                {link.icon ? <link.icon className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-3">
            {isLoggedIn ? (
              <button 
                onClick={() => { setIsOpen(false); handleSignOut(); }} 
                className="w-full text-center font-bold py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer text-sm"
              >
                Sign Out
              </button>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className="text-center font-bold py-3 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </NavLink>
                <button
                  onClick={handleCTAClick}
                  className="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-center cursor-pointer text-sm"
                >
                  Start Free Mock Interview
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
