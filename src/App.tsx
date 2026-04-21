import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { LessonView } from "./components/LessonView";
import { AITutor } from "./components/AITutor";
import { CURRICULUM } from "./data/curriculum";
import { Onboarding } from "./components/Onboarding";
import { Menu, MessageSquare, X, ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react";
import { cn } from "./lib/utils";
import { PYTHON_WISDOM } from "./data/wisdom";

export default function App() {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  
  // Mobile UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTutorOpen, setMobileTutorOpen] = useState(false);

  // Load progress and onboarding status from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedProgress = localStorage.getItem("python30days_progress");
    const savedOnboarding = localStorage.getItem("python30days_onboarding_completed");
    
    if (savedProgress) {
      try {
        setCompletedDays(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    
    if (savedOnboarding === "true") {
      setOnboardingCompleted(true);
    }
  }, []);

  // Save progress when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("python30days_progress", JSON.stringify(completedDays));
    }
  }, [completedDays, isClient]);

  const handleCompleteOnboarding = () => {
    setOnboardingCompleted(true);
    localStorage.setItem("python30days_onboarding_completed", "true");
  };

  const handleComplete = (dayId: number) => {
    if (!completedDays.includes(dayId)) {
      setCompletedDays((prev) => [...prev, dayId]);
    }
  };

  const activeLesson = CURRICULUM.find(l => l.id === currentDay) || CURRICULUM[0];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans flex-col md:flex-row">
      {!onboardingCompleted && <Onboarding onComplete={handleCompleteOnboarding} />}
      
      {/* Mobile Top Header */}
      <header className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-50">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-slate-300 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold tracking-tight">Day {currentDay}</span>
          <span className="text-slate-400 text-xs">/ 30</span>
        </div>
        <button 
          onClick={() => setMobileTutorOpen(true)}
          className="p-2 text-blue-400 hover:text-white transition-colors relative"
        >
          <MessageSquare size={24} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        </button>
      </header>

      {/* Desktop Sidebar / Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-[60] bg-black/60 transition-opacity md:hidden",
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setMobileMenuOpen(false)}>
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-80 transform transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )} onClick={e => e.stopPropagation()}>
          <Sidebar 
            currentDay={currentDay} 
            setCurrentDay={(day) => {
              setCurrentDay(day);
              setMobileMenuOpen(false);
            }} 
            completedDays={completedDays} 
          />
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-1.5 bg-slate-800 text-white rounded-lg md:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block shrink-0">
        <Sidebar 
          currentDay={currentDay} 
          setCurrentDay={setCurrentDay} 
          completedDays={completedDays} 
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-hidden relative flex flex-col">
        {/* Top Wisdom Banner (Responsive) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 hidden sm:flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <Sparkles size={14} className="text-yellow-500 shrink-0" />
          <p className="text-[11px] text-slate-500 italic truncate font-medium">
              Wisdom: {PYTHON_WISDOM[currentDay % PYTHON_WISDOM.length]}
          </p>
        </div>

        <LessonView 
            dayId={currentDay} 
            isCompleted={completedDays.includes(currentDay)}
            onComplete={handleComplete}
        />

        {/* Mobile Navigation Controls */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-t border-slate-100 shrink-0">
            <button 
                onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                disabled={currentDay === 1}
                className="flex items-center gap-1 text-slate-500 disabled:opacity-30 p-2"
            >
                <ChevronLeft size={20} />
                <span className="text-sm font-semibold">Prev</span>
            </button>
            
            <button 
                onClick={() => setMobileMenuOpen(true)}
                className="flex flex-col items-center gap-0.5 text-blue-600"
            >
                <BookOpen size={20} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Curriculum</span>
            </button>

            <button 
                onClick={() => setCurrentDay(Math.min(30, currentDay + 1))}
                disabled={currentDay === 30}
                className="flex items-center gap-1 text-slate-500 disabled:opacity-30 p-2"
            >
                <span className="text-sm font-semibold">Next</span>
                <ChevronRight size={20} />
            </button>
        </div>
      </main>

      {/* AI Tutor Sidebar (Desktop) / Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 z-[60] bg-black/60 transition-opacity md:hidden",
        mobileTutorOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setMobileTutorOpen(false)}>
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-[90%] sm:w-96 transform transition-transform duration-300 ease-out",
          mobileTutorOpen ? "translate-x-0" : "translate-x-full"
        )} onClick={e => e.stopPropagation()}>
          <AITutor 
              currentContextContext={activeLesson.content}
              lessonTitle={activeLesson.title}
          />
          <button 
            onClick={() => setMobileTutorOpen(false)}
            className="absolute top-4 right-4 p-1.5 bg-slate-800 text-white rounded-lg z-50"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Desktop AI Tutor */}
      <aside className="hidden md:block w-[350px] lg:w-[400px] shadow-2xl relative z-10 shrink-0">
        <AITutor 
            currentContextContext={activeLesson.content}
            lessonTitle={activeLesson.title}
        />
      </aside>
    </div>
  );
}
