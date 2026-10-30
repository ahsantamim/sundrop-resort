import { Mark, siteUrls } from "@sundrop/ui";
import { FileText, FolderKanban, LayoutDashboard, LogOut, ScrollText, UserRound, Wallet } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutInvestor } from "@/lib/actions";
import { loadPortal } from "@/lib/session";
import { NavLink } from "./nav-link";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/" style={{ marginBottom: 12 }}>
          <Mark />
          <b style={{ display: "block", marginTop: 8 }}>SUNDROP</b>
          <small style={{ letterSpacing: ".2em" }}>INVESTOR CIRCLE</small>
        </Link>
        <NavLink href="/"><LayoutDashboard size={16} /> Overview</NavLink>
        <NavLink href="/projects"><FolderKanban size={16} /> My projects</NavLink>
        <NavLink href="/applications"><ScrollText size={16} /> Applications</NavLink>
        <NavLink href="/payments"><Wallet size={16} /> Payments</NavLink>
        <NavLink href="/documents"><FileText size={16} /> Documents</NavLink>
        <NavLink href="/profile"><UserRound size={16} /> Profile</NavLink>
        <form action={signOutInvestor} style={{ marginTop: "auto" }}>
          <button type="submit"><LogOut size={16} /> Sign out</button>
        </form>
        <a href={siteUrls.web}>← Resort site</a>
      </aside>
      <div className="main">
        <p className="sample">Demo figures · not performance</p>
        <p className="muted">{portal.investor.name} · {portal.investor.code} · {portal.investor.tier}</p>
        {children}
      </div>
    </div>
  );
}
