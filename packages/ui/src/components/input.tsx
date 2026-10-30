import * as React from "react";
import { cn } from "../lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-2xl border border-line bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-ink-400 focus-visible:border-teal-700 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-coral disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
