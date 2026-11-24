import React, { useState, useEffect, useMemo } from "react";
import { Sidebar } from "./components/Sidebar";
import { LessonView } from "./components/LessonView";
import { AITutor } from "./components/AITutor";
import { CURRICULUM } from "./data/curriculum";
import { DAY_EXERCISES } from "./data/exercises";
import { Onboarding } from "./components/Onboarding";
import {
  Menu,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "./lib/utils";
import { PYTHON_WISDOM } from "./data/wisdom";

const PROGRESS_KEY = "python30days_progress";
const LAST_DAY_KEY = "python30days_last_day";
const QUIZ_KEY = "python30days_quiz_v1";

function getInitialDay(): number {
  if (typeof window === "undefined") return 1;
  const params = new URLSearchParams(window.location.search);
  const urlDay = Number(params.get("day"));
  if (Number.isInteger(urlDay) && urlDay >= 1 && urlDay <= 30) {
    return urlDay;
  }
  const saved = Number(localStorage.getItem(LAST_DAY_KEY));
  if (Number.isInteger(saved) && saved >= 1 && saved <= 30) {
    return saved;
  }
  return 1;
}

export default function App() {
  const [currentDay, setCurrentDay] = useState<number>(getInitialDay);
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(QUIZ_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [setupGuideOpen, setSetupGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tutorDrawerOpen, setTutorDrawerOpen] = useState(false);
  const [desktopTutorVisible, setDesktopTutorVisible] = useState(true);
  const [externalTutorPrompt, setExternalTutorPrompt] = useState<{
    text: string;
    nonce: number;
  } | null>(null);

  // Persist progress, last day, and URL query sync
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedDays));
    } catch {
      // Ignore storage error
    }
  }, [completedDays]);

  useEffect(() => {
    try {
      localStorage.setItem(LAST_DAY_KEY, String(currentDay));
      const url = new URL(window.location.href);
      url.searchParams.set("day", String(currentDay));
      window.history.replaceState({}, "", url.toString());
    } catch {
      // Ignore history/storage error
    }
  }, [currentDay]);

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_KEY, JSON.stringify(quizAnswers));
    } catch {
      // Ignore storage error
    }
  }, [quizAnswers]);

  // Keyboard navigation Alt+ArrowLeft / Alt+ArrowRight
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentDay((d) => Math.max(1, d - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentDay((d) => Math.min(30, d + 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleToggleComplete = (dayId: number) => {
    setCompletedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId].sort((a, b) => a - b)
    );
  };

  const handleSelectQuizAnswer = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleResetProgress = () => {
    setCompletedDays([]);
    setQuizAnswers({});
    try {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(QUIZ_KEY);
      localStorage.removeItem("python30days_code_v1");
    } catch {
      // Ignore storage error
    }
  };

  const handleAskTutor = (prompt: string) => {
    setExternalTutorPrompt({ text: prompt, nonce: Date.now() });
    if (window.innerWidth < 1280) {
      setTutorDrawerOpen(true);
    } else {
      setDesktopTutorVisible(true);
    }
  };

  const quizCorrectTotal = useMemo(() => {
    let total = 0;
    for (const ex of Object.values(DAY_EXERCISES)) {
      for (const q of ex.quiz) {
        if (quizAnswers[q.id] === q.correctIndex) total++;
      }
    }
    return total;
  }, [quizAnswers]);

  const activeLesson =
    CURRICULUM.find((l) => l.id === currentDay) || CURRICULUM[0];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans flex-col md:flex-row">
      {setupGuideOpen && (
        <Onboarding onClose={() => setSetupGuideOpen(false)} />
      )}

      {/* Mobile Top Header (< 768px) */}
      <header className="md:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 shrink-0 z-40">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open curriculum navigation"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-200 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/icon.svg"
            alt="30 Days of Python logo"
            width={24}
            height={24}
            className="w-6 h-6 rounded-md shrink-0"
          />
          <span className="text-yellow-400 font-mono text-sm font-bold tracking-tight">
            Day {currentDay}
          </span>
          <span className="text-slate-400 font-mono text-xs">/ 30</span>
        </div>

        <button
          type="button"
          onClick={() => setTutorDrawerOpen(true)}
          aria-label="Open Python Tutor"
          className="min-w-[44px] min-h-[44px] px-2.5 flex items-center justify-center gap-1.5 text-sky-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-xs font-semibold"
        >
          <MessageSquare size={18} aria-hidden="true" />
          <span>Tutor</span>
        </button>
      </header>

      {/* Mobile Sidebar Slide-over (< 768px) */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-slate-950/65 transition-opacity md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-[85vw] max-w-xs transform transition-transform duration-200 ease-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar
            currentDay={currentDay}
            setCurrentDay={(day) => {
              setCurrentDay(day);
              setMobileMenuOpen(false);
            }}
            completedDays={completedDays}
            quizCorrectTotal={quizCorrectTotal}
            onOpenSetupGuide={() => {
              setMobileMenuOpen(false);
              setSetupGuideOpen(true);
            }}
            onResetProgress={handleResetProgress}
          />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close curriculum navigation"
            className="absolute top-3.5 right-3.5 min-w-[40px] min-h-[40px] flex items-center justify-center bg-slate-800 text-white rounded-xl border border-slate-700"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Tablet & Desktop Persistent Sidebar (>= 768px) */}
      <div className="hidden md:block shrink-0 h-full">
        <Sidebar
          currentDay={currentDay}
          setCurrentDay={setCurrentDay}
          completedDays={completedDays}
          quizCorrectTotal={quizCorrectTotal}
          onOpenSetupGuide={() => setSetupGuideOpen(true)}
          onResetProgress={handleResetProgress}
        />
      </div>

      {/* Main Content Column */}
      <main className="flex-1 min-w-0 h-full overflow-hidden relative flex flex-col">
        {/* Top Wisdom & Utility Bar (Tablet & Desktop) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 h-12 hidden md:flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles
              size={14}
              className="text-amber-500 shrink-0"
              aria-hidden="true"
            />
            <p className="text-xs text-slate-600 truncate font-medium">
              <span className="font-mono uppercase text-[10px] tracking-wider text-slate-400 mr-1.5">
                Zen
              </span>
              {PYTHON_WISDOM[currentDay % PYTHON_WISDOM.length]}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Tablet Tutor Drawer Trigger (768px - 1279px) */}
            <button
              type="button"
              onClick={() => setTutorDrawerOpen(true)}
              className="xl:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              <MessageSquare size={14} className="text-yellow-400" aria-hidden="true" />
              Python Tutor
            </button>

            {/* Desktop Tutor Toggle (>= 1280px) */}
            <button
              type="button"
              onClick={() => setDesktopTutorVisible((v) => !v)}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/70 border border-slate-200 transition-colors"
              title={desktopTutorVisible ? "Hide Python Tutor" : "Show Python Tutor"}
            >
              {desktopTutorVisible ? (
                <>
                  <PanelRightClose size={14} aria-hidden="true" />
                  Hide Tutor
                </>
              ) : (
                <>
                  <PanelRightOpen size={14} aria-hidden="true" />
                  Show Tutor
                </>
              )}
            </button>
          </div>
        </div>

        <LessonView
          dayId={currentDay}
          isCompleted={completedDays.includes(currentDay)}
          onToggleComplete={handleToggleComplete}
          onSelectDay={setCurrentDay}
          quizAnswers={quizAnswers}
          onSelectQuizAnswer={handleSelectQuizAnswer}
          onAskTutor={handleAskTutor}
        />

        {/* Mobile Bottom Navigation (< 768px) */}
        <div className="md:hidden flex items-center justify-between px-3 py-2 bg-white border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
            disabled={currentDay === 1}
            className="flex items-center gap-1 text-slate-700 disabled:opacity-35 min-h-[44px] px-3 rounded-xl hover:bg-slate-100 font-semibold text-sm"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            Prev
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-1.5 text-blue-700 min-h-[44px] px-3.5 rounded-xl bg-blue-50 font-semibold text-xs uppercase tracking-wider font-mono"
          >
            <BookOpen size={16} aria-hidden="true" />
            30 Days
          </button>

          <button
            type="button"
            onClick={() => setCurrentDay(Math.min(30, currentDay + 1))}
            disabled={currentDay === 30}
            className="flex items-center gap-1 text-slate-700 disabled:opacity-35 min-h-[44px] px-3 rounded-xl hover:bg-slate-100 font-semibold text-sm"
          >
            Next
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </main>

      {/* Mobile & Tablet Tutor Slide-over Drawer (< 1280px) */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-slate-950/60 transition-opacity xl:hidden",
          tutorDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setTutorDrawerOpen(false)}
        aria-hidden={!tutorDrawerOpen}
      >
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-[92vw] sm:w-[390px] transform transition-transform duration-200 ease-out shadow-2xl",
            tutorDrawerOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <AITutor
            lesson={activeLesson}
            externalPrompt={externalTutorPrompt}
            onClose={() => setTutorDrawerOpen(false)}
          />
        </div>
      </div>

      {/* Desktop Docked Python Tutor (>= 1280px) */}
      {desktopTutorVisible && (
        <aside className="hidden xl:block w-[360px] relative z-10 shrink-0 h-full">
          <AITutor
            lesson={activeLesson}
            externalPrompt={externalTutorPrompt}
          />
        </aside>
      )}
    </div>
  );
}
