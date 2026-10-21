"use client";

import React, { useState } from "react";
import {
  Clock,
  Cpu,
  GitBranch,
  Globe,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  RotateCw,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  badge: string;
  title: string;
  desc: string;
  tool: string;
  status: string;
  outputPreview: string;
}

interface WorkflowScenario {
  id: string;
  name: string;
  trigger: string;
  schedule: string;
  steps: WorkflowStep[];
}

export function WorkflowSection() {
  const scenarios: WorkflowScenario[] = [
    {
      id: "leads",
      name: "Inbound Lead Qualification & CRM",
      trigger: "New inbound demo request via Typeform / Webhook",
      schedule: "Runs within 15 seconds of submission",
      steps: [
        {
          id: "step1",
          badge: "Step 01: Extract & Enrich",
          title: "Browserbase Web Enrichment",
          desc: "Searches company domain, extracts headcount, funding stage, and tech stack from public sources.",
          tool: "Browserbase + Google Search",
          status: "Success (1.2s)",
          outputPreview: '{\n  "company": "Acme Systems",\n  "stage": "Series B",\n  "arr_estimate": "$12M",\n  "decision_maker": "VP Engineering"\n}',
        },
        {
          id: "step2",
          badge: "Step 02: Scoring & Fit",
          title: "LLM Intent & Urgency Scoring",
          desc: "Applies sales rubric to score prospect ICP fit (92/100) and crafts custom battle-card.",
          tool: "Claude 3.5 Sonnet / OpenAI",
          status: "Success (0.8s)",
          outputPreview: '{\n  "fit_score": 92,\n  "urgency": "High",\n  "tier": "Enterprise Tier 1",\n  "recommended_ae": "Sarah Lin"\n}',
        },
        {
          id: "step3",
          badge: "Step 03: Action & Notify",
          title: "HubSpot Record + Slack Ping",
          desc: "Creates enriched lead in HubSpot and pings AE in #enterprise-leads with one-click book link.",
          tool: "HubSpot API + Slack Webhook",
          status: "Dispatched",
          outputPreview: '{\n  "crm_deal_id": "deal_98412",\n  "slack_channel": "#enterprise-leads",\n  "calendar_slot_reserved": true\n}',
        },
      ],
    },
    {
      id: "radar",
      name: "Competitor Radar & Pricing Watchdog",
      trigger: "Scheduled Cron: Every Monday at 08:00 UTC",
      schedule: "Weekly autonomous market scan",
      steps: [
        {
          id: "step1",
          badge: "Step 01: Multi-Page Scraping",
          title: "Headless Browser Pricing Scan",
          desc: "Navigates 5 competitor pricing matrices, takes screenshots, and extracts tiered price structures.",
          tool: "Browserbase Headless Chrome",
          status: "Success (3.4s)",
          outputPreview: '{\n  "competitors_scanned": 5,\n  "changes_detected": 1,\n  "flagged_vendor": "VendorX",\n  "old_tier": "$49/mo",\n  "new_tier": "$69/mo"\n}',
        },
        {
          id: "step2",
          badge: "Step 02: Delta Analysis",
          title: "Strategic Impact Evaluation",
          desc: "Identifies whether changes open a positioning wedge for our sales team and drafts rebuttal points.",
          tool: "Cogniva Reasoning Kernel",
          status: "Success (1.1s)",
          outputPreview: '{\n  "positioning_delta": "VendorX raised price 40% on API tier",\n  "talking_point": "Highlight our included API credits"\n}',
        },
        {
          id: "step3",
          badge: "Step 03: Executive Briefing",
          title: "Sync Notion Board & Email Execs",
          desc: "Appends structured brief to Product Strategy Notion database and sends 2-minute bulleted recap.",
          tool: "Notion API + Resend",
          status: "Dispatched",
          outputPreview: '{\n  "notion_page_created": true,\n  "recipients": ["founder@cogniva.ai", "vp-sales@cogniva.ai"],\n  "read_time": "90s"\n}',
        },
      ],
    },
    {
      id: "pr_review",
      name: "GitHub PR Triage & Standup Digest",
      trigger: "GitHub Webhook on PR open / update",
      schedule: "Real-time developer workflow hook",
      steps: [
        {
          id: "step1",
          badge: "Step 01: Code Diff Analysis",
          title: "Static Diff & Security Lint",
          desc: "Fetches PR patch, checks for hardcoded credentials, migrations, and breaking schema changes.",
          tool: "GitHub API + AST Parser",
          status: "Success (0.9s)",
          outputPreview: '{\n  "files_changed": 14,\n  "lines_added": 420,\n  "secrets_found": 0,\n  "schema_migration": true\n}',
        },
        {
          id: "step2",
          badge: "Step 02: Plain-English Summary",
          title: "Engineering Context Generation",
          desc: "Translates complex diffs into product manager readable summaries with testing checklist.",
          tool: "Cogniva Code Agent",
          status: "Success (1.4s)",
          outputPreview: '{\n  "summary": "Added multi-region session failover for Redis cache",\n  "qa_focus": "Simulate Redis connection timeout"\n}',
        },
        {
          id: "step3",
          badge: "Step 03: Linear Task Sync",
          title: "Linear Ticket State Update",
          desc: "Links PR to Linear issue ENG-412 and posts summary comment for tomorrow's standup.",
          tool: "Linear API",
          status: "Dispatched",
          outputPreview: '{\n  "linear_issue": "ENG-412",\n  "status": "In Review",\n  "comment_posted": true\n}',
        },
      ],
    },
  ];

  const [selectedScenarioId, setSelectedScenarioId] = useState("leads");
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);

  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const activeStep = currentScenario.steps[selectedStepIdx] || currentScenario.steps[0];

  return (
    <section id="workflow" className="relative py-16 md:py-24 border-t border-slate-200/70 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide uppercase mb-3">
            <Zap className="w-3.5 h-3.5 text-slate-700" />
            <span>Autonomous Execution Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            How Cogniva runs real work without getting stuck
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Agents aren&apos;t just chat windows. They have durable memory, native tools, and deterministic checkpoints so they never drift off course.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => {
                setSelectedScenarioId(scenario.id);
                setSelectedStepIdx(0);
              }}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedScenarioId === scenario.id
                  ? "bg-slate-950 text-white shadow-sm"
                  : "bg-slate-100/90 hover:bg-slate-200/80 text-slate-700"
              }`}
            >
              {scenario.name}
            </button>
          ))}
        </div>

        {/* Interactive Workflow Inspector Box */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-8 shadow-sm">
          
          {/* Top Trigger Banner */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Active Trigger
                </span>
                <span className="text-sm font-bold text-slate-900">{currentScenario.trigger}</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {currentScenario.schedule}
            </span>
          </div>

          {/* 3 Step Interactive Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Step Selection Cards (Col 7) */}
            <div className="lg:col-span-7 space-y-3">
              {currentScenario.steps.map((step, idx) => (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepIdx(idx)}
                  className={`group relative p-5 rounded-xl border transition-all cursor-pointer ${
                    selectedStepIdx === idx
                      ? "bg-white border-slate-900 shadow-md ring-1 ring-slate-900/10"
                      : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {step.badge}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {step.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-950 mb-1 group-hover:text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                    {step.desc}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                      {step.tool}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Terminal & State Inspector (Col 5) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0b0f19] text-white p-5 shadow-lg overflow-hidden flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      step_output.json
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    HTTP 200 OK
                  </span>
                </div>

                <div className="text-xs font-mono text-emerald-400 mb-2">
                  // {activeStep.title} payload
                </div>
                
                <pre className="text-xs font-mono text-slate-200 bg-slate-950/70 p-3.5 rounded-lg border border-slate-800/70 overflow-x-auto leading-relaxed">
                  {activeStep.outputPreview}
                </pre>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Deterministic run
                </span>
                <span className="font-mono text-slate-400 text-[11px]">
                  latency: 240ms
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
