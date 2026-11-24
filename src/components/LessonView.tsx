import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { CURRICULUM } from "../data/curriculum";
import { DAY_EXERCISES } from "../data/exercises";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "../lib/utils";
import { PracticeLab } from "./PracticeLab";

interface LessonViewProps {
  dayId: number;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
  onSelectDay: (id: number) => void;
  quizAnswers: Record<string, number>;
  onSelectQuizAnswer: (questionId: string, optionIndex: number) => void;
  onAskTutor?: (prompt: string) => void;
}

const STRIPE_COFFEE_URL = "https://buy.stripe.com/3cIfZg27PdKo2D64Ocfw40X";
const SOLANA_TIP_ADDRESS = "GG2eQbVh8ut1BK6j1A2tz7pSySdLpD38BgyEhGcxdXoK";

function CopyableCodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="relative group my-4">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code snippet"
        className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800/90 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
      >
        {copied ? (
          <>
            <Check size={12} className="text-emerald-400" aria-hidden="true" />
            Copied
          </>
        ) : (
          <>
            <Copy size={12} aria-hidden="true" />
            Copy
          </>
        )}
      </button>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}

export function LessonView({
  dayId,
  isCompleted,
  onToggleComplete,
  onSelectDay,
  quizAnswers,
  onSelectQuizAnswer,
  onAskTutor,
}: LessonViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [solCopied, setSolCopied] = useState(false);
  const lesson = CURRICULUM.find((l) => l.id === dayId);
  const exercise = DAY_EXERCISES[dayId];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [dayId]);

  if (!lesson) {
    return <div className="p-8 text-slate-700">Lesson not found.</div>;
  }

  const handleCopySolana = async () => {
    try {
      await navigator.clipboard.writeText(SOLANA_TIP_ADDRESS);
      setSolCopied(true);
      setTimeout(() => setSolCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 h-full overflow-y-auto bg-white custom-scrollbar focus:outline-none"
    >
      <article className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {/* Breadcrumb / Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-5">
          {exercise && (
            <span className="font-mono uppercase tracking-wider text-[11px] text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
              {exercise.phase}
            </span>
          )}
          <ChevronRight size={14} className="text-slate-400" aria-hidden="true" />
          <span className="font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md">
            Day {lesson.id} / 30
          </span>
          {exercise && (
            <span className="inline-flex items-center gap-1 text-slate-500 px-1.5 py-1">
              <Clock size={13} aria-hidden="true" />
              {exercise.estimatedMinutes} min
            </span>
          )}
          <a
            href={`#practice-lab-day-${lesson.id}`}
            className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-md transition-colors ml-auto"
          >
            Jump to Lab ↓
          </a>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-semibold">
              <CheckCircle2 size={13} aria-hidden="true" />
              Completed
            </span>
          )}
        </div>

        {/* Title Block */}
        <header className="mb-8 pl-4 sm:pl-5 border-l-4 border-yellow-400">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-950 mb-2">
            {lesson.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[60ch]">
            {lesson.summary}
          </p>
          {exercise && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {exercise.concepts.map((concept) => (
                <span
                  key={concept}
                  className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80"
                >
                  {concept}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Lesson Markdown Content */}
        <div className="markdown-body mb-10 overflow-x-hidden">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-2 text-slate-900 tracking-tight border-0 pb-0">
                  {children}
                </h2>
              ),
              pre: ({ children }) => <CopyableCodeBlock>{children}</CopyableCodeBlock>,
            }}
          >
            {lesson.content}
          </ReactMarkdown>
        </div>

        {/* Interactive Python Practice Lab & Quiz */}
        <div id={`practice-lab-day-${lesson.id}`}>
          <PracticeLab
            dayId={lesson.id}
            quizAnswers={quizAnswers}
            onSelectQuizAnswer={onSelectQuizAnswer}
            onAskTutor={onAskTutor}
          />
        </div>

        {/* Completion & Navigation Action Card */}
        <div className="border border-slate-200 bg-slate-50 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-0.5">
              {isCompleted ? `Day ${lesson.id} complete` : "Ready to move on?"}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              {isCompleted
                ? "Progress is saved locally in your browser. Continue to the next day whenever ready."
                : "Mark this day complete to update your 30-day progress bar."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onToggleComplete(lesson.id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-all",
                isCompleted
                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              )}
            >
              {isCompleted ? (
                <>
                  <Check size={17} aria-hidden="true" />
                  Completed
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  Mark Complete
                </>
              )}
            </button>

            {lesson.id < 30 && (
              <button
                type="button"
                onClick={() => onSelectDay(lesson.id + 1)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Day {lesson.id + 1}
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Previous / Next Row */}
        <nav
          aria-label="Lesson pagination"
          className="hidden md:flex items-center justify-between border-t border-slate-200 pt-5 mb-8"
        >
          <button
            type="button"
            onClick={() => onSelectDay(Math.max(1, lesson.id - 1))}
            disabled={lesson.id === 1}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            {lesson.id > 1 ? `Day ${lesson.id - 1}` : "Previous"}
          </button>

          <span className="text-xs font-mono text-slate-400">
            Tip: Alt + ← / → to switch days
          </span>

          <button
            type="button"
            onClick={() => onSelectDay(Math.min(30, lesson.id + 1))}
            disabled={lesson.id === 30}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:pointer-events-none transition-colors"
          >
            {lesson.id < 30 ? `Day ${lesson.id + 1}` : "Next"}
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </nav>

        {/* Clean Open-Access Attribution & Optional Support Footer */}
        <footer className="border-t border-slate-200 pt-6 pb-4 text-xs text-slate-500 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium text-slate-600">
              Engineered by Neal Frazier Tech (
              <a
                href="https://github.com/1nc0gn30/30-Days-Of-Python"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 hover:text-blue-700 underline underline-offset-2"
              >
                @1nc0gn30
              </a>
              ) •{" "}
              <a
                href="https://nullai.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-800 hover:text-blue-700 underline underline-offset-2"
              >
                NullAI Platform
              </a>
            </p>
            <span className="font-mono text-[11px] text-slate-500">
              100% Free &amp; Open Access
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={STRIPE_COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold transition-colors"
            >
              <Coffee size={13} aria-hidden="true" />
              Buy Us a Coffee
              <ExternalLink size={11} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={handleCopySolana}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 font-mono text-[11px] transition-colors"
              title={`Copy Solana tip address: ${SOLANA_TIP_ADDRESS}`}
            >
              {solCopied ? (
                <>
                  <Check size={12} className="text-emerald-600" aria-hidden="true" />
                  Solana Address Copied
                </>
              ) : (
                <>
                  <Copy size={12} aria-hidden="true" />
                  SOL Tip: {SOLANA_TIP_ADDRESS.slice(0, 6)}…{SOLANA_TIP_ADDRESS.slice(-4)}
                </>
              )}
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}
