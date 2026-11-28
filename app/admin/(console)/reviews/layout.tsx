"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ReviewQueue } from "@/components/admin/review-queue";
import { cn } from "@/lib/utils";

const Workspace = function ({ children }: { children: React.ReactNode }) {
  const { profileId } = useParams<{ profileId?: string }>();

  return (
    <div className="grid items-start gap-5 2xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside
        className={cn(
          "min-w-0 2xl:sticky 2xl:top-8 2xl:h-[calc(100dvh-4rem)]",
          profileId ? "hidden 2xl:block" : "h-[calc(100dvh-7rem)] lg:h-[calc(100dvh-4rem)]",
        )}
      >
        <ReviewQueue />
      </aside>
      <div className={cn("min-w-0", !profileId && "hidden 2xl:block")}>{children}</div>
    </div>
  );
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <Workspace>{children}</Workspace>
    </Suspense>
  );
}
