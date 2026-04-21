import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft,
  Settings,
  Flame,
  MousePointer2,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

type OS = 'windows' | 'macos' | 'linux';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [os, setOs] = useState<OS | null>(null);
  const [hasTerminal, setHasTerminal] = useState<boolean | null>(null);
  const [hasPython, setHasPython] = useState<boolean | null>(null);

  const OS_CONFIG = {
    windows: {
      name: 'Windows',
      terminal: 'Command Prompt or PowerShell',
      terminalSteps: [
        'Press Win + R on your keyboard.',
        'Type "cmd" and hit Enter.',
        'Alternatively, search for "PowerShell" in the Start menu.'
      ],
      pythonSteps: [
        'Go to python.org/downloads.',
        'Download the Windows installer.',
        'IMPORTANT: Check the box "Add Python to PATH" before clicking Install.'
      ]
    },
    macos: {
      name: 'macOS',
      terminal: 'Terminal',
      terminalSteps: [
        'Press Cmd + Space to open Spotlight.',
        'Type "Terminal" and hit Enter.'
      ],
      pythonSteps: [
        'Open Terminal and type: brew install python (if you have Homebrew).',
        'Or download the macOS package from python.org/downloads.'
      ]
    },
    linux: {
      name: 'Linux',
      terminal: 'Your favorite Terminal emulator',
      terminalSteps: [
        'Press Ctrl + Alt + T (usually works).',
        'Or search for "Terminal" in your applications.'
      ],
      pythonSteps: [
        'Open Terminal.',
        'Type: sudo apt update && sudo apt install python3 (for Ubuntu/Debian).',
        'Or use your specific package manager.'
      ]
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-slate-200">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-8 sm:p-12">
          <AnimatePresence mode="wait">
            
            {/* Step 0: Welcome & OS */}
            {step === 0 && (
              <motion.div 
                key="step0"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="bg-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Monitor className="text-slate-900" size={24} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Ready to code?</h1>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Before we dive into the Python curriculum, let's make sure your environment is ready for success. What operating system are you using?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(['windows', 'macos', 'linux'] as OS[]).map(type => (
                    <button
                      key={type}
                      onClick={() => { setOs(type); nextStep(); }}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left flex flex-col items-center gap-2 group",
                        "hover:border-blue-600 hover:bg-blue-50/50",
                        "border-slate-100"
                      )}
                    >
                      <span className="capitalize font-bold text-slate-800">{type}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Terminal Check */}
            {step === 1 && (
              <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Terminal className="text-yellow-400" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">The Terminal</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  To run Python code, you'll need to use your {OS_CONFIG[os!].name} terminal. Do you know how to open and use it?
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { setHasTerminal(true); setStep(3); }}
                    className="w-full p-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center justify-between"
                  >
                    Yes, I'm a terminal pro!
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => { setHasTerminal(false); nextStep(); }}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-700 font-bold hover:border-slate-200 transition-all text-left"
                  >
                    I'm not sure, teach me.
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Terminal Instruction */}
            {step === 2 && (
              <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <MousePointer2 className="text-blue-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Opening the Terminal</h2>
                <div className="space-y-4 mb-8">
                  {OS_CONFIG[os!].terminalSteps.map((stepText, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-mono font-bold text-blue-600">{idx + 1}</span>
                      <p className="text-slate-700 text-sm">{stepText}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full p-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                >
                  Got it, it's open!
                </button>
              </motion.div>
            )}

            {/* Step 3: Python Check */}
            {step === 3 && (
              <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="bg-yellow-400 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Cpu className="text-slate-900" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Python Check</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Final check: Is Python 3 installed on your {os} machine? You can check by typing <code className="bg-slate-100 px-1 rounded">python --version</code> in your terminal.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { setHasPython(true); setStep(5); }}
                    className="w-full p-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center justify-between"
                  >
                    Yep, Python is ready.
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => { setHasPython(false); nextStep(); }}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 text-slate-700 font-bold hover:border-slate-200 transition-all text-left"
                  >
                    I need to install it.
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Python Instruction */}
            {step === 4 && (
              <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="bg-emerald-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Flame className="text-emerald-600" size={24} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Installing Python</h2>
                <div className="space-y-4 mb-8">
                  {OS_CONFIG[os!].pythonSteps.map((stepText, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-mono font-bold text-emerald-600">{idx + 1}</span>
                      <p className="text-slate-700 text-sm">{stepText}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={nextStep}
                  className="w-full p-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                >
                  Installed! Let's go.
                </button>
              </motion.div>
            )}

            {/* Step 5: Success */}
            {step === 5 && (
              <motion.div key="step5" className="text-center" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 text-white">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">You're All Set!</h2>
                <p className="text-slate-600 mb-8 leading-relaxed max-w-sm mx-auto">
                  Your environment is ready. You have the terminal, you have Python, and you have wisdom. It's time to become a Python master.
                </p>
                <button 
                  onClick={onComplete}
                  className="w-full p-5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                >
                  Enter the Course
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer/Back Button */}
        {step > 0 && step < 5 && (
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center">
            <button 
              onClick={prevStep}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
