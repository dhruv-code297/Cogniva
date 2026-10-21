"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Check,
  CircleAlert,
  Loader2,
  PlugZap,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Tool = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  category?: string;
  connected: string;
  account?: { id: string } | null;
};

export default function IntegrationsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "connected">("all");
  const [query, setQuery] = useState("");

  const loadTools = async () => {
    try {
      const result = await axios.get("/api/integrations");
      setTools(Array.isArray(result.data) ? result.data : []);
      setError("");
    } catch {
      setError("Integrations could not be loaded. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const visible = useMemo(
    () =>
      tools.filter(
        (tool) =>
          (filter === "all" || tool.connected === "Connected") &&
          `${tool.name} ${tool.description || ""}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [tools, filter, query]
  );

  const connected = tools.filter((tool) => tool.connected === "Connected").length;

  const connect = async (slug: string) => {
    setBusy(slug);
    setError("");
    const popup = window.open("", "_blank");
    try {
      const result = await axios.post("/api/integrations/tool-connection", { slug });
      if (result.data?.redirectUrl) {
        if (popup) popup.location.href = result.data.redirectUrl;
        else window.location.href = result.data.redirectUrl;
      } else {
        popup?.close();
        throw new Error("No connection URL returned");
      }
    } catch {
      popup?.close();
      setError("Could not start the connection. Please try again.");
    } finally {
      setBusy("");
    }
  };

  const disconnect = async (tool: Tool) => {
    if (!tool.account?.id) return;
    setBusy(tool.slug);
    setError("");
    try {
      await axios.delete("/api/integrations/tool-connection", {
        data: { connectedAccountId: tool.account.id },
      });
      await loadTools();
    } catch {
      setError(`Could not disconnect ${tool.name}. Please try again.`);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Connected Tool Stack
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-normal max-w-xl">
            Authorize integrations via Composio OAuth. Your agents can read, write, and execute tasks across your connected accounts.
          </p>
        </div>

        <Link href="/dashboard/agents" className="cog-secondary-button">
          <span>Manage Agents</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Top metrics / info banner */}
      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1.5fr]">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-white p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white shadow-xs shadow-indigo-200 flex items-center justify-center shrink-0">
            <Blocks size={20} strokeWidth={2} />
          </div>
          <div>
            <strong className="block text-2xl font-black text-slate-950 tracking-tight leading-none">
              {tools.length}
            </strong>
            <span className="mt-1 block text-xs font-semibold text-indigo-900/70">
              Available Integrations
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white shadow-xs shadow-emerald-200 flex items-center justify-center shrink-0">
            <Check size={20} strokeWidth={2.5} />
          </div>
          <div>
            <strong className="block text-2xl font-black text-slate-950 tracking-tight leading-none">
              {connected}
            </strong>
            <span className="mt-1 block text-xs font-semibold text-emerald-900/70">
              Active Connections
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/60 via-white to-white p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-sky-600 text-white shadow-xs shadow-sky-200 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} strokeWidth={2} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Connections are securely sandboxed per workspace with encrypted OAuth token storage. Disconnect any integration at any time.
          </p>
        </div>
      </div>

      {/* Tools Directory Panel */}
      <section className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        {/* Panel Header & Search/Filters */}
        <div className="p-5 px-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tool Directory</h2>
            <p className="text-xs text-slate-500">
              Connect once, then equip any agent with the tools they need.
            </p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            {/* Filter Pills */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-100 border border-slate-200/80">
              <button
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-slate-950 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                All ({tools.length})
              </button>
              <button
                onClick={() => setFilter("connected")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filter === "connected"
                    ? "bg-slate-950 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                Connected ({connected})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                className="w-full h-9 pl-9 pr-3 rounded-full border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-950"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools..."
                aria-label="Search tools"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="m-5 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-medium text-rose-800">
            <CircleAlert size={15} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-60 items-center justify-center gap-2.5 text-xs font-semibold text-slate-500">
            <Loader2 size={18} className="animate-spin text-slate-900" />
            <span>Loading integrations...</span>
          </div>
        ) : visible.length ? (
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((tool) => (
              <article
                key={tool.id || tool.slug}
                className="flex flex-col justify-between rounded-xl border border-slate-200/90 p-5 hover:border-slate-300 hover:shadow-xs transition-all bg-white"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-center overflow-hidden">
                      {tool.icon ? (
                        <img src={tool.icon} alt="" className="w-6 h-6 object-contain" />
                      ) : (
                        <PlugZap size={20} className="text-slate-700" />
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        tool.connected === "Connected"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {tool.connected === "Connected" ? "Connected" : "Ready"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tool.description || "Connect this tool to empower agents with API capabilities."}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 capitalize">
                    {tool.category || "Integration"}
                  </span>

                  <button
                    disabled={busy === tool.slug}
                    onClick={() =>
                      tool.connected === "Connected"
                        ? disconnect(tool)
                        : connect(tool.slug)
                    }
                    className={`inline-flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      tool.connected === "Connected"
                        ? "text-rose-600 hover:underline"
                        : "text-slate-950 hover:text-slate-700 hover:underline"
                    } disabled:opacity-50`}
                  >
                    {busy === tool.slug ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : tool.connected === "Connected" ? (
                      "Disconnect"
                    ) : (
                      "Connect Account"
                    )}
                    {busy !== tool.slug && <ArrowUpRight size={13} />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <Search size={26} className="text-slate-400" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No integrations found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try a different keyword or view all tools.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="cog-secondary-button mt-4"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
