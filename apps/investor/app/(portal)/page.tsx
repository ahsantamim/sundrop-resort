import { formatBdt, formatNumber } from "@sundrop/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Status } from "@/components/portal/status";
import { loadPortal } from "@/lib/session";

export const metadata: Metadata = { title: "Overview" };

function milestoneScore(state: string) {
  if (/done|complete/i.test(state)) return 100;
  const pct = /(\d+)\s*%/.exec(state);
  return pct ? Number(pct[1]) : 0;
}

export default async function OverviewPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  const invested = portal.holdings.reduce((sum, holding) => sum + holding.amount, 0);
  const shares = portal.holdings.reduce((sum, holding) => sum + holding.shares, 0);
  const received = portal.payouts.filter((payout) => payout.status === "paid").reduce((sum, payout) => sum + payout.amount, 0);
  const scheduled = portal.payouts.filter((payout) => payout.status === "scheduled").reduce((sum, payout) => sum + payout.amount, 0);
  const openRequests = portal.applications.filter((application) => application.status === "under_review").length;
  const stats = [
    ["Invested", formatBdt(invested), "Sample capital"],
    ["Shares", formatNumber(shares), "Across holdings"],
    ["Paid out", formatBdt(received), "Marked paid"],
    ["Scheduled", formatBdt(scheduled), "Next sample line"],
    ["Notes", formatNumber(portal.documents.length), "In the vault"],
    ["Requests", formatNumber(openRequests), "Still in review"],
  ] as const;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="kicker">Overview</p>
          <h1>Portfolio</h1>
        </div>
        <p className="note">Sample figures for {portal.investor.name}. Relationship manager {portal.manager.name} · {portal.manager.phone}</p>
      </div>

      <section className="stats-bar" aria-label="Portfolio totals">
        {stats.map(([label, value, hint]) => (
          <article key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>{hint}</small>
          </article>
        ))}
      </section>

      <div className="split">
        <section className="panel">
          <header className="panel-h">
            <h2>Holdings</h2>
            <Link className="text-link" href="/projects">Open table</Link>
          </header>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th className="num">Shares</th>
                  <th className="num">Of cap</th>
                  <th className="num">Amount</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {portal.holdings.map((holding) => {
                  const cap = holding.project.totalShares ? (holding.shares / holding.project.totalShares) * 100 : 0;
                  const scores = holding.project.milestones.map((milestone) => milestoneScore(milestone.state));
                  const progress = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
                  return (
                    <tr key={holding.id}>
                      <td>
                        <b className="cell-title">{holding.project.name}</b>
                        <span className="cell-sub">{holding.project.location}</span>
                      </td>
                      <td><Status value={holding.project.status} /></td>
                      <td className="num">{formatNumber(holding.shares)}</td>
                      <td className="num">{cap.toFixed(2)}%</td>
                      <td className="num">{formatBdt(holding.amount)}</td>
                      <td>
                        <span className="meter" title={`${progress}%`}><i style={{ width: `${progress}%` }} /></span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
        <div className="stack">
          <section className="panel solid-teal">
            <div className="panel-body">
              <p className="kicker">Relationship desk</p>
              <h2>{portal.manager.name}</h2>
              <p className="desk-phone">{portal.manager.phone}</p>
              <p className="fine">Placeholder contact. No call is placed from this demo.</p>
            </div>
          </section>
          <section className="panel solid-navy">
            <header className="panel-h"><h2>Allocation</h2></header>
            {portal.holdings.map((holding) => {
              const taken = holding.project.totalShares
                ? Math.round(((holding.project.soldShares + holding.project.reservedShares) / holding.project.totalShares) * 100)
                : 0;
              return (
                <div className="alloc" key={holding.id}>
                  <div><span>{holding.project.eyebrow}</span><b>{taken}%</b></div>
                  <span className="meter"><i style={{ width: `${taken}%` }} /></span>
                </div>
              );
            })}
          </section>
        </div>
      </div>

      <section className="panel">
        <header className="panel-h">
          <h2>Recent payouts</h2>
          <Link className="text-link" href="/payments">Full ledger</Link>
        </header>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Project</th>
                <th className="num">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {portal.payouts.map((payout) => (
                <tr key={payout.id}>
                  <td>{payout.date}</td>
                  <td className="mono">{payout.id}</td>
                  <td>{payout.description}</td>
                  <td>{payout.projectName}</td>
                  <td className="num">{formatBdt(payout.amount)}</td>
                  <td><Status value={payout.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
