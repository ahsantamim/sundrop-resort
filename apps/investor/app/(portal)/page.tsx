import { formatBdt } from "@sundrop/ui";
import type { Metadata } from "next";
import { loadPortal } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  const invested = portal.holdings.reduce((sum, holding) => sum + holding.amount, 0);
  const shares = portal.holdings.reduce((sum, holding) => sum + holding.shares, 0);
  const received = portal.payouts.filter((payout) => payout.status === "paid").reduce((sum, payout) => sum + payout.amount, 0);
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 48 }}>Good evening, {portal.investor.name.split(" ")[0]}.</h1>
      <p className="muted">Sample portfolio. Relationship manager on the drawing: {portal.manager.name} · {portal.manager.phone} (placeholder).</p>
      <div className="cards">
        <article className="card"><span>Sample amount invested</span><b>{formatBdt(invested)}</b></article>
        <article className="card"><span>Sample shares</span><b>{shares}</b></article>
        <article className="card"><span>Sample distributions marked paid</span><b>{formatBdt(received)}</b></article>
        <article className="card"><span>Quarterly notes</span><b>{portal.documents.length}</b></article>
      </div>
      <h2>Project progress</h2>
      <div className="cards" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {portal.holdings.map((holding) => (
          <article className="card" key={holding.id}>
            <b style={{ fontSize: 22 }}>{holding.project.name}</b>
            <span>{holding.shares} sample shares · {formatBdt(holding.amount)}</span>
            <p className="muted">{holding.project.milestones.map((milestone) => milestone.state).join(" · ")}</p>
          </article>
        ))}
      </div>
      <h2>Recent sample payouts</h2>
      <table>
        <thead><tr><th>Date</th><th>Description</th><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {portal.payouts.map((payout) => (
            <tr key={payout.id}>
              <td>{payout.date}</td>
              <td>{payout.description}</td>
              <td>{payout.projectName}</td>
              <td>{formatBdt(payout.amount)}</td>
              <td>{payout.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
