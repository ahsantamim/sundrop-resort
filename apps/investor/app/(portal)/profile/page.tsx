import { loadPortal } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Profile & security</h1>
      <article className="card">
        <p><b>{portal.investor.name}</b></p>
        <p>{portal.investor.email}</p>
        <p>{portal.investor.mobile}</p>
        <p className="muted">2FA is shown in the source design and is not turned on in this demo. Password change is intentionally omitted so the published demo password keeps working.</p>
      </article>
    </>
  );
}
