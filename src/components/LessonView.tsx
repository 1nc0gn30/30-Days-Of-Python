import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CURRICULUM } from '../data/curriculum';
import { Check, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LessonViewProps {
  dayId: number;
  isCompleted: boolean;
  onComplete: (id: number) => void;
}

export function LessonView({ dayId, isCompleted, onComplete }: LessonViewProps) {
  const lesson = CURRICULUM.find(l => l.id === dayId);

  if (!lesson) {
    return <div className="p-8">Lesson not found.</div>;
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-white custom-scrollbar focus:outline-none">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Breadcrumb / Status */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 mb-6 sm:mb-8">
          <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">Course</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span>Day {lesson.id}</span>
          {isCompleted && (
             <>
              <ChevronRight size={14} className="text-slate-400" />
              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2py-1 rounded-md">
                <CheckCircle2 size={14} />
                Completed
              </span>
             </>
          )}
        </div>
        
        {/* Title Block */}
        <div className="mb-8 sm:mb-10 pl-4 sm:pl-6 border-l-4 border-yellow-400">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-2 sm:mb-3">{lesson.title}</h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">{lesson.summary}</p>
        </div>

        {/* Content */}
        <div className="markdown-body mb-8 sm:mb-12 overflow-x-hidden">
          <ReactMarkdown>
            {lesson.content}
          </ReactMarkdown>
        </div>

        {/* Completion Action */}
        <div className="border border-slate-200 bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
            <div className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">Ready to move on?</h3>
                <p className="text-slate-600 text-xs sm:text-sm">Mark this day as complete and track your progress.</p>
            </div>
            <button
                onClick={() => onComplete(lesson.id)}
                disabled={isCompleted}
                className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm",
                    isCompleted 
                      ? "bg-emerald-100 text-emerald-700 cursor-not-allowed" 
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow shadow-blue-500/20 active:scale-95"
                )}
            >
                {isCompleted ? (
                    <>
                        <Check size={20} />
                        Completed
                    </>
                ) : (
                    <>
                        <CheckCircle2 size={20} />
                        Mark Complete
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}
