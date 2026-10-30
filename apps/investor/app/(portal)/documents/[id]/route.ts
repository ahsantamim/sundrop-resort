import { COOKIES, getRepo } from "@sundrop/data";
import { cookies } from "next/headers";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const jar = await cookies();
  const document = await getRepo().getDocument(jar.get(COOKIES.investor)?.value, id);
  if (!document) return new Response("Not found", { status: 404 });
  const body = [
    "SUNDROP ECO RESORT",
    "SAMPLE DOCUMENT — NOT A FINANCIAL STATEMENT, CERTIFICATE, OR TAX RECORD",
    "",
    document.title,
    document.kind,
    document.date,
    document.note,
    "",
    "Figures elsewhere in the demo are placeholders. This file exists so the quarterly-report link works.",
  ].join("\n");
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `attachment; filename="${document.id}.txt"`,
    },
  });
}
