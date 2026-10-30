import { loadPortal } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ApplicationsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Application status</h1>
      {portal.applications.length === 0 ? (
        <p>No requests use {portal.investor.email}. Applications sent from the public site appear here when the email matches, and in the admin inbox either way.</p>
      ) : (
        <table>
          <thead><tr><th>ID</th><th>Project</th><th>Shares</th><th>Status</th></tr></thead>
          <tbody>
            {portal.applications.map((application) => (
              <tr key={application.id}><td>{application.id}</td><td>{application.projectName}</td><td>{application.shares}</td><td>{application.status}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
