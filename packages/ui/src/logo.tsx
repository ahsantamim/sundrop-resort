export function Mark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <svg className={className} width="38" height="40" viewBox="0 0 38 40" fill="none" aria-hidden="true">
      <path d="M3 38V18C3 9.7 10.2 3 19 3s16 6.7 16 15v20" stroke="#F2B23E" strokeWidth="2.2" />
      <path
        d="M9 38c3-2.4 6.6-2.4 10 0s7 2.4 10 0"
        stroke={light ? "#fff" : "#FBF7F0"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 31c3-2.4 6.6-2.4 10 0s7 2.4 10 0"
        stroke={light ? "#fff" : "#FBF7F0"}
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".6"
      />
    </svg>
  );
}

export function Wordmark({
  compact = false,
  subtitle = "ECO RESORT",
}: {
  compact?: boolean;
  subtitle?: string;
}) {
  return (
    <span className="brand-type">
      <b className={compact ? "text-[22px]" : undefined}>SUNDROP</b>
      <small>{subtitle}</small>
    </span>
  );
}
