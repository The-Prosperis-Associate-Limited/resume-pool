import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  active?: boolean;
}

export const SeekerArt = function ({ className, active }: Props) {
  const ink = active ? "white" : "var(--brand-600)";

  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={cn("size-10", className)}>
      <rect width="40" height="40" rx="11" fill={active ? "var(--primary)" : "var(--brand-50)"} />
      <rect
        x="10"
        y="8"
        width="17"
        height="22"
        rx="3"
        fill="white"
        fillOpacity={active ? ".2" : "1"}
        stroke={ink}
        strokeWidth="1.4"
      />
      <circle cx="15.5" cy="14.5" r="2.5" fill={ink} />
      <path
        d="M20 13.5h4M20 16h2.5M13.5 21h10M13.5 24.5h7"
        stroke={ink}
        strokeOpacity=".6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="28" cy="28" r="6.5" fill={active ? "var(--highlight)" : "var(--primary)"} />
      <path
        d="m25.2 28 1.9 1.9 3.8-3.8"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HirerArt = function ({ className, active }: Props) {
  const ink = active ? "white" : "var(--brand-600)";

  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={cn("size-10", className)}>
      <rect width="40" height="40" rx="11" fill={active ? "var(--primary)" : "var(--brand-50)"} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${8 + i * 5} ${9 + i * 3})`} opacity={0.45 + i * 0.25}>
          <rect
            width="14"
            height="17"
            rx="2.5"
            fill="white"
            fillOpacity={active ? ".18" : "1"}
            stroke={ink}
            strokeWidth="1.3"
          />
          <circle cx="4.5" cy="5" r="2" fill={ink} />
          <path d="M3 10.5h8M3 13h5" stroke={ink} strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      ))}
      <circle
        cx="28.5"
        cy="27"
        r="5"
        fill="none"
        stroke={active ? "var(--highlight)" : "var(--primary)"}
        strokeWidth="2.4"
      />
      <path
        d="m32.2 30.7 3.3 3.3"
        stroke={active ? "var(--highlight)" : "var(--primary)"}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
};
