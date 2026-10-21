"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CircleAlert,
  Ellipsis,
  Loader2,
  MessageCircle,
  Pause,
  Pencil,
  Play,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreatedAgentType } from "./CreateAgent";
import AgentEditSheet from "./AgentEditSheet";
import AgentChatDrawer from "./AgentChatDrawer";
import DeleteAgent from "./DeleteAgent";

export default function MyAgents() {
  const [agents, setAgents] = useState<CreatedAgentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [editAgent, setEditAgent] = useState<CreatedAgentType | null>(null);
  const [chatAgent, setChatAgent] = useState<CreatedAgentType | null>(null);
  const [deleteId, setDeleteId] = useState<string>();

  const loadAgents = async () => {
    try {
      const result = await axios.get("/api/agent/configure");
      setAgents(Array.isArray(result.data) ? result.data : []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const toggleAgent = async (agent: CreatedAgentType) => {
    setBusyId(agent.agentId);
    try {
      await axios.put("/api/agent/configure", {
        ...agent,
        status: agent.status === "active" ? "pause" : "active",
      });
      await loadAgents();
      toast.add({
        title: agent.status === "active" ? "Agent paused" : "Agent activated",
        type: "success",
      });
    } catch (error: any) {
      toast.add({
        title: error?.response?.data?.error || "Unable to update agent",
        type: "error",
      });
    } finally {
      setBusyId("");
    }
  };

  const runAgent = async (agent: CreatedAgentType) => {
    setBusyId(agent.agentId);
    try {
      await axios.post("/api/agent/run", {
        agentConfig: agent,
        agentId: agent.agentId,
        input: null,
      });
      toast.add({ title: "Agent run started", type: "success" });
    } catch (error: any) {
      toast.add({
        title: error?.response?.data?.error || "Unable to run agent",
        type: "error",
      });
    } finally {
      setBusyId("");
    }
  };

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex min-h-60 items-center justify-center gap-2.5 text-xs font-medium text-slate-500">
        <Loader2 size={16} className="animate-spin text-slate-900" />
        <span>Loading workspace agents...</span>
      </div>
    );

  if (error)
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center py-12 text-center">
        <CircleAlert size={24} className="text-rose-600" />
        <h2 className="mt-3 text-sm font-bold text-slate-950">
          Agents could not be loaded
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          An error occurred while fetching your agents. Please try again.
        </p>
        <button onClick={loadAgents} className="cog-secondary-button mt-4">
          Try again
        </button>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
            <span>Configured Agents</span>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {agents.length}
            </span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage execution schedules, tool configurations, and monitor run statuses.
          </p>
        </div>
        <Link
          href="/dashboard/run"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-950 hover:text-slate-700 transition-colors"
        >
          <span>View run history</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {agents.length ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <article
              key={agent.agentId}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex min-h-[250px] flex-col p-6"
            >
              <div className="flex items-start justify-between">
                <div className="size-11 shrink-0 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-sky-50 p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                  {agent.agentImage ? (
                    <img
                      src={agent.agentImage}
                      alt={agent.name}
                      className="size-full object-cover rounded-lg"
                    />
                  ) : (
                    <Bot size={22} className="text-indigo-600" />
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`Actions for ${agent.name}`}
                    className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Ellipsis size={17} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => runAgent(agent)}>
                      <Play size={14} className="text-emerald-600" /> Run now
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleAgent(agent)}>
                      {agent.status === "active" ? (
                        <Pause size={14} className="text-amber-600" />
                      ) : (
                        <Play size={14} className="text-emerald-600" />
                      )}
                      {agent.status === "active" ? "Pause agent" : "Activate agent"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditAgent(agent)}>
                      <Pencil size={14} className="text-indigo-600" /> Edit agent
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setDeleteId(agent.agentId)}
                    >
                      <Trash2 size={14} /> Delete agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <h3 className="truncate text-base font-bold text-slate-950 group-hover:text-indigo-600 transition-colors">
                  {agent.name || "Untitled agent"}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                    agent.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {agent.status === "active" ? "Active" : "Paused"}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 min-h-9 text-xs leading-relaxed text-slate-600 font-normal">
                {agent.description || "No description provided."}
              </p>

              <div className="mt-auto flex items-center gap-1.5 pt-5 text-xs text-slate-500 font-medium">
                <CalendarClock size={13} className="text-slate-400" />
                <span>
                  {agent.schedule?.type === "recurring"
                    ? `${agent.schedule.frequency || "Recurring"}${
                        agent.schedule.time ? ` at ${agent.schedule.time}` : ""
                      }`
                    : agent.schedule?.type === "manual"
                    ? "On demand"
                    : "One time"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => runAgent(agent)}
                  disabled={busyId === agent.agentId}
                  className="cog-primary-button flex-1 disabled:opacity-50"
                >
                  {busyId === agent.agentId ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Play size={13} />
                  )}
                  <span>Run now</span>
                </button>

                <button
                  onClick={() => setChatAgent(agent)}
                  className="cog-secondary-button flex-1"
                >
                  <MessageCircle size={13} />
                  <span>Chat</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs mt-6 flex flex-col items-center px-6 py-16 text-center">
          <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-700">
            <Bot size={24} />
          </div>
          <h2 className="mt-4 text-sm font-bold text-slate-950">
            No agents in your workspace yet
          </h2>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
            Create your first autonomous agent from a custom prompt or launch one from our template library.
          </p>
          <Link href="/dashboard/templates" className="cog-secondary-button mt-5">
            <span>Explore templates</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {editAgent && (
        <AgentEditSheet
          agentConfig={editAgent}
          setUpdatedAgent={loadAgents}
          openSheet_={true}
          closeSheet={() => setEditAgent(null)}
        />
      )}

      <AgentChatDrawer
        agent={chatAgent}
        open={!!chatAgent}
        onOpenChange={(open) => {
          if (!open) setChatAgent(null);
        }}
      />

      <DeleteAgent
        openAlert={!!deleteId}
        closeAlert={(open: boolean) => {
          if (!open) setDeleteId(undefined);
        }}
        agentId={deleteId}
        refreshData={loadAgents}
      />
    </div>
  );
}
