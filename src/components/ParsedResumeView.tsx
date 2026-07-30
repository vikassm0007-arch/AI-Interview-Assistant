import React from 'react';
import { FileText, GraduationCap, Briefcase, Sparkles, Star } from 'lucide-react';
import { ParsedResume } from '../../server/services/resumeParser'; // Importing type check reference

interface ParsedResumeViewProps {
  data: ParsedResume;
}

export default function ParsedResumeView({ data }: ParsedResumeViewProps) {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Header Profile Summary */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 border border-indigo-500/15 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-md shadow-indigo-650/15">
            {data.candidateName.split(' ').map(n => n[0]).join('') || 'C'}
          </div>
          <div>
            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{data.candidateName}</h3>
            <p className="text-xs text-slate-455 dark:text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Extracted Candidate Profile
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Side: Skills Badge Board (2/3) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-5">
            <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-indigo-500 fill-current" /> Categorized Skills Board
            </h4>

            <div className="space-y-4">
              {data.skills.map((skillGroup, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">{skillGroup.category}</p>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 font-bold px-3 py-1 rounded-xl text-xs select-none hover:scale-105 active:scale-95 transition-transform"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-5">
            <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-500" /> Professional Experience
            </h4>

            <div className="relative border-l border-slate-100 dark:border-slate-800 ml-3.5 space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-7 group">
                  {/* Timeline Dot Indicator */}
                  <span className="absolute left-[-5.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-slate-800 group-hover:bg-indigo-600 transition-colors" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start flex-col sm:flex-row gap-0.5">
                      <div>
                        <h5 className="text-sm sm:text-base font-extrabold text-slate-850 dark:text-white">{exp.role}</h5>
                        <p className="text-xs text-indigo-650 dark:text-indigo-400 font-bold mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{exp.duration}</span>
                    </div>

                    <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {exp.highlights.map((highlight, hIdx) => (
                        <li key={hIdx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Education History (1/3) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl space-y-5">
          <h4 className="font-heading font-extrabold text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-500" /> Academic Timeline
          </h4>

          <div className="space-y-4">
            {data.education.map((edu, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 p-4 rounded-2.5xl space-y-2"
              >
                <div>
                  <h5 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">{edu.degree}</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-405 font-bold mt-0.5">{edu.institution}</p>
                </div>
                <div className="flex justify-between text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <span>Graduated {edu.year}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
