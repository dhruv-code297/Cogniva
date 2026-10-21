"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers = [
    {
      name: "Starter",
      badge: "Free Forever",
      description: "Ideal for experimenting with personal automations and understanding agent behaviors.",
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        "100 starter execution credits",
        "Up to 3 active agent workflows",
        "Pre-built community templates",
        "Standard execution sandbox",
        "Web search & basic API calls",
        "Discord community support",
      ],
      ctaText: "Start for free",
      ctaLink: "/dashboard",
      isPopular: false,
    },
    {
      name: "Pro",
      badge: "Most Popular",
      description: "For founders, engineers, and operators who need dependable 24/7 background agents.",
      priceMonthly: 29,
      priceAnnual: 24,
      features: [
        "2,500 execution credits / mo",
        "Unlimited active agents",
        "Scheduled cron runs down to 1-min",
        "Browserbase stealth web automation",
        "Full tool stack (Gmail, Slack, HubSpot, GitHub)",
        "Human-in-the-loop Slack approval gates",
        "Priority execution queue",
      ],
      ctaText: "Launch with Pro",
      ctaLink: "/dashboard",
      isPopular: true,
    },
    {
      name: "Team & Enterprise",
      badge: "Scale & Security",
      description: "For teams requiring dedicated sandboxes, compliance assurances, and custom webhooks.",
      priceMonthly: 99,
      priceAnnual: 79,
      features: [
        "15,000+ execution credits",
        "Unlimited seats & shared agent workspaces",
        "Dedicated cloud browser pools",
        "Custom TypeScript tool integrations",
        "Audit logs & SOC-2 compliance pack",
        "Single Sign-On (SAML / Okta)",
        "Dedicated Slack channel with engineers",
      ],
      ctaText: "Contact Sales",
      ctaLink: "/dashboard",
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-16 md:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-slate-700" />
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            Predictable plans that scale with your work
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8">
            Start completely free with 100 credits. No credit card required. Upgrade as your agent fleet grows.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center gap-3 p-1 rounded-full bg-slate-100 border border-slate-200/80">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !annualBilling
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                annualBilling
                  ? "bg-slate-950 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual billing</span>
              <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => {
            const price = annualBilling ? tier.priceAnnual : tier.priceMonthly;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  tier.isPopular
                    ? "border-2 border-slate-900 bg-white shadow-xl ring-4 ring-slate-900/5 -translate-y-1"
                    : "border border-slate-200/90 bg-white shadow-xs hover:shadow-md"
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full shadow-xs">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                    {!tier.isPopular && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 mb-6 font-normal">
                    {tier.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-slate-950 tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      / month {annualBilling && price > 0 && "(billed annually)"}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
                    {tier.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={tier.ctaLink}
                  className={`w-full py-3 px-4 rounded-full font-semibold text-sm text-center flex items-center justify-center gap-2 transition-all ${
                    tier.isPopular
                      ? "bg-slate-950 hover:bg-slate-800 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-900"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
