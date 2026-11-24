import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  Bot,
  Send,
  User,
  Settings,
  Sparkles,
  X,
  Key,
  Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import type { Lesson } from "../data/curriculum";
import { generateLocalTutorReply, getQuickPrompts } from "../lib/pythonTutor";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: "local" | "gemini";
}

interface AITutorProps {
  lesson: Lesson;
  externalPrompt?: { text: string; nonce: number } | null;
  onClose?: () => void;
}

const API_KEY_STORAGE = "python30days_custom_api_key";

export function AITutor({ lesson, externalPrompt, onClose }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      source: "local",
      content: `Hi! I'm your **Python Tutor** for **Day ${lesson.id}: ${lesson.title}**. Ask about syntax, paste an error message, or pick a quick prompt below — works offline right out of the box.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Optional BYOK Gemini settings (never locks the tutor)
  const [showSettings, setShowSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLessonIdRef = useRef<number>(lesson.id);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(API_KEY_STORAGE);
      if (savedKey) setCustomApiKey(savedKey);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  // Announce lesson change cleanly
  useEffect(() => {
    if (prevLessonIdRef.current !== lesson.id) {
      prevLessonIdRef.current = lesson.id;
      setMessages([
        {
          role: "assistant",
          source: customApiKey ? "gemini" : "local",
          content: `Switched to **Day ${lesson.id}: ${lesson.title}**. What would you like to explore or debug?`,
        },
      ]);
    }
  }, [lesson.id, lesson.title, customApiKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSaveKey = (key: string) => {
    const trimmed = key.trim();
    setCustomApiKey(trimmed);
    setStatusNotice(null);
    try {
      if (trimmed) {
        localStorage.setItem(API_KEY_STORAGE, trimmed);
      } else {
        localStorage.removeItem(API_KEY_STORAGE);
      }
    } catch {
      // Ignore storage error
    }
  };

  const sendQuestion = async (rawText: string) => {
    const userMessage = rawText.trim();
    if (!userMessage || isTyping) return;

    setInput("");
    setStatusNotice(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    // If user configured an optional Gemini key, try Gemini first and fall back cleanly to Local Tutor
    if (customApiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: customApiKey });
        const prompt = `You are a concise, clear Python 3 tutor mentoring a learner on Day ${lesson.id}: ${lesson.title}.
Lesson reference:
---
${lesson.content}
---
Learner question: "${userMessage}"
Reply in concise Markdown with short code examples where helpful.`;

        let text: string | undefined;
        try {
          const res = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });
          text = res.text;
        } catch {
          const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });
          text = res.text;
        }

        if (text) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: text!, source: "gemini" },
          ]);
          setIsTyping(false);
          return;
        }
      } catch {
        setStatusNotice(
          "Gemini API request failed — answered with the built-in Local Tutor instead."
        );
      }
    }

    // Deterministic local Python Tutor (zero API key, zero network errors)
    const reply = generateLocalTutorReply(userMessage, lesson);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: reply, source: "local" },
    ]);
    setIsTyping(false);
  };

  useEffect(() => {
    if (externalPrompt && externalPrompt.text) {
      void sendQuestion(externalPrompt.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt?.nonce]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendQuestion(input);
  };

  const quickPrompts = getQuickPrompts(lesson);

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-200 bg-slate-50 justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-slate-900 p-2 rounded-xl text-yellow-400 shrink-0">
            <Bot size={18} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 text-sm leading-tight truncate">
              Python Tutor
            </h2>
            <p
              className={cn(
                "text-[10px] font-mono font-semibold uppercase tracking-wider",
                customApiKey ? "text-blue-700" : "text-emerald-700"
              )}
            >
              {customApiKey ? "Gemini BYOK + Local" : "Local Engine Ready"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSettings((s) => !s)}
            aria-label="Configure optional Gemini API key"
            aria-expanded={showSettings}
            className={cn(
              "p-2 min-w-[38px] min-h-[38px] rounded-xl transition-colors border flex items-center justify-center",
              showSettings
                ? "bg-slate-900 text-white border-slate-900"
                : "text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
            )}
            title="Optional Gemini BYOK Settings"
          >
            <Settings size={16} aria-hidden="true" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Python Tutor"
              className="p-2 min-w-[38px] min-h-[38px] rounded-xl text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center justify-center"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Optional BYOK Settings Drawer */}
      {showSettings && (
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
              <Key size={13} className="text-blue-600" aria-hidden="true" />
              Optional Gemini API Key
            </h3>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
              className="text-slate-500 hover:text-slate-800 p-1"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            The built-in Local Tutor works with <strong>zero key required</strong>.
            Optionally paste a personal Gemini API key (stored only in your browser)
            for open-ended LLM explanations.
          </p>

          <div className="flex gap-2">
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => handleSaveKey(e.target.value)}
              placeholder="AIzaSy... (optional)"
              aria-label="Optional Gemini API key"
              className="flex-1 min-w-0 px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-blue-600 font-mono"
            />
            {customApiKey && (
              <button
                type="button"
                onClick={() => handleSaveKey("")}
                aria-label="Clear saved API key"
                className="px-2.5 py-2 rounded-xl border border-slate-300 text-slate-600 hover:text-rose-700 hover:border-rose-300 bg-white"
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-blue-700 hover:underline inline-block"
          >
            Get a free Gemini key at Google AI Studio →
          </a>
        </div>
      )}

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        ref={scrollRef}
      >
        {statusNotice && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[11px] text-amber-900">
            {statusNotice}
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex w-full gap-2.5 text-sm",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-yellow-400"
              )}
            >
              {msg.role === "user" ? (
                <User size={14} aria-hidden="true" />
              ) : (
                <Bot size={14} aria-hidden="true" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 overflow-x-auto",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-sm text-[13px] leading-relaxed"
                  : "bg-slate-100 text-slate-800 rounded-tl-sm border border-slate-200/70 tutor-markdown"
              )}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex w-full gap-2.5 text-sm">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-slate-900 text-yellow-400">
              <Bot size={14} aria-hidden="true" />
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-500">
              Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts & Input */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 space-y-2.5 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendQuestion(prompt)}
              disabled={isTyping}
              className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-300 transition-colors text-left"
            >
              <Sparkles
                size={10}
                className="inline mr-1 text-amber-500"
                aria-hidden="true"
              />
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about Day ${lesson.id} or paste an error...`}
            aria-label={`Ask Python Tutor about Day ${lesson.id}`}
            className="flex-1 min-w-0 pl-3.5 pr-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send question to Python Tutor"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send size={16} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
