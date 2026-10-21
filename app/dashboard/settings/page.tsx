"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  CalendarClock,
  Check,
  CreditCard,
  Globe2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";

const commonTimezones = [
  "UTC",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Australia/Sydney",
];

export default function SettingsPage() {
  const { userDetail } = useContext(UserDetailContext);
  const { openUserProfile } = useClerk();
  const [timezone, setTimezone] = useState("UTC");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTimezone(
      window.localStorage.getItem("cogniva-timezone") ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        "UTC"
    );
  }, []);

  const options = Array.from(new Set([timezone, ...commonTimezones]));

  const save = () => {
    window.localStorage.setItem("cogniva-timezone", timezone);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="mt-2 text-sm text-slate-600 font-normal max-w-xl">
          Manage scheduling defaults, connected tool integrations, and account authentication settings.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        {/* Left Column: Core Settings */}
        <div className="space-y-6">
          {/* Scheduling Preferences */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200/80">
                <CalendarClock size={18} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-950">Scheduling Defaults</h2>
                <p className="text-xs text-slate-500">Default execution timezone for newly deployed agents</p>
              </div>
            </div>

            <div className="p-6">
              <label htmlFor="timezone" className="block text-xs font-semibold text-slate-700 mb-2">
                Default timezone
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(event) => {
                    setTimezone(event.target.value);
                    setSaved(false);
                  }}
                  className="w-full sm:max-w-xs bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all"
                >
                  <option value={timezone}>{timezone.replaceAll("_", " ")}</option>
                  {options
                    .filter((item) => item !== timezone)
                    .map((item) => (
                      <option value={item} key={item}>
                        {item.replaceAll("_", " ")}
                      </option>
                    ))}
                </select>

                <button onClick={save} className="cog-primary-button shrink-0">
                  {saved ? <Check size={14} /> : <Globe2 size={14} />}
                  <span>{saved ? "Saved" : "Save preference"}</span>
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                New agent schedules use this timezone on this device. You can adjust each individual agent&apos;s schedule later.
              </p>
            </div>
          </section>

          {/* Connected Tools */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200/80">
                <Blocks size={18} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-950">Connected Integrations</h2>
                <p className="text-xs text-slate-500">Manage tool authorization tokens and third-party apps</p>
              </div>
            </div>

            <div className="p-6 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-md text-xs leading-relaxed text-slate-600">
                Your agents use authorized integrations like Gmail, Slack, GitHub, and PostgreSQL to execute workflows autonomously.
              </p>
              <Link href="/dashboard/integrations" className="cog-secondary-button">
                <span>Manage integrations</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>

          {/* Security & Access */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200/80">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-950">Account & Security</h2>
                <p className="text-xs text-slate-500">Identity verification, passkeys, and active sessions</p>
              </div>
            </div>

            <div className="p-6 flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-md text-xs leading-relaxed text-slate-600">
                Update your primary email address, password, two-factor authentication, and monitor active login sessions.
              </p>
              <button onClick={() => openUserProfile()} className="cog-secondary-button">
                <span>Account settings</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Usage & Profile Quick View */}
        <aside className="space-y-6">
          {/* Plan & Usage */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-slate-900" />
              <h2 className="text-sm font-bold text-slate-950">Plan & Usage Credits</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <span className="block text-2xl font-black text-slate-950 tracking-tight">
                  {userDetail?.usageCredits ?? "—"}
                </span>
                <span className="text-[11px] font-medium text-slate-500">Usage credits</span>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <span className="block text-2xl font-black text-slate-950 tracking-tight">
                  {userDetail?.agentCredits ?? "—"}
                </span>
                <span className="text-[11px] font-medium text-slate-500">Agent credits</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Available execution credits for running workflows and generating custom agents.
            </p>
          </section>

          {/* User Profile Card */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex items-center gap-2 mb-3">
              <UserRound size={18} className="text-slate-900" />
              <h2 className="text-sm font-bold text-slate-950">Your Profile</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage your display name, workspace avatar, and notification settings.
            </p>
            <Link
              href="/dashboard/profile"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-950 hover:text-slate-700 transition-colors"
            >
              <span>Edit profile</span>
              <ArrowRight size={13} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
