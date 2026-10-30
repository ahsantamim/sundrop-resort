import { Mark, siteUrls } from "@sundrop/ui";
import { BedDouble, CalendarCheck, FolderKanban, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAdmin } from "@/lib/actions";
import { loadAdmin } from "@/lib/session";
import { NavLink } from "./nav-link";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const auth = await loadAdmin();
  if (!auth) redirect("/login");
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/">
          <Mark />
          <b style={{ display: "block" }}>SUNDROP</b>
          <small>ADMIN CONSOLE</small>
        </Link>
        <NavLink href="/"><LayoutDashboard size={16} /> Dashboard</NavLink>
        <NavLink href="/bookings"><CalendarCheck size={16} /> Bookings</NavLink>
        <NavLink href="/requests"><Inbox size={16} /> Requests</NavLink>
        <NavLink href="/rooms"><BedDouble size={16} /> Rooms</NavLink>
        <NavLink href="/projects"><FolderKanban size={16} /> Projects</NavLink>
        <form action={signOutAdmin}><button type="submit"><LogOut size={16} /> Sign out</button></form>
        <a href={siteUrls.web}>Resort site</a>
        <a href={siteUrls.investor}>Investor demo</a>
      </aside>
      <div className="main">
        <p className="sample">Demo data · decisions write to the shared JSON store</p>
        <p>{auth.admin.name} · {auth.admin.role}</p>
        {children}
      </div>
    </div>
  );
}
