import { formatNumber } from "@sundrop/ui";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Status } from "@/components/portal/status";
import { loadPortal } from "@/lib/session";

export const metadata: Metadata = { title: "Requests" };

export default async function ApplicationsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  const inReview = portal.applications.filter((application) => application.status === "under_review").length;
  const shares = portal.applications.reduce((sum, application) => sum + application.shares, 0);
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="kicker">Requests</p>
          <h1>Applications</h1>
        </div>
        <p className="note">Shown when the public form uses {portal.investor.email}. Other requests stay in the admin inbox.</p>
      </div>
      <section className="stats-bar cols-3" aria-label="Request totals">
        <article><span>Requests</span><b>{formatNumber(portal.applications.length)}</b><small>On this email</small></article>
        <article><span>In review</span><b>{formatNumber(inReview)}</b><small>Still open</small></article>
        <article><span>Shares asked</span><b>{formatNumber(shares)}</b><small>Across requests</small></article>
      </section>
      <section className="panel">
        {portal.applications.length === 0 ? (
          <p className="empty">No requests on this email yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th className="num">Shares</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {portal.applications.map((application) => (
                  <tr key={application.id}>
                    <td className="mono">{application.id}</td>
                    <td>{application.projectName}</td>
                    <td className="num">{formatNumber(application.shares)}</td>
                    <td>{application.createdAt.slice(0, 10)}</td>
                    <td><Status value={application.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
