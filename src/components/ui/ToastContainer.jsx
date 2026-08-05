import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useToastContext } from '../../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast, setIsPaused } = useToastContext();

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <XCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-indigo-500 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/25 bg-emerald-500/10 text-slate-900 dark:text-emerald-200',
    error: 'border-rose-500/25 bg-rose-500/10 text-slate-900 dark:text-rose-200',
    warning: 'border-amber-500/25 bg-amber-500/10 text-slate-900 dark:text-amber-200',
    info: 'border-indigo-500/25 bg-indigo-500/10 text-slate-900 dark:text-indigo-200'
  };

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none p-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-xl bg-white/95 dark:bg-slate-900/95 ${borders[toast.type] || borders.info}`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-grow space-y-0.5 text-left">
              {toast.title && (
                <h5 className="font-heading font-extrabold text-xs tracking-wide text-slate-900 dark:text-white">
                  {toast.title}
                </h5>
              )}
              <p className="text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
