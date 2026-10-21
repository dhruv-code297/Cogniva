import React from "react";
import { CalendarClock, CircleCheck, CircleX } from "lucide-react";

export default function Stats({
  completed,
  failed,
  scheduled,
}: {
  completed?: number;
  failed?: number;
  scheduled?: number;
}) {
  const items = [
    {
      label: "Completed",
      value: completed ?? 0,
      icon: CircleCheck,
      cardBg: "bg-gradient-to-br from-emerald-50/70 via-white to-white border-emerald-100 hover:border-emerald-200",
      iconBg: "bg-emerald-600 text-white shadow-xs shadow-emerald-200",
      labelColor: "text-emerald-900/70",
    },
    {
      label: "Scheduled",
      value: scheduled ?? 0,
      icon: CalendarClock,
      cardBg: "bg-gradient-to-br from-violet-50/70 via-white to-white border-violet-100 hover:border-violet-200",
      iconBg: "bg-violet-600 text-white shadow-xs shadow-violet-200",
      labelColor: "text-violet-900/70",
    },
    {
      label: "Failed",
      value: failed ?? 0,
      icon: CircleX,
      cardBg: "bg-gradient-to-br from-rose-50/70 via-white to-white border-rose-100 hover:border-rose-200",
      iconBg: "bg-rose-600 text-white shadow-xs shadow-rose-200",
      labelColor: "text-rose-900/70",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={`rounded-2xl border p-5 shadow-xs flex items-center gap-4 hover:shadow-md transition-all duration-200 ${item.cardBg}`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
            >
              <Icon size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span className="block text-2xl font-black text-slate-950 tracking-tight leading-none">
                {item.value}
              </span>
              <span className={`mt-1 block text-xs font-semibold ${item.labelColor}`}>
                {item.label} Runs
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
