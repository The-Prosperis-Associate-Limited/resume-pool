"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReviewQueueArt } from "@/components/illustrations/empty-art";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReviewSummary } from "@/hooks/use-review-summary";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

export default function AdminHomePage() {
  const { user } = useSession();
  const summary = useReviewSummary();

  const tiles = summary
    ? [
        { label: "Waiting for review", value: summary.waiting, tone: "" },
        { label: "Waiting over 24h", value: summary.over_24h, tone: summary.over_24h ? "text-amber-600" : "" },
        {
          label: `Over the ${summary.target_hours}h target`,
          value: summary.over_target,
          tone: summary.over_target ? "text-red-600" : "",
        },
        {
          label: "Median wait, decided today",
          value: summary.median_hours_today === null ? "–" : `${summary.median_hours_today}h`,
          tone: "",
        },
      ]
    : [];

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <div className="flex flex-col gap-5 rounded-2xl border bg-white p-6 sm:flex-row sm:items-center sm:p-7">
        <ReviewQueueArt className="size-24 shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Hello, {user?.first_name ?? "there"}</h1>
          <p className="text-muted-foreground mt-1">
            {summary
              ? summary.waiting
                ? `${summary.waiting} profile${summary.waiting === 1 ? " is" : "s are"} waiting for review, oldest first.`
                : "The review queue is clear."
              : "Loading the review queue…"}
          </p>
          <Button asChild className="mt-5 h-11 rounded-xl px-5">
            <Link href="/admin/reviews">
              Open the review queue <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      {summary ? (
        <Stagger step={0.06} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tiles.map((tile) => (
            <StaggerItem key={tile.label} className="rounded-2xl border bg-white p-4">
              <p className="text-muted-foreground text-[13px]">{tile.label}</p>
              <p className={cn("mt-1 text-2xl font-extrabold tabular-nums", tile.tone)}>{tile.value}</p>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-22 rounded-2xl" />
          ))}
        </div>
      )}
    </div>
  );
}
