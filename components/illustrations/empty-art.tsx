import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const Scene = function ({ className, children }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 160 112" fill="none" aria-hidden className={cn("h-28 w-40", className)}>
      <ellipse cx="80" cy="100" rx="58" ry="6" fill="var(--brand-600)" fillOpacity=".08" />
      {children}
    </svg>
  );
};

const Card = function ({
  x,
  y,
  w = 44,
  h = 56,
  faded,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  faded?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={faded ? 0.55 : 1}>
      <rect width={w} height={h} rx="6" fill="white" stroke="var(--border)" />
      <circle cx="11" cy="12" r="5" fill="var(--brand-50)" stroke="var(--brand-600)" strokeOpacity=".35" />
      <path
        d={`M20 10h${w - 28}M20 15h${w - 34}`}
        stroke="var(--brand-600)"
        strokeOpacity=".3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={`M7 27h${w - 14}M7 34h${w - 20}M7 41h${w - 24}`}
        stroke="var(--border)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
};

export const ProfileBuilderArt = function ({ className }: Props) {
  return (
    <Scene className={className}>
      <Card x={44} y={18} w={60} h={76} />
      <rect x="52" y="78" width="44" height="8" rx="4" fill="var(--brand-50)" />
      <rect x="52" y="78" width="18" height="8" rx="4" fill="var(--primary)" />
      <g transform="translate(96 20) rotate(35)">
        <rect width="9" height="44" rx="2" fill="var(--highlight)" />
        <path d="M0 44h9l-4.5 9L0 44Z" fill="var(--brand-900)" fillOpacity=".7" />
        <rect width="9" height="7" rx="2" fill="var(--brand-700)" />
      </g>
      <circle cx="32" cy="34" r="3" fill="var(--art-glow)" />
      <circle cx="124" cy="80" r="2.5" fill="var(--highlight)" />
    </Scene>
  );
};

export const PoolSearchArt = function ({ className }: Props) {
  return (
    <Scene className={className}>
      <Card x={24} y={30} faded />
      <Card x={92} y={30} faded />
      <Card x={56} y={20} w={48} h={62} />
      <circle cx="98" cy="62" r="17" fill="white" fillOpacity=".7" stroke="var(--primary)" strokeWidth="5" />
      <path d="m110 75 12 12" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="92" cy="56" r="4" fill="white" />
      <circle cx="30" cy="20" r="2.5" fill="var(--highlight)" />
    </Scene>
  );
};

export const ReviewQueueArt = function ({ className }: Props) {
  return (
    <Scene className={className}>
      <Card x={30} y={34} faded />
      <Card x={46} y={26} faded />
      <Card x={62} y={18} w={50} h={66} />
      <circle cx="108" cy="78" r="14" fill="var(--primary)" />
      <path d="m101 78 5 5 9-10" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="132" cy="36" r="3" fill="var(--art-glow)" />
      <circle cx="26" cy="24" r="2.5" fill="var(--highlight)" />
    </Scene>
  );
};
