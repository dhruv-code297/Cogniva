"use client";

import Link from "next/link";
import { ArrowRight, Bot, CalendarClock, Check } from "lucide-react";
import { CreatedAgentType } from "./CreateAgent";

export default function NewAgentCard({
  createdAgent,
}: {
  createdAgent: CreatedAgentType | null;
  setUpdatedAgent: (value: CreatedAgentType) => void;
}) {
  if (!createdAgent) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50/60 px-5 py-3 text-xs font-semibold text-emerald-800">
        <Check size={15} className="text-emerald-600" />
        <span>Agent created successfully and ready for execution</span>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <span className="grid size-12 flex-none place-items-center rounded-xl border border-slate-200 bg-slate-100 text-slate-900 shadow-2xs">
          <Bot size={22} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-950">
              {createdAgent.name}
            </h3>
            <span className="rounded-full bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Active
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-slate-600 font-normal">
            {createdAgent.description}
          </p>

          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <CalendarClock size={13} className="text-slate-400" />
            <span>
              {createdAgent.schedule?.type === "recurring"
                ? `${createdAgent.schedule.frequency || "Recurring"}${
                    createdAgent.schedule.time
                      ? ` at ${createdAgent.schedule.time}`
                      : ""
                  }`
                : "On demand"}
            </span>
          </p>
        </div>

        <Link href="/dashboard/run" className="cog-secondary-button shrink-0">
          <span>View runs</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
