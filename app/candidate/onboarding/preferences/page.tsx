"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { FormToggleGroup } from "@/components/form/form-toggle-group";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { useCandidateProfile } from "@/hooks/use-candidate-profile";
import { useFormSeed } from "@/hooks/use-form-seed";
import { useSaveOnboardingStep } from "@/hooks/use-save-onboarding-step";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { AVAILABILITY_LABELS, JOB_TYPE_LABELS, nextPath, ONBOARDING_STEPS, WORK_MODE_LABELS } from "@/lib/onboarding";
import { preferencesSchema, toNumber, type PreferencesValues } from "@/schemas/candidate";

const asOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

const withCommas = (value: number | null) => (value === null ? "" : value.toLocaleString("en-NG"));

export default function PreferencesStepPage() {
  const { data } = useCandidateProfile();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      job_types: [],
      work_modes: [],
      salary_min: "",
      salary_max: "",
      availability: "",
      open_to_relocate: false,
    },
  });

  useFormSeed(data, reset, ({ profile: { preferences } }) => ({
    job_types: preferences.job_types,
    work_modes: preferences.work_modes,
    salary_min: withCommas(preferences.salary_min),
    salary_max: withCommas(preferences.salary_max),
    availability: preferences.availability ?? "",
    open_to_relocate: preferences.open_to_relocate,
  }));

  const { save, isPending } = useSaveOnboardingStep<unknown, PreferencesValues>({
    setError,
    url: API_ENDPOINTS.candidate.preferences,
    next: nextPath("PREFERENCES"),
    onSuccessMessage: "Preferences saved",
  });

  return (
    <OnboardingShell step="PREFERENCES">
      <StepHeader
        step="PREFERENCES"
        title="What you're looking for"
        lead="Companies filter on these, so be honest. You can change them any time without going back to review."
      />
      <form
        id="step-form"
        noValidate
        onSubmit={handleSubmit((values) =>
          save({ ...values, salary_min: toNumber(values.salary_min), salary_max: toNumber(values.salary_max) }),
        )}
        className="grid gap-6"
      >
        <FormToggleGroup<PreferencesValues>
          control={control}
          errors={errors}
          name="job_types"
          label="Job type"
          options={asOptions(JOB_TYPE_LABELS)}
        />
        <FormToggleGroup<PreferencesValues>
          control={control}
          errors={errors}
          name="work_modes"
          label="Way of working"
          options={asOptions(WORK_MODE_LABELS)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput<PreferencesValues>
            control={control}
            errors={errors}
            name="salary_min"
            inputMode="numeric"
            label="Expected monthly salary, from (₦)"
            placeholder="450,000"
          />
          <FormInput<PreferencesValues>
            control={control}
            errors={errors}
            name="salary_max"
            inputMode="numeric"
            label="To (₦)"
            placeholder="600,000"
          />
        </div>
        <FormToggleGroup<PreferencesValues>
          control={control}
          errors={errors}
          name="availability"
          label="When can you start?"
          multiple={false}
          options={asOptions(AVAILABILITY_LABELS)}
        />
        <FormInput<PreferencesValues>
          control={control}
          errors={errors}
          name="open_to_relocate"
          type="checkbox"
          label="I'm open to relocating to another state for the right role"
        />
      </form>
      <StepActions
        backHref={ONBOARDING_STEPS[4].path}
        formId="step-form"
        label="Continue to your CV"
        isLoading={isPending}
      />
    </OnboardingShell>
  );
}
