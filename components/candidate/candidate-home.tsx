"use client";

import { ArrowRight, Clock, FileCheck2, Hourglass, PenLine } from "lucide-react";
import Link from "next/link";
import { ProfileBuilderArt, ReviewQueueArt } from "@/components/illustrations/empty-art";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { CandidatePreviewCard, PreviewLabel } from "@/components/onboarding/candidate-preview-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidateProfile } from "@/hooks/use-candidate-profile";
import { ONBOARDING_STEPS, REVIEW_TURNAROUND } from "@/lib/onboarding";
import type { CandidateProfileResponse } from "@/types/candidate";

const Hero = function ({ data }: { data: CandidateProfileResponse }) {
  const { profile } = data;
  const name = profile.personal.first_name ?? "there";

  if (profile.status === "UNSUBMITTED") {
    const reached =
      profile.onboarding_step === "REVIEW"
        ? ONBOARDING_STEPS.length
        : ONBOARDING_STEPS.findIndex((entry) => entry.step === profile.onboarding_step);
    const percent = Math.round((reached / ONBOARDING_STEPS.length) * 100);
    return (
      <div className="flex flex-col gap-5 rounded-2xl border bg-white p-6 sm:flex-row sm:items-center sm:p-7">
        <ProfileBuilderArt className="size-24 shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {name}</h1>
          <p className="text-muted-foreground mt-1">
            Finish your profile so companies can find you. Every step saves as you go.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={percent} className="h-2 max-w-72" />
            <span className="text-muted-foreground text-sm tabular-nums">{percent}%</span>
          </div>
          <Button asChild className="mt-5 h-11 rounded-xl px-5">
            <Link href="/candidate/onboarding">
              {reached ? "Continue my profile" : "Start my profile"} <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (profile.status === "PENDING") {
    return (
      <div className="flex flex-col gap-5 rounded-2xl border bg-white p-6 sm:flex-row sm:items-center sm:p-7">
        <ReviewQueueArt className="size-24 shrink-0" />
        <div className="min-w-0 flex-1">
          <StatusBadge status="PENDING" />
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight">Your profile is with our reviewers</h1>
          <p className="text-muted-foreground mt-1">
            We check every profile and CV by hand, usually {REVIEW_TURNAROUND}. We&apos;ll email you the moment
            it&apos;s live, or tell you exactly what to change.
          </p>
          <ul className="text-ink-2 [&_svg]:text-primary mt-4 grid gap-2 text-sm [&_li]:flex [&_li]:items-center [&_li]:gap-2.5 [&_svg]:size-4">
            <li>
              <FileCheck2 /> Submitted{" "}
              {profile.submitted_at
                ? new Date(profile.submitted_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </li>
            <li>
              <Hourglass /> Reviewed {REVIEW_TURNAROUND}
            </li>
            <li>
              <Clock /> Your public reference is <b>{profile.public_ref}</b>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (profile.status === "REJECTED") {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 sm:p-7">
        <StatusBadge status="REJECTED" />
        <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight">Your profile needs a few changes</h1>
        <p className="text-muted-foreground mt-1">
          Fix what our reviewers flagged and resubmit. It goes straight back into the queue.
        </p>
        <Button asChild className="mt-5 h-11 rounded-xl px-5">
          <Link href="/candidate/onboarding/review">
            <PenLine /> Fix my profile
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 sm:p-7">
      <StatusBadge status={profile.status} />
      <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight">Hello, {name}</h1>
      <p className="text-muted-foreground mt-1">
        Your dashboard with views, unlocks and who unlocked you is on its way.
      </p>
    </div>
  );
};

export const CandidateHome = function () {
  const { data } = useCandidateProfile();

  if (!data) {
    return (
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <Stagger step={0.08} className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <StaggerItem>
        <Hero data={data} />
      </StaggerItem>
      <StaggerItem>
        <PreviewLabel />
        <CandidatePreviewCard preview={data.preview} status={data.profile.status} />
      </StaggerItem>
    </Stagger>
  );
};
