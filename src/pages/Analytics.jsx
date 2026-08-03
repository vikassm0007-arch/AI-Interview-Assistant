import React, { useState } from 'react';
import { getAggregatedAnalytics } from '../services/analyticsService';
import OverviewCards from '../components/analytics/OverviewCards';
import ProgressChart from '../components/analytics/ProgressChart';
import SkillBreakdown from '../components/analytics/SkillBreakdown';
import SuggestionsEngine from '../components/analytics/SuggestionsEngine';
import { Sparkles, Calendar, Layers } from 'lucide-react';

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  const metrics = getAggregatedAnalytics(timeFilter, modeFilter);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 text-left animate-fade-in">
      
      {/* Title & Filter Options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-indigo-50 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-850/60 font-bold px-3.5 py-1 rounded-full text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
            <Sparkles className="h-3 w-3 fill-current" /> Performance Insights
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-slate-905 dark:text-white tracking-tight mt-2">Analytics & Progress</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
            Target Role: Senior Full-Stack / SDE-2 Candidate
          </p>
        </div>

        {/* Action filter bars */}
        <div className="flex flex-wrap gap-3.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-3 rounded-2.5xl shadow-xs text-xs font-bold font-sans">
          {/* Time range */}
          <div className="flex items-center gap-2 border-r border-slate-100 dark:border-slate-850 pr-3.5">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-250 focus:outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>

          {/* Mode tracks */}
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-250 focus:outline-none cursor-pointer"
            >
              <option value="all">All Sessions</option>
              <option value="TECHNICAL">Technical Only</option>
              <option value="HR">HR Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 1. Overview KPIs Header */}
      <OverviewCards metrics={metrics} />

      {/* 2. Responsive Line Area & Domain Bar Charts */}
      <ProgressChart chartData={metrics.lineChartData} barData={metrics.barChartData} />

      {/* 3. Strengths vs Gaps Sliders */}
      <SkillBreakdown strongAreas={metrics.strongAreas} weakAreas={metrics.weakAreas} />

      {/* 4. suggestions roadmap & goals */}
      <SuggestionsEngine suggestions={metrics.suggestions} averageScore={metrics.averageScore} />

    </div>
  );
}
