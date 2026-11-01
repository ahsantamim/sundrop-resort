import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function PortalLoading() {
  return (
    <div className="page" aria-busy="true" aria-live="polite">
      <div className="page-head">
        <div className="load-line">
          <Spinner className="size-4 text-gold-300" />
          <span>Loading partner desk</span>
        </div>
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="stats-bar" aria-hidden>
        {Array.from({ length: 6 }, (_, index) => (
          <article key={index}><Skeleton className="h-16" /></article>
        ))}
      </div>
      <div className="split">
        <Skeleton className="h-56" />
        <div className="stack">
          <Skeleton className="h-28" />
          <Skeleton className="h-24" />
        </div>
      </div>
      <Skeleton className="h-44" />
    </div>
  );
}
