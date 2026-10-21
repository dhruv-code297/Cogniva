"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, Plus, Shapes, Sparkles } from "lucide-react";
import CreateAgent from "@/components/custom/agents/CreateAgent";
import MyAgents from "@/components/custom/agents/MyAgents";

export default function AgentsPage() {
  const [tab, setTab] = useState<"create" | "my-agents">("create");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Deploy & Manage Agents
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-normal max-w-xl">
            Configure agent instructions, connect tools via Composio, schedule cron cadences, and review live runs.
          </p>
        </div>

        <Link href="/dashboard/templates" className="cog-secondary-button">
          <Shapes size={14} />
          <span>Browse Templates</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Pill Tabs Switcher */}
      <div className="inline-flex items-center gap-2 p-1 rounded-full bg-slate-100 border border-slate-200/80">
        <button
          onClick={() => setTab("create")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            tab === "create"
              ? "bg-slate-950 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-950"
          }`}
        >
          <Plus size={14} />
          <span>Create Agent</span>
        </button>

        <button
          onClick={() => setTab("my-agents")}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            tab === "my-agents"
              ? "bg-slate-950 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-950"
          }`}
        >
          <Bot size={14} />
          <span>My Agents</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tab === "create" ? <CreateAgent /> : <MyAgents />}
      </div>
    </div>
  );
}
