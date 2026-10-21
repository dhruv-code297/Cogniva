"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative py-16 sm:py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 sm:p-12 rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/20 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
              READY WHEN YOU ARE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
              Launch an agent workspace in minutes.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2.5 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Go to dashboard</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
