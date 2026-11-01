import { formatBdt, formatNumber } from "@sundrop/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Status } from "@/components/portal/status";
import { loadPortal } from "@/lib/session";

export const metadata: Metadata = { title: "Payouts" };

export default async function PaymentsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  const paid = portal.payouts.filter((payout) => payout.status === "paid").reduce((sum, payout) => sum + payout.amount, 0);
  const scheduled = portal.payouts.filter((payout) => payout.status === "scheduled").reduce((sum, payout) => sum + payout.amount, 0);
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="kicker">Payouts</p>
          <h1>Sample ledger</h1>
        </div>
        <p className="note">Placeholder amounts. Nothing was transferred.</p>
      </div>
      <section className="stats-bar cols-3" aria-label="Payout totals">
        <article><span>Marked paid</span><b>{formatBdt(paid)}</b><small>{formatNumber(portal.payouts.filter((payout) => payout.status === "paid").length)} lines</small></article>
        <article><span>Scheduled</span><b>{formatBdt(scheduled)}</b><small>Not a commitment</small></article>
        <article><span>Lines</span><b>{formatNumber(portal.payouts.length)}</b><small>In this demo</small></article>
      </section>
      <section className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Date</th>
                <th>Description</th>
                <th>Project</th>
                <th className="num">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {portal.payouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="mono">{payout.id}</td>
                  <td>{payout.date}</td>
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
