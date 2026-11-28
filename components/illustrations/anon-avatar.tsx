import { useId } from "react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  tone?: "light" | "dark";
}

// The anonymity cue: a striped silhouette with a lock. Only anonymised candidates use it.
export const AnonAvatar = function ({ className, tone = "light" }: Props) {
  const id = useId();
  const dark = tone === "dark";

  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={cn("size-10", className)}>
      <defs>
        <pattern id={`${id}-stripes`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="2.5" height="5" fill={dark ? "white" : "var(--brand-600)"} fillOpacity={dark ? ".22" : ".16"} />
        </pattern>
        <clipPath id={`${id}-clip`}>
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>
      <circle cx="18" cy="18" r="16" fill={dark ? "white" : "var(--brand-50)"} fillOpacity={dark ? ".1" : "1"} />
      <circle cx="18" cy="18" r="16" fill={`url(#${id}-stripes)`} />
      <g clipPath={`url(#${id}-clip)`} fill={dark ? "white" : "var(--brand-600)"} fillOpacity={dark ? ".55" : ".45"}>
        <circle cx="18" cy="14.5" r="5.5" />
        <path d="M6 34c1.5-6.5 6.5-10 12-10s10.5 3.5 12 10v4H6v-4Z" />
      </g>
      <circle
        cx="30.5"
        cy="30.5"
        r="7.5"
        fill={dark ? "var(--highlight)" : "var(--primary)"}
        stroke={dark ? "var(--brand-900)" : "white"}
        strokeWidth="2"
      />
      <rect x="27.5" y="30" width="6" height="4.5" rx="1" fill="white" />
      <path d="M28.8 30v-1.3a1.7 1.7 0 0 1 3.4 0V30" stroke="white" strokeWidth="1.2" />
    </svg>
  );
};
