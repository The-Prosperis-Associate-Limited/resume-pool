"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidateProfile } from "@/hooks/use-candidate-profile";
import { fadeUp, SOFT_SPRING } from "@/lib/motion";
import { AVAILABILITY_LABELS, formatNaira, JOB_TYPE_LABELS, ONBOARDING_STEPS, REVIEW_PATH } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import type { CandidateProfileResponse, OnboardingStep } from "@/types/candidate";
import { CandidatePreviewCard, PreviewLabel } from "./candidate-preview-card";

const summaryFor = (step: OnboardingStep, { profile, preview }: CandidateProfileResponse): string | null => {
  switch (step) {
    case "PERSONAL":
      return (
        [
          profile.personal.first_name && `${profile.personal.first_name} ${profile.personal.last_name ?? ""}`.trim(),
          profile.personal.city,
        ]
          .filter(Boolean)
          .join(" · ") || null
      );
    case "HEADLINE":
      return profile.headline.headline;
    case "EXPERIENCE":
      return profile.experience.has_no_experience
        ? "No experience yet"
        : profile.experience.experiences.length
          ? `${profile.experience.experiences.length} role${profile.experience.experiences.length === 1 ? "" : "s"} · ${Math.floor(preview.months_experience / 12)} yrs`
          : null;
    case "EDUCATION":
      return (
        [profile.education.educations[0]?.qualification, profile.education.certifications[0]?.name]
          .filter(Boolean)
          .join(" · ") || null
      );
    case "SKILLS":
      return profile.skills.skills.length ? `${profile.skills.skills.length} skills` : null;
    case "PREFERENCES":
      return profile.preferences.job_types.length && profile.preferences.salary_min !== null
        ? `${JOB_TYPE_LABELS[profile.preferences.job_types[0]]} · ${formatNaira(profile.preferences.salary_min)}–${formatNaira(profile.preferences.salary_max ?? 0)}`
        : profile.preferences.availability && AVAILABILITY_LABELS[profile.preferences.availability];
    case "CV":
      return profile.cv
        ? profile.cv.source === "BUILT"
          ? "Built from your profile"
          : profile.cv.file_name
        : "PDF or Word, up to 5 MB";
    case "PRIVACY":
      return profile.privacy.hidden_companies.length
        ? `Hidden from ${profile.privacy.hidden_companies.length}`
        : "Hide from companies";
    default:
      return null;
  }
};

interface Props {
  step: OnboardingStep;
  children: React.ReactNode;
}

export const OnboardingShell = function ({ step, children }: Props) {
  const { data } = useCandidateProfile();
  const total = ONBOARDING_STEPS.length;
  const currentIndex = step === "REVIEW" ? total : ONBOARDING_STEPS.findIndex((entry) => entry.step === step);
  const reached = data
    ? data.profile.onboarding_step === "REVIEW"
      ? total
      : ONBOARDING_STEPS.findIndex((entry) => entry.step === data.profile.onboarding_step)
    : 0;
  const locked = !!data && data.profile.status !== "UNSUBMITTED" && data.profile.status !== "REJECTED";
  const router = useRouter();

  useEffect(() => {
    if (locked) router.replace("/candidate");
  }, [locked, router]);
  const percent = Math.round((Math.min(currentIndex + 1, total) / total) * 100);

  return (
    <div className="bg-page min-h-screen">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-white/95 px-4 backdrop-blur sm:h-17 sm:px-7">
        <Logo href="/candidate" />
        <div className="hidden max-w-90 flex-1 items-center gap-3 md:flex">
          <span className="text-sm font-bold whitespace-nowrap">
            {step === "REVIEW" ? "Review" : `Step ${currentIndex + 1} of ${total}`}
          </span>
          <span className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
            <motion.i
              className="bg-primary block h-full rounded-full"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={SOFT_SPRING}
            />
          </span>
          <span className="text-muted-foreground text-sm tabular-nums">{percent}%</span>
        </div>
        <Button asChild variant="outline" size="sm" className="h-9 rounded-lg px-3.5">
          <Link href="/candidate">Save &amp; exit</Link>
        </Button>
      </header>

      <div className="mx-auto grid max-w-320 grid-cols-[minmax(0,1fr)] items-start gap-7 px-4 pt-5 pb-16 sm:px-7 sm:pt-8 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_320px]">
        <ol className="sticky top-25 hidden lg:block">
          {ONBOARDING_STEPS.map((entry, index) => {
            const done = data
              ? index < reached || (data.profile.onboarding_step === "REVIEW" && index !== currentIndex)
              : false;
            const now = index === currentIndex;
            const reachable = !locked && (index <= reached || done);
            const summary = data ? summaryFor(entry.step, data) : null;
            const body = (
              <>
                <span
                  className={cn(
                    "text-faint relative z-1 grid size-7 shrink-0 place-items-center rounded-full border-2 bg-white text-xs font-bold",
                    done && !now && "border-primary bg-primary text-white",
                    now &&
                      "border-primary text-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_14%,transparent)]",
                  )}
                >
                  {done && !now ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
                </span>
                <span className="min-w-0 pt-0.5">
                  <span
                    className={cn(
                      "block truncate text-sm",
                      (done || now) && "text-foreground",
                      now && "text-brand-700 font-bold",
                    )}
                  >
                    {entry.label}
                  </span>
                  {summary && <small className="text-faint block truncate text-xs">{summary}</small>}
                </span>
              </>
            );
            return (
              <li
                key={entry.step}
                className={cn(
                  "text-muted-foreground relative pb-5.5",
                  index < total - 1 &&
                    "before:bg-border before:absolute before:top-7.5 before:bottom-1 before:left-3.25 before:w-0.5 before:rounded-full",
                  done && index < total - 1 && "before:bg-brand-600",
                )}
              >
                {reachable && !now ? (
                  <Link href={entry.path} className="flex gap-3 rounded-lg transition-opacity hover:opacity-80">
                    {body}
                  </Link>
                ) : (
                  <div className="flex gap-3" aria-current={now ? "step" : undefined}>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
          <li className="text-muted-foreground relative">
            {reached >= total && !locked ? (
              <Link
                href={REVIEW_PATH}
                className={cn("flex items-center gap-3 text-sm", step === "REVIEW" && "text-brand-700 font-bold")}
              >
                <span className="grid size-7 place-items-center rounded-full border-2 bg-white text-xs font-bold">
                  ✓
                </span>
                Review &amp; submit
              </Link>
            ) : (
              <span className="flex items-center gap-3 text-sm">
                <span className="grid size-7 place-items-center rounded-full border-2 bg-white text-xs font-bold">
                  ✓
                </span>
                Review &amp; submit
              </span>
            )}
          </li>
        </ol>

        <div className="min-w-0">
          {step !== "REVIEW" && (
            <div className="mb-4 flex gap-1 lg:hidden">
              {ONBOARDING_STEPS.map((entry, index) => (
                <i
                  key={entry.step}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    index <= currentIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>
          )}
          <motion.main
            key={step}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-[18px] border bg-white p-5 shadow-xs sm:p-8"
          >
            {children}
          </motion.main>
        </div>

        <aside className="sticky top-25 hidden xl:block">
          <PreviewLabel />
          {data ? (
            <CandidatePreviewCard preview={data.preview} status={data.profile.status} />
          ) : (
            <Skeleton className="h-96 rounded-2xl" />
          )}
        </aside>
      </div>
    </div>
  );
};
