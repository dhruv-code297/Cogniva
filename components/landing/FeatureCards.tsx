"use client";

import React from "react";
import { Bot, Calendar, Blocks, ArrowRight } from "lucide-react";
import Link from "next/link";

export function FeatureCards() {
  const features = [
    {
      title: "Build focused agents",
      description:
        "Give every agent a goal, tools, instructions, and the exact output format your workflow expects.",
      icon: Bot,
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
      link: "/dashboard/agents",
    },
    {
      title: "Schedule real work",
      description:
        "Run agents once, daily, weekly, or on the cadence that keeps your team moving without manual check-ins.",
      icon: Calendar,
      badgeColor: "bg-sky-50 text-sky-600 border-sky-200/80",
      link: "/dashboard/run",
    },
    {
      title: "Connect your stack",
      description:
        "Wire agents into integrations so they can read, write, and execute tasks across the tools you already use.",
      icon: Blocks,
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200/80",
      link: "/dashboard/integrations",
    },
  ];

  return (
    <section className="relative py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon badge matching reference */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border mb-6 transition-transform duration-200 group-hover:scale-105 ${feature.badgeColor}`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-slate-950">
                  <Link href={feature.link} className="inline-flex items-center gap-1.5 hover:underline">
                    <span>Explore feature</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
