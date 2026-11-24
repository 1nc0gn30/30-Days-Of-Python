import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  Lightbulb,
  HelpCircle,
  Sparkles,
  Code2,
} from "lucide-react";
import { DAY_EXERCISES } from "../data/exercises";
import { runPythonCode, type SandboxResult } from "../lib/pythonSandbox";
import { cn } from "../lib/utils";

interface PracticeLabProps {
  dayId: number;
  quizAnswers: Record<string, number>;
  onSelectQuizAnswer: (questionId: string, optionIndex: number) => void;
  onAskTutor?: (prompt: string) => void;
}

const CODE_STORAGE_KEY = "python30days_code_v1";

function loadSavedCodeMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CODE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function PracticeLab({
  dayId,
  quizAnswers,
  onSelectQuizAnswer,
  onAskTutor,
}: PracticeLabProps) {
  const exercise = DAY_EXERCISES[dayId];
  const [code, setCode] = useState<string>(exercise?.starterCode ?? "");
  const [result, setResult] = useState<SandboxResult | null>(null);
  const [checkStatus, setCheckStatus] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!exercise) return;
    const map = loadSavedCodeMap();
    const initial = map[String(dayId)] ?? exercise.starterCode;
    setCode(initial);
    setResult(null);
    setCheckStatus(null);
  }, [dayId, exercise]);

  if (!exercise) return null;

  const updateCode = (next: string) => {
    setCode(next);
    setCheckStatus(null);
    try {
      const map = loadSavedCodeMap();
      map[String(dayId)] = next;
      localStorage.setItem(CODE_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleRun = () => {
    const res = runPythonCode(code);
    setResult(res);
    return res;
  };

  const handleCheck = () => {
    const res = handleRun();
    if (!res.ok) {
      setCheckStatus({
        passed: false,
        message: `Fix the error first: ${res.error}`,
      });
      return;
    }

    const { requireOutputLines, codeMustInclude, outputMustInclude } =
      exercise.validation;

    if (requireOutputLines && res.stdout.length < requireOutputLines) {
      setCheckStatus({
        passed: false,
        message: `Expected at least ${requireOutputLines} output line(s), got ${res.stdout.length}. Hint: ${exercise.checkHint}`,
      });
      return;
    }

    if (codeMustInclude) {
      const missing = codeMustInclude.filter((token) => !code.includes(token));
      if (missing.length > 0) {
        setCheckStatus({
          passed: false,
          message: `Try using ${missing.map((m) => `\`${m.trim()}\``).join(", ")} in your solution. Hint: ${exercise.checkHint}`,
        });
        return;
      }
    }

    if (outputMustInclude) {
      const joined = res.stdout.join("\n").toLowerCase();
      const missingOut = outputMustInclude.filter(
        (token) => !joined.includes(token.toLowerCase())
      );
      if (missingOut.length > 0) {
        setCheckStatus({
          passed: false,
          message: `Output should include "${missingOut[0]}". Hint: ${exercise.checkHint}`,
        });
        return;
      }
    }

    setCheckStatus({
      passed: true,
      message: `Task verified! Your Day ${dayId} code ran cleanly in ${res.durationMs}ms.`,
    });
  };

  const handleReset = () => {
    updateCode(exercise.starterCode);
    setResult(null);
    setCheckStatus(null);
  };

  const handleLoadSolution = () => {
    updateCode(exercise.solutionCode);
    const res = runPythonCode(exercise.solutionCode);
    setResult(res);
    setCheckStatus(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const next = code.slice(0, start) + "    " + code.slice(end);
      updateCode(next);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const correctCount = exercise.quiz.filter(
    (q) => quizAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <section
      aria-label={`Day ${dayId} Practice Lab and Quiz`}
      className="space-y-8 mb-10"
    >
      {/* Interactive Python Practice Sandbox */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-slate-100 px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center shrink-0">
              <Terminal size={16} className="text-yellow-400" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                In-Browser Python Lab · Day {dayId}
              </h2>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                Runs locally · Ctrl+Enter to execute
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <RotateCcw size={13} aria-hidden="true" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleLoadSolution}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <Lightbulb size={13} className="text-yellow-400" aria-hidden="true" />
              Solution
            </button>
            <button
              type="button"
              onClick={handleCheck}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[36px] rounded-lg text-xs font-semibold text-slate-900 bg-yellow-400 hover:bg-yellow-300 transition-colors"
            >
              <CheckCircle2 size={14} aria-hidden="true" />
              Check Task
            </button>
            <button
              type="button"
              onClick={handleRun}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[36px] rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              <Play size={13} aria-hidden="true" />
              Run
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-2 flex-wrap">
          <span>
            <strong className="text-slate-800">Goal:</strong> {exercise.checkHint}
          </span>
          {onAskTutor && (
            <button
              type="button"
              onClick={() =>
                onAskTutor(
                  result?.error
                    ? `Help me fix this error on Day ${dayId}: ${result.error}`
                    : `Give me a hint for today's task on Day ${dayId}`
                )
              }
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-semibold shrink-0"
            >
              <Sparkles size={12} aria-hidden="true" />
              Ask Tutor
            </button>
          )}
        </div>

        {/* Code Editor */}
        <div className="bg-slate-950 p-3 sm:p-4">
          <label htmlFor={`python-editor-day-${dayId}`} className="sr-only">
            Python code editor for Day {dayId}
          </label>
          <textarea
            id={`python-editor-day-${dayId}`}
            value={code}
            onChange={(e) => updateCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={Math.min(14, Math.max(6, code.split("\n").length + 1))}
            className="w-full bg-transparent text-slate-100 font-mono text-[13px] leading-6 resize-y focus:outline-none placeholder:text-slate-500"
            placeholder="# Write Python code here and click Run..."
          />
        </div>

        {/* Output Terminal */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-5 py-3.5 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="uppercase tracking-widest text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Code2 size={12} className="text-sky-400" aria-hidden="true" />
              Output
            </span>
            {result && (
              <span
                className={cn(
                  "text-[11px] font-medium",
                  result.ok ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {result.ok ? `Exited 0 · ${result.durationMs}ms` : "Execution Error"}
              </span>
            )}
          </div>

          {!result ? (
            <p className="text-slate-400 text-xs">
              Click <span className="text-slate-200 font-semibold">Run</span> to execute your snippet right in the browser.
            </p>
          ) : (
            <div className="space-y-2">
              {result.stdout.length > 0 && (
                <pre className="text-emerald-300 whitespace-pre-wrap break-words leading-relaxed m-0">
                  {result.stdout.join("\n")}
                </pre>
              )}
              {result.ok && result.stdout.length === 0 && (
                <p className="text-slate-400 italic">
                  Program finished with no printed output. Add a print() statement to display values.
                </p>
              )}
              {result.error && (
                <div className="rounded-lg bg-rose-950/60 border border-rose-500/40 px-3 py-2 text-rose-200">
                  {result.errorLine ? `Line ${result.errorLine} · ` : ""}
                  {result.error}
                </div>
              )}
              {result.ok && Object.keys(result.variables).length > 0 && (
                <div className="pt-2 mt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                  {Object.entries(result.variables)
                    .slice(0, 6)
                    .map(([k, v]) => (
                      <span
                        key={k}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] max-w-full truncate"
                      >
                        <span className="text-sky-300">{k}</span>
                        <span className="text-slate-500">=</span>
                        <span className="text-amber-300 truncate max-w-[160px]">{v}</span>
                      </span>
                    ))}
                </div>
              )}
            </div>
          )}

          {checkStatus && (
            <div
              className={cn(
                "mt-3 rounded-xl px-3.5 py-2.5 font-sans text-xs font-medium flex items-start gap-2 border",
                checkStatus.passed
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                  : "bg-amber-950/60 border-amber-500/40 text-amber-200"
              )}
            >
              {checkStatus.passed ? (
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <XCircle size={15} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <span>{checkStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Knowledge Check Quiz */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-600" aria-hidden="true" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Knowledge Check
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
            {correctCount} / {exercise.quiz.length} Correct
          </span>
        </div>

        <div className="space-y-5">
          {exercise.quiz.map((q, qIdx) => {
            const selected = quizAnswers[q.id];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correctIndex;

            return (
              <div
                key={q.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs"
              >
                <p className="text-sm font-semibold text-slate-900 mb-3">
                  <span className="font-mono text-xs text-slate-500 mr-2">
                    Q{qIdx + 1}.
                  </span>
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const chosen = selected === optIdx;
                    const rightOpt = optIdx === q.correctIndex;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => onSelectQuizAnswer(q.id, optIdx)}
                        className={cn(
                          "text-left px-3.5 py-2.5 min-h-[44px] rounded-xl border text-xs sm:text-[13px] font-medium transition-all flex items-center gap-2",
                          !isAnswered &&
                            "border-slate-200 bg-slate-50/60 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50",
                          isAnswered &&
                            rightOpt &&
                            "border-emerald-500 bg-emerald-50 text-emerald-900",
                          isAnswered &&
                            chosen &&
                            !rightOpt &&
                            "border-rose-400 bg-rose-50 text-rose-900",
                          isAnswered &&
                            !chosen &&
                            !rightOpt &&
                            "border-slate-200 bg-white text-slate-500"
                        )}
                      >
                        <span className="font-mono text-[11px] font-bold shrink-0 w-5 h-5 rounded-md bg-white/80 border border-current/20 flex items-center justify-center">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <p
                    className={cn(
                      "mt-3 text-xs leading-relaxed rounded-lg px-3 py-2 border",
                      isCorrect
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                        : "bg-amber-50/80 border-amber-200 text-amber-950"
                    )}
                  >
                    <strong>{isCorrect ? "Correct:" : "Not quite:"}</strong>{" "}
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
