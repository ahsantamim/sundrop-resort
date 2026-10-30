"use client";

import { Button, Input, Label, Mark } from "@sundrop/ui";
import { useState } from "react";
import { signInAdmin } from "@/lib/actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  return (
    <main className="login">
      <form
        action={async (formData) => {
          const result = await signInAdmin(formData);
          if (result?.error) setError(result.error);
        }}
        style={{ width: "min(440px, 100%)", background: "#fbf7f0", borderRadius: 28, padding: 28, display: "grid", gap: 12 }}
      >
        <Mark light={false} />
        <p className="sample">Admin console · demo</p>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 40, margin: 0 }}>SUNDROP desk</h1>
        <p>Sign in to confirm bookings and decide investment requests. No message is sent to guests.</p>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" defaultValue="rafiq.hasan@sundrop.demo" required />
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" defaultValue="sundrop-admin" required />
        {error ? <p style={{ color: "#b5452c", fontWeight: 700 }}>{error}</p> : null}
        <Button type="submit">Sign in</Button>
      </form>
    </main>
  );
}
