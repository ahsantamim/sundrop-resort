"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export function DialogContent({
  className,
  children,
  side = "center",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "center" | "right" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-navy/45 backdrop-blur-[2px] data-[state=open]:animate-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-ivory text-ink shadow-2xl outline-none",
          side === "center" &&
            "top-1/2 left-1/2 w-[min(520px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[28px] p-6",
          side === "right" && "top-0 right-0 flex h-full w-[min(440px,100%)] flex-col overflow-y-auto p-6",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-ink-600 hover:bg-sand focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-coral">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
