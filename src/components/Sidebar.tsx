import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  LayoutDashboard, 
  User, 
  UploadCloud, 
  Play, 
  Menu, 
  ChevronLeft, 
  LogOut, 
  Settings, 
  HelpCircle,
  History,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Sidebar({ isLoggedIn, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics & Progress', icon: TrendingUp },
    { to: '/profile', label: 'User Profile', icon: User },
    { to: '/resume-upload', label: 'Resume Upload', icon: UploadCloud },
    { to: '/practice', label: 'Interview Practice', icon: Play },
    { to: '/history', label: 'Session History', icon: History },
  ];

  const activeStyle = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <Bot className="h-4.5 w-4.5" />
          </div>
          <span className="font-heading font-extrabold text-base text-slate-900 dark:text-white">InterVue.AI</span>
        </div>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:static lg:block'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} h-full shrink-0`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shrink-0 shadow-md shadow-indigo-600/10">
              <Bot className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="font-heading font-extrabold text-lg text-slate-900 dark:text-white tracking-tight animate-fade-in">
                InterVue<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
              </span>
            )}
          </div>
          
          {/* Collapse Toggle desktop */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Routes Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              onClick={() => setIsMobileOpen(false)}
              className={activeStyle}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3.5 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Settings className="h-4.5 w-4.5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button 
            onClick={onLogout}
            className="flex items-center gap-3.5 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Overlay Backdrop Mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-35 lg:hidden"
        />
      )}
    </>
  );
}
