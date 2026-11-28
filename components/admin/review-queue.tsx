"use client";

import { Search } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { useReviewSummary } from "@/hooks/use-review-summary";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { SPRING } from "@/lib/motion";
import { formatWait, REVIEW_KIND_LABELS, waitTone } from "@/lib/review";
import { cn } from "@/lib/utils";
import type { ReviewQueueItem } from "@/types/admin";
import type { ReviewKind } from "@/types/candidate";
import type { PaginatedResponse } from "@/types/response";

const FILTERS: (ReviewKind | "ALL")[] = ["ALL", "NEW", "RESUBMISSION", "CV_CHANGED", "DETAILS_CHANGED"];

const initials = (name: string, ref: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || ref.slice(-2);

export const queueUrl = (kind: ReviewKind | "ALL", search: string) => {
  const params = new URLSearchParams({ page: "1", limit: "50" });
  if (kind !== "ALL") params.set("kind", kind);
  if (search) params.set("search", search);
  return `${API_ENDPOINTS.admin.reviews}?${params}`;
};

export const ReviewQueue = function () {
  const { profileId } = useParams<{ profileId?: string }>();
  const summary = useReviewSummary();
  const [kind, setKind] = useState<ReviewKind | "ALL">("ALL");
  const [typed, setTyped] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(typed.trim()), 300);
    return () => clearTimeout(timer);
  }, [typed]);

  const { data, isFetching } = useGetData<PaginatedResponse<ReviewQueueItem>>({
    url: queueUrl(kind, search),
    staleTime: 15 * 1000,
  });
  const items = data?.data;
  const target = summary?.target_hours ?? 48;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white">
      <div className="border-b p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h1 className="text-lg font-extrabold tracking-tight">CV review</h1>
          <span className="text-muted-foreground text-xs">Oldest first · target {target}h</span>
        </div>
        {summary && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold">
            <span className="bg-page rounded-full px-2.5 py-1">{summary.waiting} waiting</span>
            {!!summary.over_target && (
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-700">
                {summary.over_target} over {target}h
              </span>
            )}
            {!!summary.over_24h && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">{summary.over_24h} over 24h</span>
            )}
            {summary.median_hours_today !== null && (
              <span className="bg-page rounded-full px-2.5 py-1">median today {summary.median_hours_today}h</span>
            )}
          </div>
        )}
        <label className="bg-page focus-within:border-primary mt-3 flex h-10 items-center gap-2 rounded-xl border px-3">
          <Search className="text-muted-foreground size-4" />
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder="Name, email or RP reference"
            aria-label="Search the queue"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <LayoutGroup id="queue-filter">
          <div className="mt-3 flex flex-wrap gap-1">
            {FILTERS.map((entry) => (
              <button
                key={entry}
                type="button"
                onClick={() => setKind(entry)}
                aria-pressed={kind === entry}
                className={cn(
                  "relative h-8 rounded-full px-3 text-xs font-semibold transition-colors",
                  kind === entry ? "text-brand-700" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {kind === entry && (
                  <motion.span
                    layoutId="queue-filter-pill"
                    transition={SPRING}
                    className="bg-brand-50 absolute inset-0 rounded-full"
                  />
                )}
                <span className="relative">{entry === "ALL" ? "All" : REVIEW_KIND_LABELS[entry]}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className={cn("min-h-0 flex-1 overflow-auto transition-opacity", isFetching && items && "opacity-60")}>
        {!items ? (
          <div className="grid gap-2 p-4">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground p-6 text-center text-sm">
            {search || kind !== "ALL" ? "Nothing in the queue matches." : "The queue is clear. Nice work."}
          </p>
        ) : (
          <Stagger step={0.03} className="divide-y">
            {items.map((item) => {
              const on = item.profile_id === profileId;
              return (
                <StaggerItem key={item.review_id}>
                  <Link
                    href={`/admin/reviews/${item.profile_id}`}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 transition-colors",
                      on ? "bg-brand-50 shadow-[inset_3px_0_0_var(--primary)]" : "hover:bg-page",
                    )}
                  >
                    <span className="bg-brand-50 text-brand-700 grid size-9 shrink-0 place-items-center overflow-hidden rounded-full text-xs font-bold">
                      {item.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.photo_url} alt="" className="size-full object-cover" />
                      ) : (
                        initials(item.name, item.public_ref)
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{item.name || item.public_ref}</span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {item.headline ?? "No headline"} · {REVIEW_KIND_LABELS[item.kind]}
                      </span>
                    </span>
                    <span
                      className={cn("shrink-0 text-xs font-bold tabular-nums", waitTone(item.waiting_hours, target))}
                    >
                      {formatWait(item.waiting_hours)}
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>
    </div>
  );
};
