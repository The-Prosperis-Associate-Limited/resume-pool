import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Frame = function ({ className, children }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 88 88" fill="none" aria-hidden className={cn("size-22", className)}>
      <circle cx="44" cy="46" r="38" fill="var(--brand-50)" />
      <circle cx="44" cy="46" r="38" stroke="var(--brand-600)" strokeOpacity=".14" />
      {children}
    </svg>
  );
};

const Sparkle = function ({ x, y, size = 5 }: { x: number; y: number; size?: number }) {
  return (
    <path
      d="M0-1C.15-.3.3-.15 1 0 .3.15.15.3 0 1-.15.3-.3.15-1 0-.3-.15-.15-.3 0-1Z"
      transform={`translate(${x} ${y}) scale(${size})`}
      fill="var(--highlight)"
    />
  );
};

export const InboxArt = function ({ className }: Props) {
  return (
    <Frame className={className}>
      <rect x="25" y="18" width="38" height="30" rx="5" fill="white" stroke="var(--brand-600)" strokeWidth="1.5" />
      <rect x="30" y="25" width="28" height="9" rx="2.5" fill="var(--brand-50)" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={35 + i * 6} cy="29.5" r="1.7" fill="var(--primary)" />
      ))}
      <path d="M31 39h18" stroke="var(--brand-600)" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 40.5 44 57l26-16.5V66a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V40.5Z" fill="var(--primary)" />
      <path d="M18 66 38 52.5M70 66 50 52.5" stroke="var(--brand-900)" strokeOpacity=".35" strokeWidth="1.5" />
      <path
        d="M18 40.5 44 57l26-16.5"
        stroke="var(--brand-900)"
        strokeOpacity=".25"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Sparkle x={69} y={20} />
      <Sparkle x={17} y={28} size={3} />
    </Frame>
  );
};

export const KeyArt = function ({ className }: Props) {
  return (
    <Frame className={className}>
      <rect x="20" y="22" width="34" height="44" rx="5" fill="white" stroke="var(--brand-600)" strokeWidth="1.5" />
      <path
        d="M27 32h20M27 39h14M27 46h17"
        stroke="var(--brand-600)"
        strokeOpacity=".3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="56" cy="50" r="11" fill="var(--primary)" />
      <circle cx="56" cy="50" r="4" fill="var(--brand-50)" />
      <path
        d="M64 57.5 73 66.5m-3.5-3.5 3-3m-6.5-.5 3-3"
        stroke="var(--primary)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Sparkle x={70} y={26} />
    </Frame>
  );
};

export const LockArt = function ({ className }: Props) {
  return (
    <Frame className={className}>
      <path d="M33 40v-8a11 11 0 0 1 22 0v8" stroke="var(--brand-700)" strokeWidth="5" strokeLinecap="round" />
      <rect x="24" y="38" width="40" height="32" rx="7" fill="var(--primary)" />
      <rect x="24" y="38" width="40" height="8" rx="4" fill="white" fillOpacity=".12" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={34 + i * 6.7} cy="56" r="2.2" fill="white" />
      ))}
      <Sparkle x={70} y={30} />
      <Sparkle x={18} y={58} size={3} />
    </Frame>
  );
};

export const VerifiedArt = function ({ className }: Props) {
  return (
    <Frame className={className}>
      <path
        d="M44 16l6.3 4.6 7.8-.3 2.4 7.4 6.4 4.5-2.5 7.4 2.5 7.4-6.4 4.5-2.4 7.4-7.8-.3L44 63l-6.3-4.6-7.8.3-2.4-7.4-6.4-4.5 2.5-7.4-2.5-7.4 6.4-4.5 2.4-7.4 7.8.3L44 16Z"
        fill="var(--primary)"
        transform="translate(0 6)"
      />
      <path d="m34 46 7 7 14-15" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <Sparkle x={72} y={22} />
      <Sparkle x={16} y={30} size={3.5} />
      <Sparkle x={70} y={70} size={3} />
    </Frame>
  );
};

export const CompanyArt = function ({ className }: Props) {
  return (
    <Frame className={className}>
      <rect x="20" y="30" width="26" height="40" rx="3" fill="white" stroke="var(--brand-600)" strokeWidth="1.5" />
      <rect x="44" y="20" width="24" height="50" rx="3" fill="var(--primary)" />
      {[0, 1, 2].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}${col}`}
            x={50 + col * 7}
            y={28 + row * 9}
            width="4.5"
            height="5"
            rx="1"
            fill="white"
            fillOpacity=".55"
          />
        )),
      )}
      {[0, 1].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`l${row}${col}`}
            x={26 + col * 8}
            y={38 + row * 9}
            width="5"
            height="5"
            rx="1"
            fill="var(--brand-600)"
            fillOpacity=".3"
          />
        )),
      )}
      <rect x="52" y="58" width="8" height="12" rx="1.5" fill="var(--brand-900)" fillOpacity=".4" />
      <path d="M14 70h60" stroke="var(--brand-600)" strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
      <Sparkle x={72} y={16} />
    </Frame>
  );
};
