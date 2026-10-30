"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, Input, Label } from "@sundrop/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cancelBooking } from "@/lib/actions";

export function CancelControl({ token, lang }: { token: string; lang: "en" | "bn" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const bn = lang === "bn";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" variant="ghost" onClick={() => setOpen(true)}>{bn ? "বুকিং বাতিল" : "Cancel booking"}</Button>
      <DialogContent>
        <DialogTitle>{bn ? "এই বুকিং বাতিল করবেন?" : "Cancel this booking?"}</DialogTitle>
        <DialogDescription>
          {bn ? "বিনামূল্যের সময়ে থাকলে কিছু কাটা হবে না। এই ডেমো কোনো বার্তা পাঠায় না।" : "Inside the free window, nothing is charged. This demo sends no message."}
        </DialogDescription>
        <div className="field" style={{ marginTop: 16 }}>
          <Label htmlFor="reason">{bn ? "কারণ (ঐচ্ছিক)" : "Reason (optional)"}</Label>
          <Input id="reason" value={reason} onChange={(event) => setReason(event.target.value)} />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Button
            type="button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              const result = await cancelBooking(token, reason);
              setPending(false);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setOpen(false);
              router.refresh();
            }}
          >
            {bn ? "হ্যাঁ, বাতিল করুন" : "Yes, cancel booking"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>{bn ? "রাখুন" : "Keep my booking"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
