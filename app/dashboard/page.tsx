"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarClock,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  Layers3,
  Play,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { agentTemplates } from "@/data/agentTemplates";

type Agent = {
  agentId: string;
  name?: string;
  description?: string;
  status?: string;
  schedule?: { type?: string; frequency?: string; time?: string };
};

type Run = {
  id: string;
  name?: string;
  task?: string;
  status: string;
  createdAt: string;
  completedAt?: string;
};

function relativeDate(value?: string) {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(diff)) return "—";
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DashboardPage() {
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetch("/api/agent/configure"), fetch("/api/agent/log")])
      .then(async ([agentRes, runRes]) => {
        if (!agentRes.ok || !runRes.ok) throw new Error("Could not load workspace");
        const [agentData, runData] = await Promise.all([agentRes.json(), runRes.json()]);
        if (mounted) {
          setAgents(Array.isArray(agentData) ? agentData : []);
          setRuns(Array.isArray(runData) ? runData : []);
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const completed = runs.filter((run) => run.status === "completed").length;
  const scheduled = runs.filter((run) => run.status === "scheduled").length;
  const failed = runs.filter((run) => run.status === "failed").length;
  const active = agents.filter((agent) => agent.status === "active").length;
  const firstName = user?.firstName || userDetail?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            {greeting}, {firstName}.
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-normal max-w-xl">
            A comprehensive overview of your autonomous agents, execution runs, and scheduled workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/templates"
            className="cog-secondary-button"
          >
            <span>Templates</span>
          </Link>
          <Link
            href="/dashboard/agents"
            className="cog-primary-button"
          >
            <Plus size={15} />
            <span>Create Agent</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-center gap-2.5">
          <CircleAlert size={16} />
          <span>Workspace activity could not be loaded. Please refresh the page to retry.</span>
        </div>
      )}

      {/* 4 Metrics Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Agents",
            value: agents.length,
            detail: `${active} active right now`,
            icon: Bot,
            cardBg: "bg-gradient-to-br from-indigo-50/70 via-white to-white border-indigo-100 hover:border-indigo-200",
            iconBg: "bg-indigo-600 text-white shadow-xs shadow-indigo-300",
            labelColor: "text-indigo-900/70",
          },
          {
            label: "Completed Runs",
            value: completed,
            detail: "Successful executions",
            icon: CircleCheck,
            cardBg: "bg-gradient-to-br from-emerald-50/70 via-white to-white border-emerald-100 hover:border-emerald-200",
            iconBg: "bg-emerald-600 text-white shadow-xs shadow-emerald-300",
            labelColor: "text-emerald-900/70",
          },
          {
            label: "Scheduled Tasks",
            value: scheduled,
            detail: "Upcoming automated runs",
            icon: CalendarClock,
            cardBg: "bg-gradient-to-br from-violet-50/70 via-white to-white border-violet-100 hover:border-violet-200",
            iconBg: "bg-violet-600 text-white shadow-xs shadow-violet-300",
            labelColor: "text-violet-900/70",
          },
          {
            label: "Usage Credits",
            value: userDetail?.usageCredits ?? "100",
            detail: "Available balance",
            icon: Zap,
            cardBg: "bg-gradient-to-br from-sky-50/70 via-white to-white border-sky-100 hover:border-sky-200",
            iconBg: "bg-sky-600 text-white shadow-xs shadow-sky-300",
            labelColor: "text-sky-900/70",
          },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 ${metric.cardBg}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${metric.labelColor}`}>
                  {metric.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${metric.iconBg}`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                </div>
              </div>
              <div className="mt-4 text-3xl font-black text-slate-950 tracking-tight">
                {loading ? "—" : metric.value}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-medium">
                {metric.detail}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agents & Activity Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        {/* Your Agents Panel */}
        <section className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Agents</h2>
              <p className="text-xs text-slate-500">Autonomous workflows currently deployed</p>
            </div>
            <Link
              href="/dashboard/agents"
              className="text-xs font-semibold text-slate-900 hover:text-black inline-flex items-center gap-1"
            >
              <span>View all ({agents.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {agents.length ? (
            <div className="divide-y divide-slate-100">
              {agents.slice(0, 4).map((agent) => (
                <Link
                  key={agent.agentId}
                  href="/dashboard/agents"
                  className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                      <Bot size={20} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-sm font-bold text-slate-900">
                        {agent.name || "Untitled Agent"}
                      </span>
                      <span className="block truncate text-xs text-slate-500 max-w-md">
                        {agent.description || "Configured autonomous agent"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        agent.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {agent.status === "active" ? "Active" : "Paused"}
                    </span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3 border border-slate-200">
                <Bot size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No agents created yet</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Describe the task you want done and Cogniva will assemble your agent in seconds.
              </p>
              <Link
                href="/dashboard/agents"
                className="mt-4 cog-primary-button"
              >
                <Plus size={14} />
                <span>Create Your First Agent</span>
              </Link>
            </div>
          )}
        </section>

        {/* Activity & Runs Panel */}
        <section className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Runs</h2>
              <p className="text-xs text-slate-500">Live signals & execution history</p>
            </div>
            <Link
              href="/dashboard/run"
              className="text-xs font-semibold text-slate-900 hover:text-black inline-flex items-center gap-1"
            >
              <span>View runs ({runs.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {runs.length ? (
            <div className="divide-y divide-slate-100 px-3">
              {runs.slice(0, 5).map((run) => (
                <Link
                  key={run.id}
                  href="/dashboard/run"
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                        run.status === "completed"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : run.status === "failed"
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : "bg-sky-50 text-sky-600 border border-sky-200"
                      }`}
                    >
                      {run.status === "completed" ? (
                        <Check size={14} />
                      ) : run.status === "failed" ? (
                        <CircleAlert size={14} />
                      ) : (
                        <Clock3 size={14} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-bold text-slate-900">
                        {run.name || run.task || "Agent Execution"}
                      </span>
                      <span className="block text-[11px] text-slate-400 capitalize">
                        {run.status} · {relativeDate(run.completedAt || run.createdAt)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3 border border-slate-200">
                <Activity size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No runs executed yet</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-xs">
                When your agents trigger on schedule or manual run, their outputs will stream here.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Templates & Workspace Banner */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.95fr)]">
        {/* Templates Panel */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quick Start Templates</h2>
              <p className="text-xs text-slate-500">Clone proven production recipes in one click</p>
            </div>
            <Link
              href="/dashboard/templates"
              className="text-xs font-semibold text-slate-900 hover:text-black inline-flex items-center gap-1"
            >
              <span>Browse all</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {agentTemplates.slice(0, 3).map((template, idx) => {
              const styles = [
                {
                  iconBg: "bg-sky-50 text-sky-600 border-sky-100",
                  cardBorder: "hover:border-sky-300 hover:shadow-sky-50",
                  tag: "Productivity",
                  tagBg: "bg-sky-50 text-sky-700 border-sky-100",
                },
                {
                  iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
                  cardBorder: "hover:border-indigo-300 hover:shadow-indigo-50",
                  tag: "Scheduling",
                  tagBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
                },
                {
                  iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
                  cardBorder: "hover:border-emerald-300 hover:shadow-emerald-50",
                  tag: "Sales & CRM",
                  tagBg: "bg-emerald-50 text-emerald-700 border-emerald-100",
                },
              ][idx] || {
                iconBg: "bg-slate-100 text-slate-700 border-slate-200/60",
                cardBorder: "hover:border-slate-300",
                tag: template.category,
                tagBg: "bg-slate-100 text-slate-600",
              };

              return (
                <Link
                  key={template.id}
                  href={`/dashboard/agents?template=${template.id}`}
                  className={`group rounded-xl border border-slate-200/80 p-4 hover:shadow-sm transition-all flex flex-col justify-between bg-white ${styles.cardBorder}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${styles.iconBg}`}>
                        {idx === 0 ? <Bot size={16} /> : idx === 1 ? <CalendarClock size={16} /> : <Layers3 size={16} />}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${styles.tagBg}`}>
                        {styles.tag}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-900 group-hover:text-indigo-600">
                    <span>Use template</span>
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Dark Obsidian Banner (matching the hero "Agent command" style) */}
        <section className="relative rounded-2xl bg-[#090d16] border border-slate-800 p-6 text-white overflow-hidden shadow-lg flex flex-col justify-between">
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/15 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-purple-500/15 blur-2xl"
            aria-hidden="true"
          />

          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
              <Sparkles size={16} className="text-cyan-300" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Ready to scale automation?
            </h2>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-xs font-normal">
              Equip agents with custom webhooks, browserbase stealth browsing, and automated schedules.
            </p>
          </div>

          <div className="relative mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">
              100 credits included
            </span>
            <Link
              href="/dashboard/agents"
              className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-4 py-2 rounded-full text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>+ Create Agent</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </div>

      {failed > 0 && (
        <Link
          href="/dashboard/run"
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700"
        >
          <CircleAlert size={14} />
          <span>{failed} run{failed === 1 ? "" : "s"} encountered issues. View run history →</span>
        </Link>
      )}
    </div>
  );
}
