import React, { useMemo, useState } from "react";
import { CURRICULUM } from "../data/curriculum";
import { DAY_EXERCISES, type CurriculumPhase } from "../data/exercises";
import {
  CheckCircle2,
  Circle,
  Search,
  Terminal,
  RotateCcw,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  completedDays: number[];
  quizCorrectTotal: number;
  onOpenSetupGuide: () => void;
  onResetProgress: () => void;
}

type StatusFilter = "all" | "todo" | "done";

const PHASE_ORDER: CurriculumPhase[] = [
  "Week 1 · Foundations",
  "Week 2 · Data & Functions",
  "Week 3 · Modules & OOP",
  "Week 4 · Modern Python & Capstone",
];

export function Sidebar({
  currentDay,
  setCurrentDay,
  completedDays,
  quizCorrectTotal,
  onOpenSetupGuide,
  onResetProgress,
}: SidebarProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [confirmReset, setConfirmReset] = useState(false);

  const progress = Math.round((completedDays.length / CURRICULUM.length) * 100);

  const filteredLessons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CURRICULUM.filter((lesson) => {
      const done = completedDays.includes(lesson.id);
      if (filter === "done" && !done) return false;
      if (filter === "todo" && done) return false;
      if (!q) return true;
      const ex = DAY_EXERCISES[lesson.id];
      const haystack = [
        `day ${lesson.id}`,
        lesson.title,
        lesson.summary,
        ...(ex?.concepts ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, filter, completedDays]);

  const groupedByPhase = useMemo(() => {
    return PHASE_ORDER.map((phase) => ({
      phase,
      items: filteredLessons.filter((l) => DAY_EXERCISES[l.id]?.phase === phase),
    })).filter((group) => group.items.length > 0);
  }, [filteredLessons]);

  return (
    <nav
      aria-label="30-Day Python Curriculum"
      className="w-full md:w-72 bg-slate-900 md:border-r border-slate-800 flex flex-col h-full text-slate-300 select-none"
    >
      {/* Brand & Progress Header */}
      <div className="p-4 border-b border-slate-800 shrink-0 space-y-4">
        <div className="flex items-center gap-3 pr-8 md:pr-0">
          <img
            src="/icon.svg"
            alt="30 Days of Python terminal emblem"
            width={36}
            height={36}
            className="w-9 h-9 rounded-xl shrink-0 border border-slate-700"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-50 text-base tracking-tight truncate">
                30 Days of Python
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/15 text-yellow-300 border border-yellow-400/30 shrink-0">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Open-Access Interactive Course
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs font-semibold text-slate-200">
              {completedDays.length}/30 Days · {quizCorrectTotal}/60 Quiz
            </span>
            <span className="text-xs font-mono font-semibold text-yellow-400">
              {progress}%
            </span>
          </div>
          <div
            className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Course completion percentage"
          >
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search days, topics, syntax..."
              aria-label="Search 30 days of Python lessons"
              className="w-full pl-8 pr-8 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
              >
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-950/70 border border-slate-800">
            {(["all", "todo", "done"] as StatusFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={cn(
                  "py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-colors",
                  filter === key
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {key === "all"
                  ? "All (30)"
                  : key === "todo"
                  ? `Todo (${30 - completedDays.length})`
                  : `Done (${completedDays.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum List */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4 custom-scrollbar">
        {groupedByPhase.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-slate-400 mb-2">
              No lessons match "{query || filter}".
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
            >
              Show all 30 days
            </button>
          </div>
        ) : (
          groupedByPhase.map(({ phase, items }) => (
            <div key={phase} className="space-y-1">
              <p className="px-2.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                {phase}
              </p>
              {items.map((lesson) => {
                const isCompleted = completedDays.includes(lesson.id);
                const isActive = currentDay === lesson.id;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setCurrentDay(lesson.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "w-full text-left px-2.5 py-2.5 rounded-xl flex items-start gap-2.5 transition-all duration-150 group relative",
                      isActive
                        ? "bg-blue-600/15 text-slate-50 ring-1 ring-blue-500/30"
                        : "hover:bg-slate-800/60 text-slate-300 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-y-1.5 left-0 w-1 bg-yellow-400 rounded-r-full" />
                    )}

                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2
                          size={16}
                          className="text-emerald-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          size={16}
                          className={cn(
                            isActive
                              ? "text-yellow-400"
                              : "text-slate-600 group-hover:text-slate-400"
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-slate-400">
                        Day {String(lesson.id).padStart(2, "0")}
                      </p>
                      <p
                        className={cn(
                          "text-[13px] font-medium truncate leading-snug",
                          isActive ? "text-white" : "text-slate-200"
                        )}
                      >
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Bottom Utility Actions */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSetupGuide}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors"
          >
            <Terminal size={14} className="text-yellow-400" aria-hidden="true" />
            Local Setup
          </button>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              aria-label="Reset learning progress"
              className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[40px] rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Reset saved progress"
            >
              <RotateCcw size={14} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              onBlur={() => setConfirmReset(false)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >
              Confirm Reset
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
