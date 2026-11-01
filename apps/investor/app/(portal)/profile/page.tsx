import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadPortal } from "@/lib/session";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  const rows = [
    ["Name", portal.investor.name],
    ["Email", portal.investor.email],
    ["Mobile", portal.investor.mobile],
    ["Code", portal.investor.code],
    ["Tier", portal.investor.tier],
  ];
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="kicker">Account</p>
          <h1>Profile</h1>
        </div>
        <p className="note">Demo identity. Password change is left off so the published demo password keeps working.</p>
      </div>
      <section className="stats-bar cols-3" aria-label="Account summary">
        <article><span>Code</span><b>{portal.investor.code}</b><small>{portal.investor.tier}</small></article>
        <article><span>Holdings</span><b>{portal.holdings.length}</b><small>Open positions</small></article>
        <article><span>Documents</span><b>{portal.documents.length}</b><small>In the vault</small></article>
      </section>
      <div className="split equal">
        <section className="panel solid-navy">
          <header className="panel-h"><h2>Identity</h2></header>
          <dl className="kv">
            {rows.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </section>
        <section className="panel solid-teal">
          <header className="panel-h"><h2>Security</h2></header>
          <dl className="kv">
            <div><dt>Session</dt><dd>12 hours · httpOnly cookie</dd></div>
            <div><dt>Two-factor</dt><dd>Drawn in the design, not enforced</dd></div>
            <div><dt>Password</dt><dd>Demo password stays as published</dd></div>
            <div><dt>Manager</dt><dd>{portal.manager.name} · {portal.manager.phone}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}
