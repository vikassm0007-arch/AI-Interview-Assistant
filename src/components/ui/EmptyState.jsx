import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, History, UploadCloud, Sparkles } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FileQuestion, 
  title = "No Data Found", 
  description = "Get started by interacting with the app options.", 
  actionLabel, 
  onAction 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-sm"
    >
      <div className="mx-auto h-16 w-16 rounded-2.5xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
        <Icon className="h-8 w-8" />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg">{title}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAction}
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-indigo-600/20 text-xs uppercase tracking-wider font-heading inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" /> {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
