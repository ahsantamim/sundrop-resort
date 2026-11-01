import { getRepo } from "@sundrop/data";
import { formatBdt, formatDay, nightsLabel } from "@sundrop/ui";
import { notFound } from "next/navigation";
import { Scenery } from "@/components/chrome/scenery";

export default async function VoucherPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getRepo().getBookingByToken(token);
  if (!booking) notFound();
  const villa = (await getRepo().listVillas()).find((item) => item.id === booking.villaId);
  return (
    <main className="book-shell">
      <Scenery />
      <div className="wrap book-narrow">
        <article className="book-card" style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span className="sample">Sample voucher · not a tax invoice</span>
            <span className={`pill ${booking.status}`}><i />{booking.status}</span>
          </div>
          <div>
            <h1 className="serif-swap" style={{ margin: 0 }}>SUNDROP Eco Resort</h1>
            <p className="help" style={{ margin: "6px 0 0" }}>Saint Martin’s Island · Cox’s Bazar · demo</p>
          </div>
          <div className="tile sand" style={{ alignItems: "center", textAlign: "center" }}>
            <span className="over">Reference</span>
            <span className="ref">{booking.reference}</span>
          </div>
          <dl className="kv">
            <div><dt>Villa</dt><dd>{villa?.name ?? "—"}</dd></div>
            <div><dt>Dates</dt><dd>{formatDay(booking.checkIn)} – {formatDay(booking.checkOut)} · {nightsLabel(booking.nights, "en")}</dd></div>
            <div><dt>Guest</dt><dd>{booking.guestName}</dd></div>
            <div><dt>Contact</dt><dd>{booking.mobile} · {booking.email}</dd></div>
            <div><dt>Sample total</dt><dd>{formatBdt(booking.total)}</dd></div>
          </dl>
          <p className="help" style={{ margin: 0 }}>No payment was collected. This page is for printing only.</p>
        </article>
      </div>
    </main>
  );
}
