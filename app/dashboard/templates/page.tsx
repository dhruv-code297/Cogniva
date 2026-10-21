"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  CalendarDays,
  Code2,
  Inbox,
  Search,
  Shapes,
  Sparkles,
  Target,
} from "lucide-react";
import { agentTemplates } from "@/data/agentTemplates";

const icons = [Inbox, CalendarDays, Search, Target, Blocks, Code2];
const categories = ["All templates", "Productivity", "Research", "Sales", "Engineering"];

export default function TemplatesPage() {
  const [category, setCategory] = useState("All templates");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      agentTemplates.filter(
        (template) =>
          (category === "All templates" || template.category === category) &&
          `${template.name} ${template.description} ${template.tools.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [category, query]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Start from a proven workflow
          </h1>
          <p className="mt-2 text-sm text-slate-600 font-normal max-w-xl">
            Choose a battle-tested template, connect your tool credentials, and start running autonomous operations in minutes.
          </p>
        </div>

        <Link href="/dashboard/agents" className="cog-primary-button">
          <span>Create from scratch</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                category === item
                  ? "bg-slate-950 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full bg-slate-50 border border-slate-200/90 rounded-full pl-9 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search templates or tools..."
            aria-label="Search templates"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template) => {
            const Icon = icons[agentTemplates.indexOf(template)] || Shapes;
            const style = {
              Productivity: {
                badge: "bg-sky-50 text-sky-700 border-sky-200/70",
                iconBg: "bg-sky-50 text-sky-600 border-sky-100",
                hoverBorder: "hover:border-sky-300",
              },
              Research: {
                badge: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
                iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
                hoverBorder: "hover:border-indigo-300",
              },
              Sales: {
                badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
                iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
                hoverBorder: "hover:border-emerald-300",
              },
              Engineering: {
                badge: "bg-amber-50 text-amber-700 border-amber-200/70",
                iconBg: "bg-amber-50 text-amber-600 border-amber-100",
                hoverBorder: "hover:border-amber-300",
              },
            }[template.category] || {
              badge: "bg-slate-100 text-slate-700 border-slate-200/60",
              iconBg: "bg-slate-100 text-slate-800 border-slate-200/80",
              hoverBorder: "hover:border-slate-300",
            };

            return (
              <article
                key={template.id}
                className={`group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col p-6 ${style.hoverBorder}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`grid size-11 place-items-center rounded-xl border group-hover:scale-105 transition-transform ${style.iconBg}`}>
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${style.badge}`}>
                    {template.category}
                  </span>
                </div>

                <h2 className="mt-5 text-base font-bold tracking-tight text-slate-950 group-hover:text-indigo-600 transition-colors">
                  {template.name}
                </h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600 font-normal">
                  {template.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-1.5">
                  {template.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {tool}
                    </span>
                  ))}
                  <span className="ml-auto text-[11px] font-medium text-slate-400">
                    {template.cadence}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    Production ready
                  </span>
                  <Link
                    href={`/dashboard/agents?template=${template.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-950 hover:text-indigo-600 transition-colors"
                  >
                    <span>Use template</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs py-16 text-center">
          <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-500 mx-auto">
            <Shapes size={24} />
          </div>
          <h2 className="mt-4 text-sm font-bold text-slate-900">No templates found</h2>
          <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("All templates");
            }}
            className="cog-secondary-button mt-4"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
