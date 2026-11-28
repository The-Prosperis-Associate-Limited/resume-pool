"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormChips } from "@/components/form/form-chips";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { Notice } from "@/components/shared/notice";
import { useCandidateProfile } from "@/hooks/use-candidate-profile";
import { useFormSeed } from "@/hooks/use-form-seed";
import { useSaveOnboardingStep } from "@/hooks/use-save-onboarding-step";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { nextPath, ONBOARDING_STEPS } from "@/lib/onboarding";
import { headlineSchema, type HeadlineValues } from "@/schemas/candidate";

export default function HeadlineStepPage() {
  const { data } = useCandidateProfile();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<HeadlineValues>({
    resolver: zodResolver(headlineSchema),
    defaultValues: { headline: "", summary: "", target_roles: [] },
  });

  useFormSeed(data, reset, ({ profile: { headline } }) => ({
    headline: headline.headline ?? "",
    summary: headline.summary ?? "",
    target_roles: headline.target_roles,
  }));

  const { save, isPending } = useSaveOnboardingStep<HeadlineValues, HeadlineValues>({
    setError,
    url: API_ENDPOINTS.candidate.headline,
    next: nextPath("HEADLINE"),
    onSuccessMessage: "Headline saved",
  });

  return (
    <OnboardingShell step="HEADLINE">
      <StepHeader
        step="HEADLINE"
        title="Your headline and target roles"
        lead="This is the first thing a company reads in search results, so make it specific."
      />
      <form id="step-form" noValidate onSubmit={handleSubmit((values) => save(values))} className="grid gap-5">
        <FormInput<HeadlineValues>
          control={control}
          errors={errors}
          name="headline"
          label="Headline"
          placeholder="Senior Accountant, ICAN chartered"
          maxLength={90}
        />
        <FormChips<HeadlineValues>
          control={control}
          errors={errors}
          name="target_roles"
          label="Roles you want"
          placeholder="Finance Manager"
          max={5}
        />
        <FormTextarea<HeadlineValues>
          control={control}
          errors={errors}
          name="summary"
          label="Summary (optional)"
          placeholder="Seven years in FMCG finance, leading month-end close and IFRS reporting…"
          maxLength={1200}
          rows={5}
        />
        <Notice tone="warning">
          Keep your name, employer names, phone and email out of these fields. Companies see them before they pay, and
          we&apos;ll ask you to remove them.
        </Notice>
      </form>
      <StepActions
        backHref={ONBOARDING_STEPS[0].path}
        formId="step-form"
        label="Continue to experience"
        isLoading={isPending}
      />
    </OnboardingShell>
  );
}
