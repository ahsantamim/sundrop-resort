import { getRepo, remainingShares } from "@sundrop/data";
import { formatBdt } from "@sundrop/ui";
import Link from "next/link";

export default async function DashboardPage() {
  const [bookings, applications, projects] = await Promise.all([
    getRepo().hydrateBookings(),
    getRepo().listApplications(),
    getRepo().listProjects(),
  ]);
  const pending = bookings.filter((booking) => booking.status === "pending").length;
  const openRequests = applications.filter((application) => application.status === "under_review").length;
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 46 }}>Good morning.</h1>
      <p>Counts below are the live demo store. The resort is not measuring real occupancy.</p>
      <div className="cards">
        <article className="card"><span>Bookings in the store</span><b>{bookings.length}</b></article>
        <article className="card"><span>Pending confirmation</span><b>{pending}</b></article>
        <article className="card"><span>Requests waiting</span><b>{openRequests}</b></article>
        <article className="card"><span>Sample projects</span><b>{projects.length}</b></article>
      </div>
      <h2>Latest bookings</h2>
      <table>
        <thead><tr><th>Reference</th><th>Guest</th><th>Villa</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          {bookings.slice(0, 6).map((booking) => (
            <tr key={booking.id}>
              <td><Link href="/bookings">{booking.reference}</Link></td>
              <td>{booking.guestName}</td>
              <td>{booking.villaName}</td>
              <td>{formatBdt(booking.total)} <span className="sample">sample</span></td>
              <td><span className={`pill ${booking.status}`}>{booking.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Sample share desk</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}: {project.soldShares} allocated, {project.reservedShares} reserved, {remainingShares(project)} left — placeholders</li>
        ))}
      </ul>
    </>
  );
}
