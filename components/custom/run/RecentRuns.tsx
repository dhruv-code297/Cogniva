"use client";

import { useState } from "react";
import { Activity, ArrowUpRight, ChevronRight, Clock3, Search } from "lucide-react";
import { AgentRunType } from "@/app/dashboard/run/page";
import RunDetailsDialog from "./RunDetailsDialog";

const statusClass: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-rose-50 text-rose-700 border-rose-200",
  scheduled: "bg-purple-50 text-purple-700 border-purple-200",
  running: "bg-sky-50 text-sky-700 border-sky-200 animate-pulse",
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

export default function RecentRuns({ agentRunList }: { agentRunList: AgentRunType[] }) {
  const [selectedRun, setSelectedRun] = useState<AgentRunType | null>(null);

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      <div className="p-5 px-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Run History</h2>
          <p className="text-xs text-slate-500">
            {agentRunList.length} total execution{agentRunList.length === 1 ? "" : "s"} logged
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <Activity size={13} className="text-emerald-600" />
          <span>Real-time Ledger</span>
        </span>
      </div>

      {agentRunList.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Agent</th>
                <th className="px-6 py-3.5">Task Description</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Execution Time</th>
                <th className="px-6 py-3.5 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {agentRunList.map((run) => (
                <tr
                  key={run.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {run.name || "Agent"}
                  </td>
                  <td className="max-w-[280px] truncate px-6 py-4 text-slate-600 font-normal">
                    {run.task || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                        statusClass[run.status] || "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {run.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(run.completedAt || run.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedRun(run)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-black hover:underline cursor-pointer"
                    >
                      <span>View Trace</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 mb-3 border border-slate-200">
            <Clock3 size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No runs executed yet</h3>
          <p className="mt-1 max-w-xs text-xs text-slate-500 leading-relaxed">
            Runs will be recorded here automatically when your agents execute on a schedule or via manual trigger.
          </p>
          <a href="/dashboard/agents" className="cog-secondary-button mt-4">
            <span>Go to Agents</span>
            <ChevronRight size={14} />
          </a>
        </div>
      )}

      <RunDetailsDialog
        run={selectedRun}
        open={!!selectedRun}
        onOpenChange={(open) => {
          if (!open) setSelectedRun(null);
        }}
      />
    </section>
  );
}
