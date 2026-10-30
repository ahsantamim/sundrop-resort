import { getRepo } from "@sundrop/data";
import { formatBdt } from "@sundrop/ui";

export default async function RoomsPage() {
  const [villas, bookings] = await Promise.all([getRepo().listVillas(), getRepo().hydrateBookings()]);
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Rooms & inventory</h1>
      <p>Six types, 24 sample keys. Rates are placeholders.</p>
      <table>
        <thead><tr><th>Villa</th><th>Keys</th><th>Sleeps</th><th>Sample rate</th><th>Open stays</th></tr></thead>
        <tbody>
          {villas.map((villa) => {
            const open = bookings.filter((booking) => booking.villaId === villa.id && (booking.status === "pending" || booking.status === "confirmed")).length;
            return (
              <tr key={villa.id}>
                <td>{villa.name}</td>
                <td>{villa.units}</td>
                <td>{villa.guests}</td>
                <td>{formatBdt(villa.pricePerNight)}</td>
                <td>{open}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
