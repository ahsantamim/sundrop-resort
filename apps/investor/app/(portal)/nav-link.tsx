"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, title, children }: { href: string; title?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const current = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link href={href} title={title} aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
