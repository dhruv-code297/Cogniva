"use client";

import React from "react";
import {
  ShieldCheck,
  Eye,
  RefreshCw,
  Lock,
  UserCheck,
  Cpu,
  History,
  FileCheck2,
} from "lucide-react";

export function ControlSection() {
  const pillars = [
    {
      title: "Human-in-the-Loop Gates",
      desc: "Specify sensitive actions (like sending outbound emails, modifying CRM deals, or billing changes) that require 1-click human approval via Slack or dashboard before firing.",
      icon: UserCheck,
      badge: "Zero Unintended Actions",
    },
    {
      title: "Durable State & Self-Healing",
      desc: "Powered by durable step queues. If an external API rate-limits or an endpoint blips, the agent pauses safely and resumes right where it left off.",
      icon: RefreshCw,
      badge: "No Zombie Loops",
    },
    {
      title: "Granular Trace Observability",
      desc: "Inspect every thought, token count, tool payload, and latency graph. Audit trails are fully exportable for compliance and security reviews.",
      icon: Eye,
      badge: "Full Audit Logs",
    },
    {
      title: "Enterprise Vault Isolation",
      desc: "Keys and credentials are encrypted at rest with AES-256 and never shared across tenants. Your customer data is never used to train foundational models.",
      icon: Lock,
      badge: "SOC-2 Ready Architecture",
    },
  ];

  return (
    <section id="security" className="relative py-16 md:py-24 bg-[#fbfcfe] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            <span>Operational Safety & Guardrails</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            Autonomous power with absolute human oversight
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            We built Cogniva for real-world production environments where reliability, confidentiality, and deterministic control matter.
          </p>
        </div>

        {/* 4 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Configurable per agent in your workspace</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
