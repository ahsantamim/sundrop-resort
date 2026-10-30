import { getRepo } from "@sundrop/data";
import { BookingDesk } from "./desk";

export default async function BookingsPage() {
  const bookings = await getRepo().hydrateBookings();
  const pending = bookings.filter((booking) => booking.status === "pending").length;
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Bookings</h1>
      <p>{bookings.length} in the demo store · {pending} pending. Confirm or decline writes the shared file the guest link reads.</p>
      <BookingDesk bookings={bookings} />
    </>
  );
}
