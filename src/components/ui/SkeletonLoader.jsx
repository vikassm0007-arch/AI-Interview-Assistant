import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonBox({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800/80 rounded-xl animate-pulse ${height} ${width} ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-3xl space-y-4 text-left">
      <div className="flex justify-between items-center">
        <SkeletonBox height="h-4" width="w-1/3" />
        <SkeletonBox height="h-6" width="w-12" className="rounded-lg" />
      </div>
      <SkeletonBox height="h-10" width="w-full" className="rounded-2xl" />
      <div className="flex gap-4 pt-2">
        <SkeletonBox height="h-3" width="w-20" />
        <SkeletonBox height="h-3" width="w-24" />
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="grid md:grid-cols-3 gap-8 items-start animate-fade-in text-left">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 text-center">
        <SkeletonBox height="h-24" width="w-24" className="rounded-full mx-auto" />
        <SkeletonBox height="h-5" width="w-32" className="mx-auto" />
        <SkeletonBox height="h-3" width="w-44" className="mx-auto" />
        <SkeletonBox height="h-12" width="w-full" className="rounded-2xl" />
      </div>
      <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <SkeletonBox height="h-10" width="w-full" className="rounded-xl" />
          <SkeletonBox height="h-10" width="w-full" className="rounded-xl" />
        </div>
        <SkeletonBox height="h-20" width="w-full" className="rounded-2xl" />
        <SkeletonBox height="h-12" width="w-full" className="rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 text-left">
      <div className="flex justify-between items-center">
        <SkeletonBox height="h-5" width="w-40" />
        <SkeletonBox height="h-4" width="w-24" />
      </div>
      <SkeletonBox height="h-48" width="w-full" className="rounded-2xl" />
    </div>
  );
}
