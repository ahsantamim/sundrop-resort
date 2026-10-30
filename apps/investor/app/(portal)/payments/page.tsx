import { formatBdt } from "@sundrop/ui";
import { loadPortal } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Payment history</h1>
      <p className="sample">Placeholder amounts · nothing was paid</p>
      <table>
        <thead><tr><th>Reference</th><th>Date</th><th>Description</th><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          {portal.payouts.map((payout) => (
            <tr key={payout.id}>
              <td>{payout.id}</td><td>{payout.date}</td><td>{payout.description}</td><td>{payout.projectName}</td><td>{formatBdt(payout.amount)}</td><td>{payout.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
