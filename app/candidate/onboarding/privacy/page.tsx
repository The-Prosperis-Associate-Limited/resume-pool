"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormChips } from "@/components/form/form-chips";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { useCandidateProfile, useOnboardingOptions } from "@/hooks/use-candidate-profile";
import { useFormSeed } from "@/hooks/use-form-seed";
import { useSaveOnboardingStep } from "@/hooks/use-save-onboarding-step";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { ONBOARDING_STEPS, REVIEW_PATH } from "@/lib/onboarding";
import { privacySchema, type PrivacyValues } from "@/schemas/candidate";

export default function PrivacyStepPage() {
  const { data } = useCandidateProfile();
  const options = useOnboardingOptions();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrivacyValues>({ resolver: zodResolver(privacySchema), defaultValues: { hidden_companies: [] } });

  const employers = [...new Set(data?.profile.experience.experiences.map((entry) => entry.employer) ?? [])];

  useFormSeed(data, reset, ({ profile }) => ({
    hidden_companies: profile.privacy.hidden_companies.map((entry) => entry.name),
  }));

  const { save, isPending } = useSaveOnboardingStep<PrivacyValues>({
    url: API_ENDPOINTS.candidate.privacy,
    next: REVIEW_PATH,
    onSuccessMessage: "Privacy settings saved",
  });

  return (
    <OnboardingShell step="PRIVACY">
      <StepHeader
        step="PRIVACY"
        title="Privacy and consent"
        lead="You decide who can find you. Hidden companies never see your profile in search, even anonymised."
      />
      <form id="step-form" noValidate onSubmit={handleSubmit((values) => save(values))} className="grid gap-6">
        <div className="flex gap-3.5 rounded-2xl border p-4">
          <span className="bg-brand-50 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
            <EyeOff className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <FormChips<PrivacyValues>
              control={control}
              errors={errors}
              name="hidden_companies"
              label="Hide my profile from these companies"
              placeholder="Your current employer, for example"
              max={25}
              maxLength={120}
              suggestions={employers}
              hint="Tap a past employer below to hide it. We match company names loosely, so “Dangote” also hides “Dangote Group PLC”."
            />
          </div>
        </div>
        <div className="flex gap-3.5 rounded-2xl border p-4">
          <span className="bg-brand-50 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0 text-sm">
            <p className="font-bold">What you&apos;ll agree to when you submit</p>
            <p className="text-ink-2 mt-1">{options?.consent.text}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              You&apos;re told which company unlocks your CV, and you can pause or delete your profile at any time.
            </p>
          </div>
        </div>
      </form>
      <StepActions
        backHref={ONBOARDING_STEPS[6].path}
        formId="step-form"
        label="Review my profile"
        isLoading={isPending}
      />
    </OnboardingShell>
  );
}
