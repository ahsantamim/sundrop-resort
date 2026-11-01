import { remainingShares, type Project } from "@sundrop/data/types";
import { useId } from "react";

/** Share of a project already allocated or held by requests, 0–100. */
export function takenPercent(project: Project) {
  if (!project.totalShares) return 0;
  return Math.round(((project.totalShares - remainingShares(project)) / project.totalShares) * 100);
}

/** Round gold gauge: how much of a sample project is spoken for. */
export function ShareRing({ value, label, size = 112, digits }: { value: number; label: string; size?: number; digits?: string }) {
  const id = useId();
  const stroke = size * 0.085;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="gauge" style={{ width: size, height: size, fontSize: size * 0.22 }} role="img" aria-label={`${value}% ${label}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E3CB7A" />
            <stop offset="1" stopColor="#C9A227" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * value) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="gauge-in">
        <b>{digits ?? value}%</b>
        <small>{label}</small>
      </span>
    </div>
  );
}
