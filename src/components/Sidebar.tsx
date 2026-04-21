import React from 'react';
import { CURRICULUM } from '../data/curriculum';
import { CheckCircle2, Circle, Code2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  completedDays: number[];
}

export function Sidebar({ currentDay, setCurrentDay, completedDays }: SidebarProps) {
  // Calculate progress
  const progress = Math.round((completedDays.length / 30) * 100);

  return (
    <div className="w-full md:w-80 bg-slate-900 md:border-r border-slate-800 flex flex-col h-full text-slate-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-400 p-2 rounded-xl">
            <Code2 size={24} className="text-slate-900" />
          </div>
          <div>
            <h1 className="font-bold text-slate-50 text-xl tracking-tight">30 Days of Python</h1>
            <p className="text-xs text-slate-400 font-medium">Master the basics</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-200">Your Progress</span>
            <span className="text-xs font-mono text-yellow-400">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {CURRICULUM.map((lesson) => {
          const isCompleted = completedDays.includes(lesson.id);
          const isActive = currentDay === lesson.id;
          
          return (
            <button
              key={lesson.id}
              onClick={() => setCurrentDay(lesson.id)}
              className={cn(
                "w-full text-left px-3 py-3 rounded-xl flex items-start gap-3 transition-all duration-200 group relative",
                isActive 
                  ? "bg-blue-600/10 text-slate-50" 
                  : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-r-md" />
              )}
              
              <div className="shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <Circle size={18} className={cn(
                    "text-slate-600",
                    isActive ? "text-blue-500" : "group-hover:text-slate-500"
                  )} />
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <p className={cn(
                  "text-sm font-medium truncate",
                  isActive ? "text-slate-50" : "text-slate-300"
                )}>
                  Day {lesson.id}
                </p>
                <p className="text-xs truncate opacity-70 mt-0.5">
                  {lesson.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
