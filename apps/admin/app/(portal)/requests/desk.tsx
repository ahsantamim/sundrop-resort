"use client";

import { Button, formatBdt } from "@sundrop/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { decideRequest } from "@/lib/actions";

type Row = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  shares: number;
  status: string;
  projectName: string;
  createdAt: string;
};

export function RequestDesk({ rows, priceByProject }: { rows: Row[]; priceByProject: Record<string, number> }) {
  const [note, setNote] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const router = useRouter();

  return (
    <table>
      <thead><tr><th>Request</th><th>Applicant</th><th>Project</th><th>Shares</th><th>Sample notion</th><th>Status</th><th></th></tr></thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.id}<br /><span style={{ color: "#4a5653" }}>{row.createdAt.slice(0, 10)}</span></td>
            <td>{row.name}<br />{row.email}<br />{row.mobile}</td>
            <td>{row.projectName}</td>
            <td>{row.shares}</td>
            <td>{formatBdt((priceByProject[row.projectName] ?? 0) * row.shares)}</td>
            <td><span className={`pill ${row.status}`}>{row.status}</span></td>
            <td>
              {row.status === "under_review" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="button" size="sm" disabled={pending === row.id} onClick={async () => {
                    setPending(row.id);
                    const result = await decideRequest(row.id, "approved");
                    setPending(null);
                    setNote(result.ok ? `${row.id} approved. Sample shares moved to allocated. No message sent.` : result.error);
                    if (result.ok) router.refresh();
                  }}>Approve</Button>
                  <Button type="button" size="sm" variant="ghost" disabled={pending === row.id} onClick={async () => {
                    setPending(row.id);
                    const result = await decideRequest(row.id, "declined");
                    setPending(null);
                    setNote(result.ok ? `${row.id} declined. Reserved sample shares released.` : result.error);
                    if (result.ok) router.refresh();
                  }}>Decline</Button>
                </div>
              ) : null}
            </td>
          </tr>
        ))}
        {note ? <tr><td colSpan={7}>{note}</td></tr> : null}
      </tbody>
    </table>
  );
}
