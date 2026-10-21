"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Play,
  RotateCw,
  Sparkles,
  Zap,
  Mail,
  TrendingUp,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { CognivaLogo } from "@/components/brand/CognivaLogo";

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<"agents" | "dashboard" | "runs" | "integrations">("agents");
  const [isRunning, setIsRunning] = useState(false);
  const [completedCount, setCompletedCount] = useState(18);
  const [simulatedFeedback, setSimulatedFeedback] = useState<string | null>(null);

  const handleRunNow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setSimulatedFeedback("Triggered all 3 agents across tools...");
    setTimeout(() => {
      setIsRunning(false);
      setCompletedCount((prev) => prev + 1);
      setSimulatedFeedback("Inbox Scout completed summary • Pipeline synced 4 leads");
      setTimeout(() => setSimulatedFeedback(null), 4000);
    }, 1800);
  };

  return (
    <section className="relative pt-6 pb-20 md:pt-12 md:pb-28 overflow-hidden">
      {/* Soft Ambient Glows behind the grid */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-emerald-200/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-10 right-1/4 translate-x-1/3 w-[600px] h-[600px] rounded-full bg-indigo-200/20 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left">
            
            {/* Pill Badge matching screenshot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/90 bg-gradient-to-r from-indigo-50/90 via-sky-50/80 to-purple-50/90 text-indigo-900 text-xs sm:text-sm font-semibold tracking-tight mb-6 shadow-xs hover:border-indigo-300 transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Agentic automation for everyday operations</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-black tracking-[-0.035em] text-slate-950 leading-[1.06] mb-6">
              Cogniva keeps your agents moving while you work.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8 font-normal">
              Create AI agents that use tools, follow schedules, run repeatable tasks, and report back with the signal your team needs.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <Link
                href="/dashboard/agents"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Manage agents</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/run"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full shadow-xs hover:shadow-sm hover:border-indigo-200 transition-all duration-200"
              >
                <span>View runs</span>
              </Link>
            </div>

            {/* Stats Metric Pill Card */}
            <div className="w-full sm:w-auto inline-flex items-center rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-sm p-4 sm:px-6 sm:py-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] divide-x divide-slate-100">
              <div className="pr-5 sm:pr-7">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">3x</div>
                <div className="text-xs text-slate-500 font-medium">faster handoffs</div>
              </div>
              <div className="px-5 sm:px-7">
                <div className="text-2xl sm:text-3xl font-black text-violet-600 tracking-tight">24/7</div>
                <div className="text-xs text-slate-500 font-medium">scheduled runs</div>
              </div>
              <div className="pl-5 sm:pl-7">
                <div className="text-2xl sm:text-3xl font-black text-sky-600 tracking-tight">100</div>
                <div className="text-xs text-slate-500 font-medium">starter credits</div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Agent Command Mockup */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[540px] rounded-2xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_30px_70px_-15px_rgba(15,23,42,0.16)]">
              
              {/* Dark Obsidian Header */}
              <div className="bg-[#090d16] px-5 py-3.5 flex items-center justify-between text-white border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <CognivaLogo size={22} showWordmark={false} />
                  <span className="font-semibold text-sm tracking-tight text-slate-100">Agent command</span>
                </div>
                
                {/* Live Indicator Badge */}
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Live</span>
                </div>
              </div>

              {/* Window Body Split: Sidebar + Main Content */}
              <div className="grid grid-cols-12 min-h-[380px]">
                
                {/* Mini Sidebar */}
                <div className="col-span-4 bg-slate-50/70 border-r border-slate-100 p-3 flex flex-col gap-1.5 select-none">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                      activeTab === "dashboard"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="truncate">Dashboard</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("agents")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                      activeTab === "agents"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">Agents</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("runs")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                      activeTab === "runs"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span className="truncate">Runs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("integrations")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                      activeTab === "integrations"
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    <span className="truncate">Integrations</span>
                  </button>
                </div>

                {/* Main Content Pane */}
                <div className="col-span-8 p-4 sm:p-5 flex flex-col justify-between bg-white">
                  
                  <div>
                    {/* Briefing Header & Run Now Button */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                          Today&apos;s briefing
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          3 agents ready to run
                        </h3>
                      </div>

                      <button
                        onClick={handleRunNow}
                        disabled={isRunning}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 shrink-0 ${
                          isRunning
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm shadow-indigo-500/20 active:scale-95 cursor-pointer"
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <RotateCw className="w-3 h-3 animate-spin text-white" />
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Run now</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Simulated Toast / Feedback */}
                    {simulatedFeedback && (
                      <div className="mb-3 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800 flex items-center gap-1.5 animate-in fade-in duration-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{simulatedFeedback}</span>
                      </div>
                    )}

                    {/* Agent Cards Stack */}
                    <div className="space-y-2.5">
                      
                      {/* Agent Card 1: Inbox Scout */}
                      <div className="group/item flex items-center justify-between p-2.5 rounded-xl border border-sky-100 hover:border-sky-300 bg-sky-50/30 hover:bg-sky-50/60 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-2xs">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Inbox Scout</h4>
                            <p className="text-[11px] text-slate-500 truncate max-w-[150px] sm:max-w-[190px]">
                              Summarize investor replies
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isRunning
                            ? "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                            : "bg-sky-100 text-sky-800 border border-sky-200"
                        }`}>
                          {isRunning ? "Executing" : "Running"}
                        </span>
                      </div>

                      {/* Agent Card 2: Pipeline Minder */}
                      <div className="group/item flex items-center justify-between p-2.5 rounded-xl border border-purple-100 hover:border-purple-300 bg-purple-50/30 hover:bg-purple-50/60 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs">
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Pipeline Minder</h4>
                            <p className="text-[11px] text-slate-500 truncate max-w-[150px] sm:max-w-[190px]">
                              Sync warm leads to CRM
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          Scheduled
                        </span>
                      </div>

                      {/* Agent Card 3: Market Pulse */}
                      <div className="group/item flex items-center justify-between p-2.5 rounded-xl border border-emerald-100 hover:border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Market Pulse</h4>
                            <p className="text-[11px] text-slate-500 truncate max-w-[150px] sm:max-w-[190px]">
                              Send Monday briefing
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Ready
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Bottom Quick Metrics Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center select-none">
                    <div className="flex items-center justify-center gap-1.5 bg-emerald-50/80 border border-emerald-100/80 py-1.5 px-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-950">{completedCount}</span>
                      <span className="text-[10px] text-emerald-700">Done</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 bg-sky-50/80 border border-sky-100/80 py-1.5 px-2 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-sky-600" />
                      <span className="text-xs font-bold text-sky-950">{isRunning ? 3 : 2}</span>
                      <span className="text-[10px] text-sky-700">Active</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 bg-purple-50/80 border border-purple-100/80 py-1.5 px-2 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs font-bold text-purple-950">9</span>
                      <span className="text-[10px] text-purple-700">Queued</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
