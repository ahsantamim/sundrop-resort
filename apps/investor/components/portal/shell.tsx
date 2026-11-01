"use client";

import { Mark, siteUrls } from "@sundrop/ui";
import {
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavLink } from "@/app/(portal)/nav-link";
import { ThemeToggle } from "@/components/portal/theme-toggle";

const links = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Holdings", icon: FolderKanban },
  { href: "/applications", label: "Requests", icon: ScrollText },
  { href: "/payments", label: "Payouts", icon: Wallet },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

export function PortalShell({
  investor,
  startCollapsed,
  signOut,
  children,
}: {
  investor: { name: string; email: string; code: string; tier: string };
  startCollapsed: boolean;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(startCollapsed);
  const initial = investor.name.trim().slice(0, 1).toUpperCase() || "S";

  function toggleNav() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `partner-nav=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className={collapsed ? "shell is-collapsed" : "shell"}>
      <aside className="side">
        <div className="brand-row">
          <Link href="/" className="brand" title="Sundrop partner portal">
            <Mark className="brand-mark" />
            <span className="brand-copy">
              <b>SUNDROP</b>
              <small>Partner portal</small>
            </span>
          </Link>
          <button
            className="collapse-btn press"
            type="button"
            onClick={toggleNav}
            aria-pressed={collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <p className="nav-kicker">Menu</p>
        <nav className="nav" aria-label="Partner portal">
          {links.map(({ href, label, icon: Icon }) => (
            <NavLink key={href} href={href} title={label}>
              <Icon size={18} strokeWidth={2} />
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="side-foot">
          <form action={signOut}>
            <button className="nav-btn press" type="submit" title="Sign out">
              <LogOut size={18} />
              <span className="nav-label">Sign out</span>
            </button>
          </form>
          <a className="quiet" href={siteUrls.web} title="Resort site">
            <ExternalLink size={16} />
            <span className="nav-label">Resort site</span>
          </a>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="desk">
            <strong>Partner desk</strong>
            <span className="desk-meta">{investor.code} · {investor.tier}</span>
          </div>
          <div className="who">
            <ThemeToggle />
            <div className="who-card">
              <span className="avatar" aria-hidden>{initial}</span>
              <span className="who-copy">
                <b>{investor.name}</b>
                <small>{investor.email}</small>
              </span>
            </div>
          </div>
        </header>
        <div className="canvas">{children}</div>
      </div>
    </div>
  );
}
