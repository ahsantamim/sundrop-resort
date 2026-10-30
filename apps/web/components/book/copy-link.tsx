"use client";

import { Button } from "@sundrop/ui";
import { useState } from "react";

export function CopyLink({ href, label }: { href: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p style={{ wordBreak: "break-all" }}>{href}</p>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={async () => {
          const absolute = new URL(href, window.location.origin).toString();
          await navigator.clipboard.writeText(absolute);
          setCopied(true);
        }}
      >
        {copied ? "Copied" : label}
      </Button>
    </div>
  );
}
