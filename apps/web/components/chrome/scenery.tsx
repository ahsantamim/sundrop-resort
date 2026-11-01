/**
 * Faint palm, fish and wave silhouettes for the side gutters of a section.
 * They draw in `currentColor`, so `.scenery.ivory` / `.scenery.night` tint them to the page.
 * Content tiles sit above them; they only show around the edges.
 */
function Palm({ className, flip = false }: { className: string; flip?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 210 420" fill="currentColor" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M96 420 C100 340 110 262 103 188 L113 188 C121 264 113 342 109 420 Z" />
      <g className="sway">
        <path d="M108 186 C80 150 40 140 4 158 C40 150 74 162 108 192 Z" />
        <path d="M108 186 C88 128 58 102 18 94 C56 112 86 142 105 192 Z" />
        <path d="M108 186 C112 128 134 94 172 78 C142 104 122 140 112 192 Z" />
        <path d="M108 186 C142 150 178 146 206 168 C174 158 142 166 112 194 Z" />
        <path d="M108 186 C132 198 152 224 158 260 C142 228 124 208 106 196 Z" />
        <path d="M108 186 C84 198 64 222 56 256 C74 226 92 208 110 196 Z" />
        <circle cx="103" cy="194" r="6" />
        <circle cx="115" cy="196" r="6" />
        <circle cx="109" cy="203" r="6" />
      </g>
    </svg>
  );
}

function Fish({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 56 22" fill="currentColor" aria-hidden="true">
      <path d="M2 11 C12 1 30 1 40 11 C30 21 12 21 2 11 Z M40 11 L54 2 L51 11 L54 20 Z" />
    </svg>
  );
}

function Waves({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 46" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
      <path d="M4 10 Q 22 0 40 10 T 76 10 T 112 10 T 148 10" />
      <path d="M16 24 Q 34 14 52 24 T 88 24 T 124 24 T 156 24" />
      <path d="M4 38 Q 22 28 40 38 T 76 38 T 112 38" />
    </svg>
  );
}

export function Scenery({ tone = "ivory" }: { tone?: "ivory" | "night" }) {
  return (
    <div className={`scenery ${tone}`} aria-hidden="true">
      <div className="scenery-side left">
        <Waves className="sc-waves top" />
        <Fish className="sc-fish f1" />
        <Fish className="sc-fish f2" />
        <Palm className="sc-palm" />
      </div>
      <div className="scenery-side right">
        <Fish className="sc-fish f3" />
        <Palm className="sc-palm small" flip />
        <Waves className="sc-waves bottom" />
        <Fish className="sc-fish f4" />
      </div>
    </div>
  );
}
