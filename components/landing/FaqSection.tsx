"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: "How do scheduled runs execute when my computer is closed?",
      answer:
        "Cogniva runs entirely in secure cloud worker sandboxes with durable orchestration (via Inngest and background workers). Once an agent is set to a cadence (e.g. daily at 8 AM or every 15 minutes), it triggers automatically in the cloud regardless of whether your device is online.",
    },
    {
      question: "How does Cogniva prevent infinite loops or burning through credits?",
      answer:
        "Every agent workflow runs with configurable hard limits: maximum step depth (e.g. 15 tool executions), token budget caps, and execution timeouts. If an agent encounters repetitive states or unexpected tool errors, it triggers a graceful failover or pauses for human intervention rather than spinning endlessly.",
    },
    {
      question: "Which LLM models power Cogniva agents? Can I bring my own keys?",
      answer:
        "Cogniva defaults to state-of-the-art reasoning models including Claude 3.5 Sonnet, OpenAI GPT-4o, and Google Gemini 2.0 Flash. Pro and Enterprise workspaces can configure custom BYOK (Bring Your Own Key) connections to run against private enterprise agreements with zero markup.",
    },
    {
      question: "How do human-in-the-loop approval gates function?",
      answer:
        "You can tag any high-stakes tool action (such as sending a marketing blast, deleting a record, or executing a transaction) as 'Gated'. When the agent reaches this step, it sends an interactive message with full context to your Slack channel or dashboard with 'Approve' and 'Reject' buttons. The agent waits patiently and only executes upon authorization.",
    },
    {
      question: "How does browser automation handle bot blocks, CAPTCHAs, and dynamic sites?",
      answer:
        "We integrate natively with Browserbase to spin up cloud-hosted, fingerprint-masked headless Chromium instances with residential proxies. Agents can wait for complex SPA hydration, scroll, interact with forms, and extract live data without triggering anti-bot hurdles.",
    },
    {
      question: "Is my workspace data used to train AI models?",
      answer:
        "Never. All customer data, tool inputs, credentials, and agent trajectories are strictly quarantined within your workspace tenant. We maintain zero-data-retention agreements with foundational LLM providers, ensuring your company secrets remain private.",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-[#fbfcfe] border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide uppercase mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-slate-700" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-base text-slate-600 font-normal">
            Everything you need to know about setting up, securing, and automating workflows with Cogniva.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-slate-200" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 text-slate-700" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
