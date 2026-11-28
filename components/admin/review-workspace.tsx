"use client";

import { ArrowLeft, FileText, UserRound } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Swap } from "@/components/motion/motion-primitives";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { useReviewSummary } from "@/hooks/use-review-summary";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { SPRING } from "@/lib/motion";
import { formatWait, REVIEW_KIND_LABELS, waitTone } from "@/lib/review";
import { cn } from "@/lib/utils";
import type { ReviewDetail } from "@/types/admin";
import type { APIResponse } from "@/types/response";
import { CvViewer } from "./cv-viewer";
import { ProfilePaper } from "./profile-paper";
import { ReviewDecision } from "./review-decision";
import { ReviewFacts } from "./review-facts";

type View = "cv" | "profile";

export const ReviewWorkspace = function ({ profileId }: { profileId: string }) {
  const { data } = useGetData<APIResponse<ReviewDetail>>({ url: API_ENDPOINTS.admin.review(profileId), staleTime: 0 });
  const summary = useReviewSummary();
  const detail = data?.data;
  const [view, setView] = useState<View>("cv");

  if (!detail) {
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="h-[80vh] rounded-2xl" />
        <Skeleton className="h-[80vh] rounded-2xl" />
      </div>
    );
  }

  const waited = detail.review?.waiting_hours ?? null;

  return (
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="min-w-0 rounded-2xl border bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-5">
          <Link
            href="/admin/reviews"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-semibold 2xl:hidden"
          >
            <ArrowLeft className="size-4" /> Queue
          </Link>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
              {detail.review ? REVIEW_KIND_LABELS[detail.review.kind] : "No open review"}
              <StatusBadge status={detail.profile.status} />
              {waited !== null && (
                <span className={cn("text-xs tabular-nums", waitTone(waited, summary?.target_hours ?? 48))}>
                  waiting {formatWait(waited)}
                </span>
              )}
            </p>
          </div>
          <LayoutGroup id="review-view">
            <div role="tablist" className="bg-page flex gap-1 rounded-xl border p-1 max-sm:w-full">
              {(
                [
                  ["cv", "CV", FileText],
                  ["profile", "Profile", UserRound],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={view === value}
                  onClick={() => setView(value)}
                  className={cn(
                    "relative flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold max-sm:flex-1",
                    view === value ? "text-brand-700" : "text-muted-foreground",
                  )}
                >
                  {view === value && (
                    <motion.span
                      layoutId="review-view-pill"
                      transition={SPRING}
                      className="absolute inset-0 rounded-lg bg-white shadow-xs"
                    />
                  )}
                  <Icon className="relative size-4" />
                  <span className="relative">{label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
        <div className="bg-[#eceff3] p-3 sm:p-5">
          <Swap swapKey={view}>
            {view === "cv" ? (
              detail.profile.cv ? (
                <div className="rounded-xl bg-white p-3">
                  <CvViewer profileId={profileId} cv={detail.profile.cv} />
                </div>
              ) : (
                <p className="text-muted-foreground p-10 text-center text-sm">This candidate has no CV.</p>
              )
            ) : (
              <ProfilePaper profile={detail.profile} />
            )}
          </Swap>
        </div>
      </section>

      <aside className="overflow-hidden rounded-2xl border bg-white xl:sticky xl:top-8">
        <ReviewFacts detail={detail} />
        <ReviewDecision profileId={profileId} detail={detail} />
      </aside>
    </div>
  );
};
