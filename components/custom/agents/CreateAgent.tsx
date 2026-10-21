"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  ArrowUp,
  Bot,
  Check,
  CircleAlert,
  Command,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { agentTemplates } from "@/data/agentTemplates";
import AIAgentQuestions from "./AIAgentQuestions";
import NewAgentCard from "./NewAgentCard";

export type ClarificationQuestion = {
  id: string;
  question: string;
  type: "single_select" | "mutli_select" | "text" | "number" | "date" | "time";
  options: string[];
  allowCustom: boolean;
  customPlaceholder: string;
};

export type AgentSchedule = {
  type: "once" | "recurring" | "manual";
  frequency?: "hourly" | "daily" | "weekly" | "monthly";
  time?: string;
  timezone?: string;
};

export type CreatedAgentType = {
  id: number;
  userEmail: string;
  agentId: string;
  name: string;
  agentImage: string;
  description: string;
  instructions: string;
  objective: string;
  tools: unknown;
  skills: string[];
  schedule: AgentSchedule;
  outputFormat: string;
  status: string;
  createdAt: string;
  composioSessionId?: string;
};

type AgentConfigResp = {
  status: "needs_clarification" | "ready";
  clarificationQuestions?: ClarificationQuestion[];
  config?: unknown;
  status_?: "ready";
};

const promptSuggestions = [
  {
    label: "Inbox Briefing",
    prompt:
      "Every weekday morning at 8:00 AM, read my unread Gmail messages, identify urgent items, and send me a concise prioritized briefing with suggested replies.",
  },
  {
    label: "Lead Qualifier",
    prompt:
      "Whenever a new lead signs up, look up their company on the web, determine company size and industry, and sync enriched details to our CRM.",
  },
  {
    label: "Daily Research",
    prompt:
      "Every morning, search the web for major product updates and news in artificial intelligence, summarize the top 3 stories, and draft a team digest.",
  },
  {
    label: "GitHub Reviewer",
    prompt:
      "Review open pull requests on our primary repository, check for test coverage and stylistic conventions, and provide a helpful summary comment.",
  },
];

export default function CreateAgent() {
  const [prompt, setPrompt] = useState("");
  const [configResult, setConfigResult] = useState<AgentConfigResp | null>(null);
  const [createdAgent, setCreatedAgent] = useState<CreatedAgentType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const templateId = new URLSearchParams(window.location.search).get("template");
    const template = agentTemplates.find((item) => item.id === templateId);
    if (template) {
      setPrompt(template.prompt);
      setSelectedTemplate(template.name);
    }
  }, []);

  const getTimezone = () =>
    window.localStorage.getItem("cogniva-timezone") ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";

  const handleResponse = (data: AgentConfigResp & Partial<CreatedAgentType>) => {
    if (data.status_ === "ready" || (data.status === "ready" && data.agentId)) {
      setCreatedAgent(data as CreatedAgentType);
      setConfigResult(null);
    } else {
      setConfigResult(data);
      setCreatedAgent(null);
    }
  };

  const onSubmit = async () => {
    if (!prompt.trim() || loading) return;
    setError("");
    setLoading(true);
    setConfigResult(null);
    setCreatedAgent(null);
    try {
      const result = await axios.post("/api/agent/configure", {
        prompt: prompt.trim(),
        timezone: getTimezone(),
      });
      handleResponse(result.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "We couldn't create the agent. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onComplete = async (answers: Record<string, string>) => {
    setError("");
    setLoading(true);
    setConfigResult(null);
    try {
      const result = await axios.post("/api/agent/configure", {
        prompt: `${prompt}\nClarifications: ${JSON.stringify(answers)}`,
        timezone: getTimezone(),
      });
      handleResponse(result.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          "We couldn't finish the agent. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Creation Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950 tracking-tight">
                What should this agent do?
              </h2>
              <p className="mt-1 text-xs text-slate-500 font-normal">
                Describe the task, tools, and schedule in plain English. Cogniva will generate the agent objective, instructions, and integration settings.
              </p>
            </div>

            {selectedTemplate && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800">
                <Check size={12} className="text-emerald-600" />
                <span>{selectedTemplate} loaded</span>
              </span>
            )}
          </div>

          {/* Quick Idea Pills */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">
              Ideas:
            </span>
            {[
              {
                ...promptSuggestions[0],
                badge: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300",
              },
              {
                ...promptSuggestions[1],
                badge: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
              },
              {
                ...promptSuggestions[2],
                badge: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300",
              },
              {
                ...promptSuggestions[3],
                badge: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300",
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setPrompt(item.prompt);
                  setSelectedTemplate(item.label);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${item.badge}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Prompt Input */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  onSubmit();
                }
              }}
              placeholder="e.g. Every weekday at 8:00 AM, inspect my unread emails in Gmail, flag high-priority client inquiries, and draft concise response suggestions..."
              className="min-h-[160px] w-full resize-y rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 text-xs sm:text-sm leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all font-normal"
              aria-label="Agent instructions"
            />
          </div>

          {/* Action Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Command size={12} /> Press Ctrl + Enter to create
            </span>

            <button
              onClick={onSubmit}
              disabled={loading || !prompt.trim()}
              className="cog-primary-button disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer px-6"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowUp size={14} />
              )}
              <span>{loading ? "Generating agent..." : "Create Agent"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-rose-200/90 bg-rose-50 px-4 py-3 text-xs text-rose-700"
        >
          <CircleAlert size={16} className="shrink-0" />
          <span>{String(error)}</span>
        </div>
      )}

      {/* Clarification Flow */}
      {configResult?.status === "needs_clarification" &&
        !!configResult.clarificationQuestions?.length && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
            <AIAgentQuestions
              questionList={configResult.clarificationQuestions}
              onComplete={onComplete}
            />
          </div>
        )}

      {/* Created Agent Success Card */}
      {createdAgent && (
        <NewAgentCard
          createdAgent={createdAgent}
          setUpdatedAgent={setCreatedAgent}
        />
      )}

      {/* Minimal Footer Helper */}
      {!configResult && !createdAgent && (
        <div className="text-center pt-2">
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <span>Or choose from pre-configured workflow templates</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
