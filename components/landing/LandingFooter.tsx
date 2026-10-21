"use client";

import React from "react";
import Link from "next/link";
import { CognivaLogo } from "@/components/brand/CognivaLogo";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2">
            <CognivaLogo
              size={36}
              wordmarkClassName="font-bold text-xl text-slate-900 tracking-tight"
              href="/"
            />
            <p className="mt-4 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Autonomous AI agent platform built for reliable, everyday operations. Automate repeatable workflows, schedule cloud workers, and orchestrate tools safely.
            </p>

            {/* Live Operational Beacon */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All systems operational</span>
            </div>
          </div>

          {/* Col 1: Product */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="#agents" className="hover:text-slate-950 transition-colors">
                  Autonomous Agents
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-slate-950 transition-colors">
                  Security & Controls
                </Link>
              </li>
              <li>
                <Link href="#integrations" className="hover:text-slate-950 transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/dashboard/templates" className="hover:text-slate-950 transition-colors">
                  Template Library
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-slate-950 transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Sales Triage & CRM
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Market Watchdog
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  GitHub PR Reviewer
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Customer Email Scout
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Browserbase Scraper
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Trust */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-950 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Cogniva Inc. All rights reserved. Built for autonomous agent operations.
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://github.com" target="_blank" className="hover:text-slate-700 transition-colors">
              GitHub
            </Link>
            <Link href="https://x.com" target="_blank" className="hover:text-slate-700 transition-colors">
              Twitter / X
            </Link>
            <Link href="https://discord.com" target="_blank" className="hover:text-slate-700 transition-colors">
              Discord Community
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
