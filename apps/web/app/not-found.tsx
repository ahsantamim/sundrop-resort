import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-hero wrap">
      <h1>That page is not on the island.</h1>
      <p><Link href="/">Back to SUNDROP Eco Resort</Link></p>
    </main>
  );
}
