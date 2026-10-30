import { getRepo } from "@sundrop/data";
import { formatBdt, formatDay } from "@sundrop/ui";
import { notFound } from "next/navigation";

export default async function VoucherPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getRepo().getBookingByToken(token);
  if (!booking) notFound();
  const villa = (await getRepo().listVillas()).find((item) => item.id === booking.villaId);
  return (
    <main className="book-shell">
      <article className="book-card">
        <p className="sample">Sample voucher · not a tax invoice</p>
        <h1>SUNDROP Eco Resort</h1>
        <p>Saint Martin’s Island · Cox’s Bazar · demo</p>
        <p>Reference {booking.reference}</p>
        <p>Status {booking.status}</p>
        <p>{villa?.name}</p>
        <p>{formatDay(booking.checkIn)} – {formatDay(booking.checkOut)} · {booking.nights} nights</p>
        <p>{booking.guestName}</p>
        <p>{booking.mobile} · {booking.email}</p>
        <p>Sample total {formatBdt(booking.total)}</p>
        <p>No payment was collected. This page is for printing only.</p>
      </article>
    </main>
  );
}
