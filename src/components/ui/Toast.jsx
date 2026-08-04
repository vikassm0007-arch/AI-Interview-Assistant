import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Render Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none p-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      addToast: (t) => console.log('Toast:', t),
      removeToast: () => {}
    };
  }
  return context;
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <XCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-indigo-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200',
    error: 'border-rose-500/20 bg-rose-500/10 text-rose-950 dark:text-rose-200',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-950 dark:text-amber-200',
    info: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-950 dark:text-indigo-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-xl bg-white/90 dark:bg-slate-900/90 ${borders[toast.type] || borders.info}`}
    >
      {icons[toast.type] || icons.info}
      <div className="flex-grow space-y-0.5 text-left">
        {toast.title && (
          <h5 className="font-heading font-extrabold text-xs tracking-wide">{toast.title}</h5>
        )}
        <p className="text-xs font-semibold leading-relaxed opacity-90">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
