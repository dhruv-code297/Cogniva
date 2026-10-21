"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Activity, ArrowRight, CircleAlert, Loader2, RotateCw } from "lucide-react";
import RecentRuns from "@/components/custom/run/RecentRuns";
import Stats from "@/components/custom/run/Stats";

export type AgentRunType = {
  id: string;
  agentId: string;
  email: string;
  status: string;
  output: unknown;
  error: unknown;
  completedAt: string;
  createdAt: string;
  name: string;
  agentImage: string;
  task: string;
};

export default function RunPage() {
  const [runs, setRuns] = useState<AgentRunType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadRuns = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/agent/log");
      setRuns(Array.isArray(result.data) ? result.data : []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Execution Runs & Telemetry
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-normal max-w-xl">
            Inspect real-time logs, intermediate tool reasoning, outputs, and status signals across your agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadRuns}
            disabled={loading}
            className="cog-secondary-button cursor-pointer"
          >
            <RotateCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <Link href="/dashboard/agents" className="cog-primary-button">
            <span>Manage Agents</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stats summary */}
      <Stats
        completed={runs.filter((run) => run.status === "completed").length}
        failed={runs.filter((run) => run.status === "failed").length}
        scheduled={runs.filter((run) => run.status === "scheduled").length}
      />

      {/* Runs List Table */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white flex min-h-60 items-center justify-center gap-2.5 text-xs font-semibold text-slate-500 shadow-xs">
          <Loader2 size={18} className="animate-spin text-slate-900" />
          <span>Streaming execution logs...</span>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-12 text-center flex flex-col items-center">
          <CircleAlert size={26} className="text-rose-600" />
          <h2 className="mt-3 text-sm font-bold text-slate-900">
            Failed to load run history
          </h2>
          <p className="mt-1 text-xs text-slate-500 max-w-xs">
            There was a temporary problem connecting to the database.
          </p>
          <button onClick={loadRuns} className="cog-secondary-button mt-4">
            Try again
          </button>
        </div>
      ) : (
        <RecentRuns agentRunList={runs} />
      )}
    </div>
  );
}
