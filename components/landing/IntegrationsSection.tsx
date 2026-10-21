"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Blocks,
  ArrowRight,
  Check,
  Globe,
  Database,
  Mail,
  MessageSquare,
  FileText,
  CreditCard,
  Code2,
  Calendar,
  Lock,
} from "lucide-react";

interface IntegrationItem {
  name: string;
  category: string;
  desc: string;
  badge: string;
  icon: any;
  color: string;
}

export function IntegrationsSection() {
  const integrations: IntegrationItem[] = [
    {
      name: "Browserbase",
      category: "Web & Headless Browsers",
      desc: "Cloud stealth Chrome sessions to scrape, fill forms, and solve complex dynamic web flows.",
      badge: "Native SDK",
      icon: Globe,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      name: "HubSpot",
      category: "CRM & Sales",
      desc: "Bi-directional contact syncing, deal stage progression, and automated note creation.",
      badge: "OAuth 2.0",
      icon: FileText,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      name: "Slack",
      category: "Communication",
      desc: "Stream real-time alerts, trigger agents via slash commands, and request one-tap human approvals.",
      badge: "Interactive Bot",
      icon: MessageSquare,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      name: "Gmail & Google Suite",
      category: "Email & Productivity",
      desc: "Read thread contexts, draft replies safely in drafts folder, and coordinate calendar slots.",
      badge: "Verified OAuth",
      icon: Mail,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      name: "GitHub",
      category: "Developer Tools",
      desc: "Review pull requests, triage issues, run security linting, and automate repository maintenance.",
      badge: "Webhooks + App",
      icon: Code2,
      color: "bg-slate-100 text-slate-800 border-slate-300",
    },
    {
      name: "PostgreSQL & Neon",
      category: "Databases",
      desc: "Execute read-only queries with parameterized safety, verify schemas, and sync state securely.",
      badge: "Encrypted Pooler",
      icon: Database,
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
    {
      name: "Linear",
      category: "Issue Tracking",
      desc: "Automatically sync user bugs to project cycles, update roadmaps, and triage customer feedback.",
      badge: "Bi-directional",
      icon: Calendar,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      name: "Stripe",
      category: "Billing & Revenue",
      desc: "Inspect customer MRR tiers, invoice failures, and trigger proactive retention workflows.",
      badge: "Restricted Keys",
      icon: CreditCard,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  ];

  return (
    <section id="integrations" className="relative py-16 md:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide uppercase mb-3">
            <Blocks className="w-3.5 h-3.5 text-slate-700" />
            <span>Connected Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            Connects natively to every tool you already rely on
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            No brittle custom glue code. Plug in your credentials with OAuth or secure environment vaults and let agents interact safely with your APIs.
          </p>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {integrations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}
                    >
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-2.5">
                    {item.category}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                    <Check className="w-3 h-3" /> Ready to connect
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean integrations footer notice without 100+ tools */}
        <div className="mt-10 p-6 rounded-2xl border border-slate-200/90 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Custom webhooks & private endpoints</h4>
              <p className="text-xs text-slate-600">Cogniva supports standard OpenAPI specs, cURL endpoints, and secure TypeScript tools.</p>
            </div>
          </div>
          <Link
            href="/dashboard/integrations"
            className="shrink-0 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-900 font-semibold px-4 py-2 rounded-full text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <span>Explore integrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
