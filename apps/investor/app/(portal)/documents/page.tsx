import { formatNumber } from "@sundrop/ui";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { loadPortal } from "@/lib/session";

export const metadata: Metadata = { title: "Documents" };

export default async function DocumentsPage() {
  const portal = await loadPortal();
  if (!portal) redirect("/login");
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="kicker">Vault</p>
          <h1>Documents</h1>
        </div>
        <p className="note">{formatNumber(portal.documents.length)} files. Each download is plain text with a sample banner, not a statement.</p>
      </div>
      <section className="stats-bar cols-3" aria-label="Document totals">
        <article><span>Files</span><b>{formatNumber(portal.documents.length)}</b><small>In the vault</small></article>
        <article><span>Kinds</span><b>{formatNumber(new Set(portal.documents.map((document) => document.kind)).size)}</b><small>Document types</small></article>
        <article><span>Format</span><b>Text</b><small>Sample banner on each file</small></article>
      </section>
      <section className="panel">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Document</th>
                <th>Kind</th>
                <th>Date</th>
                <th>Note</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {portal.documents.map((document) => (
                <tr key={document.id}>
                  <td><b className="cell-title">{document.title}</b></td>
                  <td>{document.kind}</td>
                  <td>{document.date}</td>
                  <td>{document.note}</td>
                  <td className="num">
                    <a className="btn press" href={`/documents/${document.id}`}>
                      <Download size={14} /> Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
