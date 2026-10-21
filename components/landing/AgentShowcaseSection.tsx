"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Mail,
  FileSpreadsheet,
  TrendingUp,
  GitPullRequest,
  ShieldCheck,
  Search,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface AgentTemplate {
  id: string;
  category: "all" | "growth" | "ops" | "engineering";
  name: string;
  tagline: string;
  icon: any;
  tools: string[];
  cadence: string;
  hoursSaved: string;
  badgeColor: string;
}

export function AgentShowcaseSection() {
  const [activeCategory, setActiveCategory] = useState<"all" | "growth" | "ops" | "engineering">("all");

  const templates: AgentTemplate[] = [
    {
      id: "inbox-scout",
      category: "ops",
      name: "Inbox Scout",
      tagline: "Summarizes high-priority incoming investor & partner emails, drafting contextual replies.",
      icon: Mail,
      tools: ["Gmail", "Claude 3.5", "Slack"],
      cadence: "Continuous (Every 15m)",
      hoursSaved: "6 hrs/wk",
      badgeColor: "bg-blue-50 text-blue-600 border-blue-200/80",
    },
    {
      id: "pipeline-minder",
      category: "growth",
      name: "Pipeline Minder",
      tagline: "Enriches incoming leads with company revenue data and books qualifying meetings straight into CRM.",
      icon: FileSpreadsheet,
      tools: ["HubSpot", "Browserbase", "Google Calendar"],
      cadence: "Event-driven webhook",
      hoursSaved: "10 hrs/wk",
      badgeColor: "bg-purple-50 text-purple-600 border-purple-200/80",
    },
    {
      id: "market-pulse",
      category: "growth",
      name: "Market Pulse",
      tagline: "Monitors rival landing pages & pricing tables, sending weekly strategic digests to executive leadership.",
      icon: TrendingUp,
      tools: ["Headless Chrome", "Notion", "Email"],
      cadence: "Every Monday 8 AM",
      hoursSaved: "4 hrs/wk",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    },
    {
      id: "pr-reviewer",
      category: "engineering",
      name: "PR Sentinel",
      tagline: "Performs security audits, verifies database migrations, and writes plain-English summaries for releases.",
      icon: GitPullRequest,
      tools: ["GitHub", "Linear", "AST Lint"],
      cadence: "On PR push / merge",
      hoursSaved: "8 hrs/wk",
      badgeColor: "bg-rose-50 text-rose-600 border-rose-200/80",
    },
    {
      id: "security-auditor",
      category: "ops",
      name: "Compliance Guardian",
      tagline: "Scans cloud configurations and third-party SaaS permissions for SOC-2 drift and flags vulnerabilities.",
      icon: ShieldCheck,
      tools: ["AWS API", "Postgres", "Slack"],
      cadence: "Daily 2 AM UTC",
      hoursSaved: "5 hrs/wk",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200/80",
    },
    {
      id: "content-curator",
      category: "growth",
      name: "Signal Hunter",
      tagline: "Aggregates trending industry research papers, podcasts, and patents into actionable team memos.",
      icon: Search,
      tools: ["Arxiv", "RSS", "Markdown"],
      cadence: "Twice weekly",
      hoursSaved: "5 hrs/wk",
      badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
    },
  ];

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <section id="agents" className="relative py-16 md:py-24 bg-[#fbfcfe]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              <span>Agent Library</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Pre-built templates ready to work on day one
            </h2>
            <p className="text-base text-slate-600 max-w-xl mt-2 font-normal">
              Clone ready-to-run agents or customize your own triggers, instructions, and toolchains in minutes.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-full self-start md:self-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory("growth")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === "growth"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Growth & Sales
            </button>
            <button
              onClick={() => setActiveCategory("ops")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === "ops"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Operations
            </button>
            <button
              onClick={() => setActiveCategory("engineering")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === "engineering"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Engineering
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon + Hours Saved Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${template.badgeColor}`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                      saves ~{template.hoursSaved}
                    </span>
                  </div>

                  {/* Agent Name */}
                  <h3 className="text-lg font-bold text-slate-950 mb-2">
                    {template.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {template.tagline}
                  </p>
                </div>

                <div>
                  {/* Tools Stack Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-5 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                      Tools:
                    </span>
                    {template.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200/80 px-2 py-0.5 rounded-md"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Action & Cadence */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {template.cadence}
                    </span>

                    <Link
                      href="/dashboard/agents"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-black hover:underline"
                    >
                      <span>Deploy</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
