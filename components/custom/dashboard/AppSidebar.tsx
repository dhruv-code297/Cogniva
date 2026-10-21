"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useContext, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Blocks,
  Bot,
  LayoutDashboard,
  Menu,
  Settings2,
  Shapes,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { CognivaLogo } from "@/components/brand/CognivaLogo";
import { UserDetailContext } from "@/context/UserDetailContext";

const mainNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agents", href: "/dashboard/agents", icon: Bot },
  { label: "Runs", href: "/dashboard/run", icon: Activity },
  { label: "Integrations", href: "/dashboard/integrations", icon: Blocks },
  { label: "Templates", href: "/dashboard/templates", icon: Shapes },
];

const accountNav = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings2 },
  { label: "Profile", href: "/dashboard/profile", icon: UserRound },
];

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { userDetail } = useContext(UserDetailContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = [...mainNav, ...accountNav].find((item) => item.href === pathname)?.label ?? "Workspace";

  const renderNav = (items: typeof mainNav) =>
    items.map((item) => {
      const selected = pathname === item.href;
      const Icon = item.icon;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          aria-current={selected ? "page" : undefined}
          className={`cog-nav-link ${selected ? "is-active" : ""}`}
        >
          <Icon size={17} strokeWidth={selected ? 2.2 : 1.8} />
          <span>{item.label}</span>
          {selected && <span className="cog-nav-active-dot" />}
        </Link>
      );
    });

  return (
    <div className="cog-app-shell">
      {/* Mobile scrim */}
      {mobileOpen && (
        <button
          className="cog-sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`cog-sidebar ${mobileOpen ? "is-open" : ""}`}>
        {/* Brand header */}
        <div className="cog-sidebar-brand">
          <CognivaLogo
            size={34}
            href="/dashboard"
            wordmarkClassName="text-xl font-bold tracking-tight text-slate-900"
          />
          <button
            className="cog-mobile-close p-1.5 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace Pill */}
        <div className="cog-workspace-switch">
          <span className="cog-workspace-mark">
            <Sparkles size={15} className="text-cyan-400" />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block truncate">Cogniva Workspace</strong>
            <small className="block text-slate-500 font-medium text-[11px]">
              AI Automation Studio
            </small>
          </div>
        </div>

        {/* Nav lists */}
        <div className="cog-sidebar-scroll">
          <div className="cog-nav-group">
            <p className="cog-nav-label">WORKSPACE</p>
            {renderNav(mainNav)}
          </div>
          <div className="cog-nav-group">
            <p className="cog-nav-label">ACCOUNT</p>
            {renderNav(accountNav)}
          </div>
        </div>

        {/* Bottom card & profile */}
        <div className="cog-sidebar-bottom">
          <div className="cog-usage-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                Usage Credits
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {userDetail?.usageCredits ?? "100"} left
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-1">
              <strong className="text-2xl font-black text-slate-950 tracking-tight">
                {userDetail?.usageCredits ?? "100"}
              </strong>
              <span className="text-[11px] text-slate-500">/ 100 credits</span>
            </div>
            <div className="cog-usage-track">
              <span
                style={{
                  width: `${Math.max(0, Math.min(100, Number(userDetail?.usageCredits ?? 100)))}%`,
                }}
              />
            </div>
            <Link
              href="/dashboard/settings"
              className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-950 hover:underline"
            >
              <span>Manage credits & plan</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="cog-sidebar-user">
            <UserButton appearance={{ elements: { avatarBox: "!size-8" } }} />
            <Link href="/dashboard/profile" className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-slate-900">
                {user?.fullName || userDetail?.name || "Your Profile"}
              </span>
              <span className="block truncate text-[11px] text-slate-500">
                {user?.primaryEmailAddress?.emailAddress || "Workspace Member"}
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="cog-main-frame">
        {/* Topbar */}
        <header className="cog-topbar">
          <div className="flex items-center gap-3">
            <button
              className="cog-menu-button p-1.5 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <span className="hidden text-xs text-slate-400 font-medium lg:block">
              Cogniva
            </span>
            <span className="hidden text-slate-300 lg:block">/</span>
            <span className="text-sm font-semibold text-slate-900">
              {active}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/agents"
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-all hover:-translate-y-0.5"
            >
              <Bot size={14} />
              <span>+ New Agent</span>
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <UserButton appearance={{ elements: { avatarBox: "!size-8" } }} />
          </div>
        </header>

        {/* Page children */}
        <main className="cog-main-content">{children}</main>
      </div>
    </div>
  );
}
