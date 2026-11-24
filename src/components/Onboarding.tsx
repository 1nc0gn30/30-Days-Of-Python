import React, { useEffect, useState } from "react";
import { Terminal, X, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

type OS = "windows" | "macos" | "linux";

interface OnboardingProps {
  onClose: () => void;
}

const OS_GUIDE: Record<
  OS,
  {
    label: string;
    terminalSteps: string[];
    pythonSteps: string[];
    verifyCmd: string;
  }
> = {
  windows: {
    label: "Windows",
    terminalSteps: [
      "Open Start Menu and search for Windows Terminal or PowerShell.",
      "Or press Win + R, type cmd, and press Enter.",
    ],
    pythonSteps: [
      "Install Python 3 from python.org/downloads (or run: winget install Python.Python.3.12).",
      'Check "Add Python to PATH" in the installer before clicking Install.',
    ],
    verifyCmd: "python --version",
  },
  macos: {
    label: "macOS",
    terminalSteps: [
      "Press Cmd + Space to open Spotlight.",
      'Type "Terminal" and press Enter.',
    ],
    pythonSteps: [
      "Install with Homebrew: brew install python",
      "Or download the universal macOS installer from python.org/downloads.",
    ],
    verifyCmd: "python3 --version",
  },
  linux: {
    label: "Linux",
    terminalSteps: [
      "Press Ctrl + Alt + T or launch your distribution's Terminal app.",
    ],
    pythonSteps: [
      "Ubuntu / Debian: sudo apt update && sudo apt install python3 python3-venv",
      "Fedora: sudo dnf install python3  |  Arch: sudo pacman -S python",
    ],
    verifyCmd: "python3 --version",
  },
};

export function Onboarding({ onClose }: OnboardingProps) {
  const [os, setOs] = useState<OS>("linux");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const guide = OS_GUIDE[os];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-guide-title"
      className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center">
              <Terminal size={17} aria-hidden="true" />
            </div>
            <div>
              <h2 id="setup-guide-title" className="text-base font-bold leading-tight">
                Local Python 3 Setup Guide
              </h2>
              <p className="text-[11px] text-slate-300">
                Optional — you can also run exercises directly in the in-browser lab.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close setup guide"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* OS Switcher */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(["windows", "macos", "linux"] as OS[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setOs(item)}
                className={cn(
                  "py-2 min-h-[40px] rounded-lg text-xs font-bold transition-colors",
                  os === item
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {OS_GUIDE[item].label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500">
              1. Open your terminal
            </h3>
            <ul className="space-y-2">
              {guide.terminalSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700"
                >
                  <span className="font-mono font-bold text-blue-700">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500">
              2. Install Python 3
            </h3>
            <ul className="space-y-2">
              {guide.pythonSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700"
                >
                  <span className="font-mono font-bold text-emerald-700">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-950 text-slate-100 p-4 font-mono text-xs flex items-center justify-between gap-2">
            <span>
              <span className="text-yellow-400">$</span> {guide.verifyCmd}
            </span>
            <span className="text-emerald-400 inline-flex items-center gap-1">
              <CheckCircle2 size={13} aria-hidden="true" />
              Python 3.12+
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
          >
            Back to Curriculum
          </button>
        </div>
      </div>
    </div>
  );
}
