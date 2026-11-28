"use client";

import { AlertCircle, ArrowRight, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppInput } from "@/components/shared/app-input";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { Notice } from "@/components/shared/notice";
import { useCandidateProfile, useOnboardingOptions } from "@/hooks/use-candidate-profile";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import {
  AVAILABILITY_LABELS,
  formatNaira,
  JOB_TYPE_LABELS,
  LANGUAGE_LEVEL_LABELS,
  ONBOARDING_STEPS,
  REVIEW_TURNAROUND,
  WORK_MODE_LABELS,
} from "@/lib/onboarding";
import type { OnboardingStep, OwnProfile } from "@/types/candidate";

const rowsFor = (profile: OwnProfile): Record<Exclude<OnboardingStep, "REVIEW">, React.ReactNode> => ({
  PERSONAL: [
    `${profile.personal.first_name ?? ""} ${profile.personal.last_name ?? ""}`.trim(),
    profile.personal.phone_no,
    [profile.personal.city, profile.personal.state].filter(Boolean).join(", "),
    profile.personal.photo_url ? "Photo added" : "No photo yet",
  ]
    .filter(Boolean)
    .join(" · "),
  HEADLINE: [profile.headline.headline, profile.headline.target_roles.join(", ")].filter(Boolean).join(" · "),
  EXPERIENCE: profile.experience.has_no_experience
    ? "No work experience yet"
    : profile.experience.experiences.map((entry) => `${entry.title}, ${entry.employer}`).join(" · "),
  EDUCATION: [
    ...profile.education.educations.map((entry) => `${entry.qualification}, ${entry.institution}`),
    ...profile.education.certifications.map((entry) => entry.name),
  ].join(" · "),
  SKILLS: [
    profile.skills.skills.join(", "),
    profile.skills.languages.map((entry) => `${entry.name} (${LANGUAGE_LEVEL_LABELS[entry.level]})`).join(", "),
  ]
    .filter(Boolean)
    .join(" · "),
  PREFERENCES: [
    profile.preferences.job_types.map((value) => JOB_TYPE_LABELS[value]).join(", "),
    profile.preferences.work_modes.map((value) => WORK_MODE_LABELS[value]).join(", "),
    profile.preferences.salary_min !== null &&
      `${formatNaira(profile.preferences.salary_min)}–${formatNaira(profile.preferences.salary_max ?? 0)} a month`,
    profile.preferences.availability && `Starts ${AVAILABILITY_LABELS[profile.preferences.availability].toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(" · "),
  CV: profile.cv ? (profile.cv.source === "BUILT" ? "Built from your profile" : profile.cv.file_name) : "",
  PRIVACY: profile.privacy.hidden_companies.length
    ? `Hidden from ${profile.privacy.hidden_companies.map((entry) => entry.name).join(", ")}`
    : "Visible to every subscribed company",
});

export default function ReviewStepPage() {
  const router = useRouter();
  const { data } = useCandidateProfile();
  const options = useOnboardingOptions();
  const [consent, setConsent] = useState(false);

  const { mutate, isPending } = useSubmitData<void>({
    url: API_ENDPOINTS.candidate.submit,
    getBody: () => ({ consent, consent_version: options?.consent.version }),
    onSuccessMessage: "Profile sent for review",
    onSuccess: () => router.replace("/candidate"),
  });

  const issues = data?.readiness.issues ?? [];
  const rows = data ? rowsFor(data.profile) : null;

  return (
    <OnboardingShell step="REVIEW">
      <StepHeader
        step="REVIEW"
        title="Check everything, then submit"
        lead={`Our team reviews every profile before it goes live, usually ${REVIEW_TURNAROUND}. You'll get an email either way.`}
      />

      <Notice tone="warning" show={issues.length > 0} className="mb-5">
        <p className="font-semibold">A few things to finish first</p>
        <ul className="mt-1.5 grid gap-1">
          {issues.map((issue) => (
            <li key={issue.message}>
              <Link
                href={`${ONBOARDING_STEPS.find((entry) => entry.step === issue.step)?.path}?from=review`}
                className="inline-flex items-center gap-1.5 underline-offset-2 hover:underline"
              >
                <AlertCircle className="size-3.5" /> {issue.message}
              </Link>
            </li>
          ))}
        </ul>
      </Notice>

      {rows && (
        <Stagger step={0.04} className="divide-y rounded-2xl border">
          {ONBOARDING_STEPS.map((entry) => (
            <StaggerItem key={entry.step} className="flex items-start gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{entry.label}</p>
                <p className="text-muted-foreground mt-0.5 text-[13px] break-words">
                  {rows[entry.step] || <span className="text-amber-700">Not filled in yet</span>}
                </p>
              </div>
              <Link
                href={`${entry.path}?from=review`}
                className="text-primary hover:bg-brand-50 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-semibold"
              >
                <Pencil className="size-3.5" /> Edit
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <div className="bg-page mt-6 rounded-2xl border p-4">
        <AppInput
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          label={options?.consent.text ?? "I agree to share my profile with subscribed companies."}
        />
      </div>

      <StepActions
        backHref={ONBOARDING_STEPS[7].path}
        label="Submit for review"
        isLoading={isPending}
        disabled={!consent || issues.length > 0 || !options}
        onClick={() => mutate()}
      />
      <p className="text-muted-foreground mt-3 flex items-center justify-end gap-1 text-xs">
        Your profile stays hidden until it&apos;s approved <ArrowRight className="size-3" />
      </p>
    </OnboardingShell>
  );
}
