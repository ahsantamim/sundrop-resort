import { loadPortal } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  return (
    <>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400 }}>Document vault</h1>
      <p className="muted">Quarterly notes and certificates in this demo download as plain text with a sample banner. They are not statements.</p>
      <ul>
        {portal.documents.map((document) => (
          <li key={document.id} style={{ margin: "12px 0" }}>
            <a href={`/documents/${document.id}`}><b>{document.title}</b></a>
            <div className="muted">{document.kind} · {document.date} · {document.note}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
