import { cn } from "@/lib/utils";
import type { CandidateProfileStatus } from "@/types/auth";

const STYLES: Record<CandidateProfileStatus, { label: string; box: string; dot: string }> = {
  UNSUBMITTED: { label: "Not live yet", box: "bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  PENDING: { label: "In review", box: "bg-amber-50 text-amber-800", dot: "bg-amber-500 animate-pulse" },
  LIVE: { label: "Live", box: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  REJECTED: { label: "Needs changes", box: "bg-red-50 text-red-700", dot: "bg-red-500" },
  PAUSED: { label: "Paused", box: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  HIRED: { label: "Hired", box: "bg-brand-50 text-brand-700", dot: "bg-primary" },
  REMOVED: { label: "Removed", box: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

interface Props {
  status: CandidateProfileStatus;
  className?: string;
}

export const StatusBadge = function ({ status, className }: Props) {
  const style = STYLES[status];

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
        style.box,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
};
