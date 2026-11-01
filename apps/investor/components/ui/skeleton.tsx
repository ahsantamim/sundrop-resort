import { cn } from "@sundrop/ui";

/** shadcn-style skeleton. Pulse block used while a portal view is loading. */
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("sk animate-pulse rounded-md", className)} {...props} />;
}
