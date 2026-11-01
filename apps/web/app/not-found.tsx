import { Button } from "@sundrop/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap page-head" style={{ paddingBottom: 120 }}>
      <span className="over">404</span>
      <h1 className="serif-swap">That page is not <em>on the island.</em></h1>
      <Button asChild><Link href="/">Back to SUNDROP Eco Resort</Link></Button>
    </main>
  );
}
