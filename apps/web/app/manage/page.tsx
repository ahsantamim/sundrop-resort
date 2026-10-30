"use client";

import { Button, Input, Label } from "@sundrop/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ManageLookupPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="book-shell">
      <div className="book-card">
        <p className="over">Manage booking</p>
        <h1 style={{ fontSize: 40 }}>Open your private link</h1>
        <p className="lede">A booking reference on its own is not enough. Paste the private link or the token from your confirmation.</p>
        <form
          className="field"
          onSubmit={(event) => {
            event.preventDefault();
            const token = value.trim().split("/").filter(Boolean).pop() ?? "";
            if (token.length < 20) {
              setError("That does not look like a private token.");
              return;
            }
            router.push(`/b/${token}`);
          }}
        >
          <Label htmlFor="token">Private link or token</Label>
          <Input id="token" value={value} onChange={(event) => setValue(event.target.value)} placeholder="SdDemo…" />
          {error ? <p className="error">{error}</p> : null}
          <Button type="submit">Open</Button>
        </form>
        <p className="help">Sample booking for the demo: reference SDR-DEMO-2610.</p>
        <Button type="button" variant="ghost" onClick={() => router.push("/b/SdDemoGuestLinkToken0000000001ab")}>Open the sample booking</Button>
      </div>
    </main>
  );
}
