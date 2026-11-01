import { formatBdt, formatNumber } from "@sundrop/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Status } from "@/components/portal/status";
import { loadPortal } from "@/lib/session";

export const metadata: Metadata = { title: "Holdings" };

export default async function ProjectsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  const invested = portal.holdings.reduce((sum, holding) => sum + holding.amount, 0);
  const shares = portal.holdings.reduce((sum, holding) => sum + holding.shares, 0);
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="kicker">Holdings</p>
          <h1>Sample cap table</h1>
        </div>
        <p className="note">Percents are arithmetic on the demo share count. They are not a legal interest.</p>
      </div>
      <section className="stats-bar cols-3" aria-label="Holding totals">
        <article><span>Holdings</span><b>{formatNumber(portal.holdings.length)}</b><small>Open positions</small></article>
        <article><span>Shares</span><b>{formatNumber(shares)}</b><small>Across projects</small></article>
        <article><span>Invested</span><b>{formatBdt(invested)}</b><small>Sample capital</small></article>
      </section>
      <section className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Project</th>
                <th>Where</th>
                <th>Status</th>
                <th className="num">Your shares</th>
                <th className="num">Project shares</th>
                <th className="num">Your %</th>
                <th className="num">Amount</th>
                <th>Completion</th>
                <th>Latest milestone</th>
              </tr>
            </thead>
            <tbody>
              {portal.holdings.map((holding) => {
                const cap = holding.project.totalShares ? (holding.shares / holding.project.totalShares) * 100 : 0;
                const latest = holding.project.milestones.at(-1);
                return (
                  <tr key={holding.id}>
                    <td><b className="cell-title">{holding.project.name}</b></td>
                    <td>{holding.project.location}</td>
                    <td><Status value={holding.project.status} /></td>
                    <td className="num">{formatNumber(holding.shares)}</td>
                    <td className="num">{formatNumber(holding.project.totalShares)}</td>
                    <td className="num">{cap.toFixed(2)}%</td>
                    <td className="num">{formatBdt(holding.amount)}</td>
                    <td>{holding.project.completion}</td>
                    <td>{latest ? `${latest.label} · ${latest.state}` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
