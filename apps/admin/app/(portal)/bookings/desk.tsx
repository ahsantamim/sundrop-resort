"use client";

import { Button, formatBdt } from "@sundrop/ui";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { decideBooking } from "@/lib/actions";

type Row = {
  id: string;
  reference: string;
  guestName: string;
  mobile: string;
  email: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  total: number;
  status: "pending" | "confirmed" | "cancelled" | "declined";
};

export function BookingDesk({ bookings }: { bookings: Row[] }) {
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "declined">("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(bookings[0]?.id ?? "");
  const [note, setNote] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const rows = useMemo(
    () => bookings.filter((booking) => {
      const statusOk = filter === "all" || booking.status === filter;
      const hay = `${booking.reference} ${booking.guestName} ${booking.villaName} ${booking.email}`.toLowerCase();
      return statusOk && hay.includes(q.toLowerCase());
    }),
    [bookings, filter, q],
  );
  const current = rows.find((booking) => booking.id === selected) ?? rows[0];

  async function act(status: "confirmed" | "declined") {
    if (!current) return;
    setPending(true);
    const result = await decideBooking(current.id, status);
    setPending(false);
    setNote(result.ok ? `Updated ${current.reference} to ${status}. No guest message was sent.` : result.error);
    if (result.ok) router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {(["all", "pending", "confirmed", "cancelled", "declined"] as const).map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} style={{ borderRadius: 999, border: "1px solid #e6ded0", padding: "8px 12px", background: filter === item ? "#0b4f4a" : "white", color: filter === item ? "white" : "#1c2422", fontWeight: 700 }}>
            {item}
          </button>
        ))}
        <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search guests or references" aria-label="Search bookings" style={{ borderRadius: 999, border: "1px solid #e6ded0", padding: "8px 14px" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(260px, .7fr)", gap: 16 }}>
        <table>
          <thead><tr><th>Booking</th><th>Guest</th><th>Villa</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((booking) => (
              <tr key={booking.id} className={current?.id === booking.id ? "pick" : ""} onClick={() => setSelected(booking.id)} style={{ cursor: "pointer" }}>
                <td>{booking.reference}</td>
                <td>{booking.guestName}<br /><span style={{ color: "#4a5653" }}>{booking.mobile}</span></td>
                <td>{booking.villaName}</td>
                <td>{booking.checkIn} → {booking.checkOut}</td>
                <td>{formatBdt(booking.total)}</td>
                <td><span className={`pill ${booking.status}`}>{booking.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {current ? (
          <aside className="card">
            <p className="sample">Sample total</p>
            <h2 style={{ marginTop: 8 }}>{current.reference}</h2>
            <p><span className={`pill ${current.status}`}>{current.status}</span></p>
            <p>{current.villaName}<br />{current.checkIn} → {current.checkOut} · {current.nights} nights · {current.adults} adults</p>
            <p>{current.guestName}<br />{current.mobile}<br />{current.email}</p>
            <p>{formatBdt(current.total)} sample · due nowhere</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Button type="button" size="sm" disabled={pending || current.status === "cancelled"} onClick={() => act("confirmed")}>Confirm booking</Button>
              <Button type="button" size="sm" variant="ghost" disabled={pending || current.status === "cancelled"} onClick={() => act("declined")}>Decline</Button>
            </div>
            {note ? <p>{note}</p> : null}
          </aside>
        ) : <p>No bookings match.</p>}
      </div>
    </div>
  );
}
