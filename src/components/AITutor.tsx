import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { Bot, Send, User, Settings, Sparkles, X, Key } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AITutorProps {
  currentContextContext: string;
  lessonTitle: string;
}

export function AITutor({ currentContextContext, lessonTitle }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your Python Tutor. Ask me any questions you have about today's lesson: **${lessonTitle}**.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Custom API key feature state
  const [showSettings, setShowSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load custom API key on mount
  useEffect(() => {
    setIsClient(true);
    const savedKey = localStorage.getItem("python30days_custom_api_key");
    if (savedKey) {
      setCustomApiKey(savedKey);
    } else {
      setShowSettings(true); // Auto-open settings if key is missing
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem("python30days_custom_api_key", key);
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleEnhance = async () => {
    if (!input.trim() || !customApiKey || isEnhancing) return;
    setIsEnhancing(true);

    try {
      const aiInstance = new GoogleGenAI({ apiKey: customApiKey });
      const response = await aiInstance.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a prompt enhancer. The user is a beginner student learning Python (${lessonTitle}).
They drafted the following question to ask their AI tutor: "${input}"

Please rewrite this question to make it clearer, more detailed, and formatted as a great, articulate question for a tutor.
Also, if the question is too brief, expand it slightly so the tutor has more context to give a good answer.
Return ONLY the enhanced question text. Do not include markdown formatting, quotes, or any conversational filler.`,
              },
            ],
          },
        ],
      });

      if (response.text) {
        setInput(response.text.trim());
      }
    } catch (error) {
      console.error("Failed to enhance question:", error);
      alert("Failed to enhance. Please check if your Custom Gemini API key is valid.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !customApiKey) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const aiInstance = new GoogleGenAI({ apiKey: customApiKey });
      
      const response = await aiInstance.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          ...messages.slice(1).map(m => ({ // include chat history (skip first greeting)
            role: m.role,
            parts: [{text: m.content}]
          })),
          {
            role: "user",
            parts: [
              {
                text: `You are an enthusiastic, encouraging expert Python tutor mentoring a beginner student.
They are currently going through a 30-day course. 
Today's subject is: ${lessonTitle}

Here is the curriculum content they are currently reading:
---
${currentContextContext}
---

Their question/message is: "${userMessage}"

Provide a helpful, precise answer. Use simple analogies. Format with Markdown. Use very concise code examples if applicable.`,
              },
            ],
          },
        ],
      });

      if (response.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.text },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the AI. Please verify your API key in the settings above.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      <div className="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50/50 justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 p-1.5 rounded-lg text-slate-900 shadow-sm">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 leading-tight">AI Tutor</h2>
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              customApiKey ? "text-emerald-600" : "text-amber-600"
            )}>
              {customApiKey ? "Connected with your key" : "API Key Required"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
             "p-2 rounded-lg transition-colors border",
             showSettings ? "bg-slate-900 text-white border-slate-900" : "text-slate-400 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
          )}
          title="Tutor Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {showSettings && (
        <div className="p-5 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <Key size={16} className="text-blue-500" /> Bring Your Own Key
            </h3>
            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              To keep this course free and high-quality, the AI Tutor requires you to use your own <span className="text-blue-600 font-bold">Gemini API Key</span>.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-xl shadow-inner bg-white focus:outline-none focus:border-blue-500 font-mono placeholder:font-sans transition-all"
              />
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Get your free API key here →
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative" ref={scrollRef}>
        {!customApiKey && !showSettings && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-8 text-center bg-slate-50/10">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 max-w-[280px]">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Key size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">Tutor Offline</h4>
                <p className="text-xs text-slate-500 mb-6 font-medium">Please enter your Gemini API key in settings to unlock the AI assistant.</p>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg"
                >
                  Configure Now
                </button>
              </div>
           </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex w-full gap-3 text-sm",
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-yellow-400"
              )}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm overflow-hidden",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-100 text-slate-800 rounded-tl-none font-medium text-[13px] leading-relaxed markdown-body"
              )}
            >
              {msg.role === 'assistant' ? (
                 <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                 <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex w-full gap-3 text-sm flex-row">
             <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-800 text-yellow-400">
                <Bot size={16} />
            </div>
            <div className="bg-slate-100 max-w-[85%] rounded-2xl px-4 py-3 rounded-tl-none shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Ask a question about " + lessonTitle + "..."}
            className={cn(
               "w-full pl-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm",
               customApiKey ? "pr-24" : "pr-12"
            )}
          />
          <div className="absolute right-2 flex items-center gap-1">
            {customApiKey && (
               <button
                 type="button"
                 onClick={handleEnhance}
                 disabled={!input.trim() || isEnhancing || isTyping}
                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-40 transition-colors flex items-center justify-center group relative"
                 title="Enhance question using your API key"
               >
                 <Sparkles size={16} className={isEnhancing ? "animate-pulse text-blue-400" : ""} />
               </button>
            )}
            <button
              type="submit"
              disabled={!input.trim() || isTyping || isEnhancing}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        {customApiKey && (
           <p className="text-[10px] text-slate-400 mt-2 text-center">
             Type your thought and click <Sparkles size={10} className="inline mb-0.5"/> to enhance your question.
           </p>
        )}
      </div>
    </div>
  );
}
