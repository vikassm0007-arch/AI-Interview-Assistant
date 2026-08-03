import React, { useState } from 'react';
import { AreaChart, BarChart3, TrendingUp, Info } from 'lucide-react';

export default function ProgressChart({ chartData, barData }) {
  const [activePoint, setActivePoint] = useState(null);

  // SVG Area Line Chart Dimension Settings
  const width = 500;
  const height = 200;
  const paddingX = 35;
  const paddingY = 20;

  const dataLength = chartData.length;

  // Helper to map coordinates
  const getX = (index) => {
    if (dataLength <= 1) return width / 2;
    return paddingX + (index * (width - paddingX * 2)) / (dataLength - 1);
  };

  const getY = (score) => {
    return height - paddingY - (score * (height - paddingY * 2)) / 100;
  };

  // Compile Path strings
  const getPathD = (key) => {
    if (dataLength === 0) return '';
    return chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`).join(' ');
  };

  // Compile Area strings (closed path down to Y=0 line)
  const getAreaD = (key) => {
    if (dataLength === 0) return '';
    const linePath = getPathD(key);
    const bottomY = height - paddingY;
    const startX = getX(0);
    const endX = getX(dataLength - 1);
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 text-left">
      
      {/* 1. Area Line Chart: Trend Over Time */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <h5 className="font-heading font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AreaChart className="h-4.5 w-4.5 text-indigo-500" /> Score Progression Trends
            </h5>
            <div className="flex gap-2.5 text-[9px] font-extrabold uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Overall</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Tech</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Comm</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1.5">Hover on dots to review details</p>
        </div>

        {/* Responsive Area SVG */}
        <div className="relative w-full aspect-video min-h-[160px] select-none mt-2">
          {dataLength > 0 ? (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[25, 50, 75, 100].map((val) => (
                <g key={val}>
                  <line 
                    x1={paddingX} 
                    y1={getY(val)} 
                    x2={width - paddingX} 
                    y2={getY(val)} 
                    stroke="currentColor" 
                    className="text-slate-100 dark:text-slate-850" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={paddingX - 10} 
                    y={getY(val) + 3} 
                    fill="currentColor" 
                    className="text-slate-400 font-mono text-[9px] font-bold text-right"
                    textAnchor="end"
                  >
                    {val}%
                  </text>
                </g>
              ))}

              {/* Area fill */}
              <path d={getAreaD('overall')} fill="url(#overallGrad)" />

              {/* Trend Lines */}
              <path d={getPathD('overall')} fill="none" stroke="#6366F1" strokeWidth="2.5" />
              <path d={getPathD('technical')} fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d={getPathD('communication')} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Interactive Dot Node loops */}
              {chartData.map((d, i) => (
                <circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(d.overall)}
                  r={activePoint?.index === i ? "6" : "4"}
                  fill="#6366F1"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all hover:scale-125"
                  onMouseEnter={() => setActivePoint({ index: i, data: d })}
                  onMouseLeave={() => setActivePoint(null)}
                />
              ))}
            </svg>
          ) : (
            <p className="text-xs text-slate-400 italic text-center pt-8">No historical data coordinates found.</p>
          )}

          {/* Hover popup Tooltip */}
          {activePoint && (
            <div className="absolute top-2 left-10 right-10 bg-slate-950 text-white p-3 rounded-2xl text-[10px] space-y-1 z-10 border border-slate-800 shadow-xl animate-fade-in font-semibold">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                <span className="font-bold text-slate-200">{activePoint.data.title}</span>
                <span className="text-slate-400 font-mono">{activePoint.data.date}</span>
              </div>
              <p className="flex justify-between mt-1"><span>Overall Composite:</span> <span className="text-indigo-400 font-bold font-mono">{activePoint.data.overall}%</span></p>
              <p className="flex justify-between text-slate-350"><span>Technical Skills:</span> <span className="text-emerald-400 font-bold font-mono">{activePoint.data.technical}%</span></p>
              <p className="flex justify-between text-slate-350"><span>Communication Style:</span> <span className="text-amber-400 font-bold font-mono">{activePoint.data.communication}%</span></p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Bar Chart: Previous Scores comparison by domain */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850">
            <h5 className="font-heading font-extrabold text-slate-800 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="h-4.5 w-4.5 text-indigo-500" /> Domain Competencies
            </h5>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> Target Hire Bar: 80%
            </span>
          </div>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="w-full aspect-video min-h-[160px] select-none mt-2 relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid baseline benchmarks */}
            <line 
              x1={paddingX} 
              y1={getY(80)} 
              x2={width - paddingX} 
              y2={getY(80)} 
              stroke="#EF4444" 
              strokeWidth="1.5" 
              strokeDasharray="4 2"
              className="opacity-70"
            />
            <text 
              x={width - paddingX + 5} 
              y={getY(80) + 3} 
              fill="#EF4444" 
              className="font-mono text-[8px] font-bold text-left uppercase"
            >
              Hire Bar (80%)
            </text>

            {/* Render Columns */}
            {barData.map((d, i) => {
              const colWidth = 32;
              const colSpacing = (width - paddingX * 2) / barData.length;
              const xPos = paddingX + (i * colSpacing) + (colSpacing - colWidth) / 2;
              const barHeight = (d.score * (height - paddingY * 2)) / 100;
              const yPos = height - paddingY - barHeight;

              return (
                <g key={i} className="group">
                  {/* Backdrop column */}
                  <rect
                    x={xPos}
                    y={paddingY}
                    width={colWidth}
                    height={height - paddingY * 2}
                    fill="currentColor"
                    className="text-slate-50/20 dark:text-slate-950/20"
                    rx="6"
                  />

                  {/* Filled column */}
                  <rect
                    x={xPos}
                    y={yPos}
                    width={colWidth}
                    height={barHeight}
                    fill={d.score >= 80 ? '#10B981' : d.score >= 70 ? '#F59E0B' : '#EF4444'}
                    rx="6"
                    className="transition-all duration-300 group-hover:opacity-90"
                  />

                  {/* Score Label inside column top */}
                  <text
                    x={xPos + colWidth / 2}
                    y={yPos - 6}
                    fill="currentColor"
                    className="text-slate-800 dark:text-slate-205 font-mono text-[9px] font-bold text-center"
                    textAnchor="middle"
                  >
                    {d.score}%
                  </text>

                  {/* Domain tag label underneath */}
                  <text
                    x={xPos + colWidth / 2}
                    y={height - paddingY + 12}
                    fill="currentColor"
                    className="text-slate-455 font-bold text-[8px] sm:text-[9px] text-center"
                    textAnchor="middle"
                  >
                    {d.domain}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

    </div>
  );
}
