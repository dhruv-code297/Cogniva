"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  CreditCard,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  UserCheck,
  UserRound,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const save = async () => {
    if (!user || !firstName.trim() || saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      setSaved(true);
      toast.add({
        title: "Profile updated successfully",
        type: "success",
      });
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.message ||
        "Could not save profile details. You can manage your profile directly via Clerk account settings.";
      setError(msg);
      toast.add({
        title: msg,
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header without badges */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Your Profile
        </h1>
        <p className="mt-2 text-sm text-slate-600 font-normal max-w-xl">
          Manage your personal details, workspace identity, and authentication security.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        {/* Left Column: Profile Card & Personal Details */}
        <div className="space-y-6">
          {/* Clean User Identity Card */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-700 shadow-2xs">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "User avatar"}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound size={28} className="text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-950">
                      {user?.fullName || (isLoaded ? "Workspace Member" : "Loading...")}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      <UserCheck size={11} className="text-emerald-600" />
                      Active
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-slate-500 font-medium">
                    {user?.primaryEmailAddress?.emailAddress || "Loading account..."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openUserProfile()}
                className="cog-secondary-button cursor-pointer shrink-0"
              >
                <span>Edit Clerk Profile</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </section>

          {/* Personal Details Form */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-950">Personal Details</h2>
              <p className="text-xs text-slate-500">
                Update how your name appears across notifications, agent logs, and workspace activities.
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                    htmlFor="first-name"
                  >
                    First name
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all"
                    id="first-name"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value);
                      setSaved(false);
                    }}
                    disabled={!isLoaded}
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                    htmlFor="last-name"
                  >
                    Last name
                  </label>
                  <input
                    className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-900 transition-all"
                    id="last-name"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                      setSaved(false);
                    }}
                    disabled={!isLoaded}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-slate-100 border border-slate-200 text-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium cursor-not-allowed"
                    id="email"
                    value={user?.primaryEmailAddress?.emailAddress || ""}
                    readOnly
                  />
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">
                  Email addresses are authenticated through Clerk security.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 p-3 rounded-xl"
                >
                  <CircleAlert size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <Check size={14} /> Changes saved
                  </span>
                )}
                <button
                  onClick={save}
                  disabled={!firstName.trim() || saving || !isLoaded}
                  className="cog-primary-button disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>Save changes</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Security & Preferences */}
        <aside className="space-y-6">
          {/* Security & Authentication */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-900 border border-slate-200/80">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-950">Security & Sign-in</h2>
                <p className="text-[11px] text-slate-500">Authentication & 2FA</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Manage your passkeys, multi-factor authentication, active login devices, and password settings.
            </p>

            <button
              onClick={() => openUserProfile()}
              className="cog-secondary-button mt-4 w-full cursor-pointer justify-between"
            >
              <span>Manage Security Settings</span>
              <ArrowUpRight size={13} />
            </button>
          </section>

          {/* Quick Shortcuts */}
          <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h2 className="text-sm font-bold text-slate-950 mb-3">
              Workspace Preferences
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Configure your default execution timezone, notification preferences, and external integrations.
            </p>

            <div className="space-y-2">
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-900"
              >
                <span>Default timezone & schedule</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
              <Link
                href="/dashboard/integrations"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-900"
              >
                <span>Connected tool credentials</span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
