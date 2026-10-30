"use client";

import { Button, Input, Label } from "@sundrop/ui";
import { useState } from "react";

export function LoginForm({ action }: { action: (formData: FormData) => Promise<{ error: string } | void> }) {
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      style={{ display: "grid", gap: 12, width: "min(420px, 100%)" }}
      action={async (formData) => {
        const result = await action(formData);
        if (result?.error) setError(result.error);
      }}
    >
      <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 36, marginBottom: 0 }}>Welcome back</h2>
      <p className="sample">Demo password is filled in</p>
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" type="email" autoComplete="username" defaultValue="shirin.akter@sundrop.demo" required />
      <Label htmlFor="password">Password</Label>
      <Input id="password" name="password" type="password" autoComplete="current-password" defaultValue="sundrop-demo" required />
      {error ? <p style={{ color: "#e86a4a", fontWeight: 700 }}>{error}</p> : null}
      <Button type="submit">Sign in securely</Button>
    </form>
  );
}
