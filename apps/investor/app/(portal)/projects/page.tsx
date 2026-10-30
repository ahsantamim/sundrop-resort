import { formatBdt } from "@sundrop/ui";
import { loadPortal } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>My projects</h1>
      <p className="muted">Ownership percentages below are arithmetic on the sample cap table, not a legal interest.</p>
      {portal.holdings.map((holding) => (
        <article className="card" key={holding.id} style={{ marginBottom: 14 }}>
          <h2>{holding.project.name}</h2>
          <p>{holding.shares} of {holding.project.totalShares} sample shares · {formatBdt(holding.amount)} · {((holding.shares / holding.project.totalShares) * 100).toFixed(2)}% of the sample cap table</p>
          <ul>{holding.project.milestones.map((milestone) => <li key={milestone.label}>{milestone.label} — {milestone.state}</li>)}</ul>
        </article>
      ))}
    </>
  );
}
