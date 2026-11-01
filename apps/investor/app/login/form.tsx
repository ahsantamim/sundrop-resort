"use client";

import { Input, Label } from "@sundrop/ui";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn press" type="submit" disabled={pending}>
      {pending ? <Spinner /> : null}
      {pending ? "Signing in" : "Sign in securely"}
    </button>
  );
}

export function LoginForm({ action }: { action: (formData: FormData) => Promise<{ error: string } | void> }) {
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className="login-card"
      action={async (formData) => {
        const result = await action(formData);
        if (result?.error) setError(result.error);
      }}
    >
      <h2>Welcome back</h2>
      <p className="sample">Demo password is filled in</p>
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" type="email" autoComplete="username" defaultValue="shirin.akter@sundrop.demo" required />
      <Label htmlFor="password">Password</Label>
      <Input id="password" name="password" type="password" autoComplete="current-password" defaultValue="sundrop-demo" required />
      {error ? <p style={{ margin: 0, color: "#e86a4a", fontWeight: 700, fontSize: 13 }}>{error}</p> : null}
      <SubmitButton />
    </form>
  );
}
