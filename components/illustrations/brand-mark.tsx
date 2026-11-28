import { cn } from "@/lib/utils";

// Two stacked CVs over a pool line: the product in one mark.
export const BrandMark = function ({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" aria-hidden className={cn("size-9", className)}>
      <defs>
        <linearGradient id="rp-mark" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-600)" />
          <stop offset="1" stopColor="var(--brand-900)" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#rp-mark)" />
      <rect x="13" y="7" width="14" height="17" rx="2.5" fill="white" fillOpacity=".35" />
      <rect x="9" y="10" width="14" height="17" rx="2.5" fill="white" />
      <circle cx="13.5" cy="15" r="2" fill="var(--brand-600)" />
      <path
        d="M17 14h3.5M17 16.5h2.5M12 20.5h8M12 23h5.5"
        stroke="var(--brand-600)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M6 29.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0 4 1.6 6 0"
        stroke="var(--art-glow)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
};
