"use client";

import { Button } from "@sundrop/ui";
import { Copy } from "lucide-react";
import { useState } from "react";

export function CopyLink({ href, label, copied: copiedLabel }: { href: string; label: string; copied: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 8px 18px", border: "1px solid var(--line)", borderRadius: 999, background: "var(--ivory)" }}>
      <code style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{href}</code>
      <Button
        type="button"
        size="sm"
        onClick={async () => {
          const absolute = new URL(href, window.location.origin).toString();
          await navigator.clipboard.writeText(absolute);
          setCopied(true);
        }}
      >
        <Copy /> {copied ? copiedLabel : label}
      </Button>
    </div>
  );
}
