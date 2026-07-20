export interface LogoProps {
  className?: string;
  /** "full" renders the mark with the wordmark; "icon" renders the mark alone. */
  variant?: "full" | "icon";
  /** Pixel height of the icon mark; text scales proportionally in "full" variant. */
  height?: number;
  showSubtitle?: boolean;
}

/** The lens + LED + beam pictogram — shared source of truth with app/icon.svg. */
function LogoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id="vls-logo-beam" x1="30" y1="32" x2="58" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#020617" />
      <path d="M30 20 L58 12 L58 52 L30 44 Z" fill="url(#vls-logo-beam)" />
      <circle cx="26" cy="32" r="13" fill="#0f172a" stroke="#22d3ee" strokeWidth="3" />
      <circle cx="26" cy="32" r="6.5" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
      <circle cx="15" cy="32" r="5" fill="#fbbf24" />
    </svg>
  );
}

export function Logo({ className = "", variant = "full", height = 32, showSubtitle = true }: LogoProps) {
  if (variant === "icon") {
    return (
      <span role="img" aria-label="Vision Lighting Solutions" className={className}>
        <LogoMark size={height} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={height} />
      <span className="flex flex-col leading-none">
        <span className="flex items-baseline gap-1.5">
          <span
            className="font-bold tracking-tight text-slate-900 dark:text-slate-100"
            style={{ fontSize: height * 0.42 }}
          >
            VISION
          </span>
          <span className="font-bold tracking-tight text-sky-600 dark:text-sky-400" style={{ fontSize: height * 0.42 }}>
            LIGHTING
          </span>
        </span>
        {showSubtitle && (
          <span
            className="mt-1 font-medium tracking-[0.2em] text-slate-500 dark:text-slate-400"
            style={{ fontSize: height * 0.2 }}
          >
            SOLUTIONS
          </span>
        )}
      </span>
    </span>
  );
}
