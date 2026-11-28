"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { get, useFieldArray, useForm, useWatch } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AddRowButton, RepeatRow, StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { Collapse } from "@/components/motion/motion-primitives";
import { Notice } from "@/components/shared/notice";
import { useCandidateProfile } from "@/hooks/use-candidate-profile";
import { useFormSeed } from "@/hooks/use-form-seed";
import { useSaveOnboardingStep } from "@/hooks/use-save-onboarding-step";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { nextPath, ONBOARDING_STEPS } from "@/lib/onboarding";
import { experienceSchema, type ExperienceValues } from "@/schemas/candidate";

const EMPTY_ROLE: ExperienceValues["experiences"][number] = {
  title: "",
  employer: "",
  location: "",
  started_at: "",
  ended_at: "",
  is_current: false,
  achievements: "",
};

const thisMonth = () => new Date().toISOString().slice(0, 7);

export default function ExperienceStepPage() {
  const { data } = useCandidateProfile();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { has_no_experience: false, experiences: [EMPTY_ROLE] },
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "experiences" });
  const watched = useWatch({ control, name: "experiences" });
  const noExperience = useWatch({ control, name: "has_no_experience" });

  useEffect(() => {
    if (noExperience && fields.length) replace([]);
    if (!noExperience && !fields.length) append(EMPTY_ROLE);
  }, [noExperience, fields.length, replace, append]);

  useFormSeed(data, reset, ({ profile: { experience } }) => ({
    has_no_experience: experience.has_no_experience,
    experiences: experience.experiences.length
      ? experience.experiences.map((entry) => ({
          ...entry,
          location: entry.location ?? "",
          ended_at: entry.ended_at ?? "",
          achievements: entry.achievements ?? "",
        }))
      : experience.has_no_experience
        ? []
        : [EMPTY_ROLE],
  }));

  const { save, isPending } = useSaveOnboardingStep<unknown, ExperienceValues>({
    setError,
    url: API_ENDPOINTS.candidate.experience,
    next: nextPath("EXPERIENCE"),
    onSuccessMessage: "Work experience saved",
  });

  const listError = (get(errors, "experiences") as { message?: string } | undefined)?.message;

  return (
    <OnboardingShell step="EXPERIENCE">
      <StepHeader
        step="EXPERIENCE"
        title="Your work experience"
        lead="Job titles and how long you held them show in search. Employer names stay hidden until a company unlocks you."
      />
      <form
        id="step-form"
        noValidate
        onSubmit={handleSubmit((values) =>
          save({
            has_no_experience: values.has_no_experience,
            experiences: values.has_no_experience
              ? []
              : values.experiences.map((entry) => ({
                  ...entry,
                  ended_at: entry.is_current || !entry.ended_at ? undefined : entry.ended_at,
                  location: entry.location || undefined,
                  achievements: entry.achievements || undefined,
                })),
          }),
        )}
        className="grid gap-4"
      >
        <FormInput<ExperienceValues>
          control={control}
          errors={errors}
          name="has_no_experience"
          type="checkbox"
          label="I don't have any work experience yet (graduate, school leaver or career starter)"
        />

        <Collapse show={!noExperience} className="grid gap-4">
          <AnimatePresence initial={false}>
            {fields.map((field, index) => (
              <RepeatRow
                key={field.id}
                title={watched?.[index]?.title || `Role ${index + 1}`}
                subtitle={watched?.[index]?.employer || "Job title and employer"}
                onRemove={fields.length > 1 ? () => remove(index) : undefined}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput<ExperienceValues>
                    control={control}
                    errors={errors}
                    name={`experiences.${index}.title`}
                    label="Job title"
                    placeholder="Senior Accountant"
                  />
                  <FormInput<ExperienceValues>
                    control={control}
                    errors={errors}
                    name={`experiences.${index}.employer`}
                    label="Employer"
                    placeholder="Company name"
                  />
                </div>
                <FormInput<ExperienceValues>
                  control={control}
                  errors={errors}
                  name={`experiences.${index}.location`}
                  label="Location (optional)"
                  placeholder="Lagos"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput<ExperienceValues>
                    control={control}
                    errors={errors}
                    name={`experiences.${index}.started_at`}
                    type="month"
                    max={thisMonth()}
                    label="Started"
                  />
                  {!watched?.[index]?.is_current && (
                    <FormInput<ExperienceValues>
                      control={control}
                      errors={errors}
                      name={`experiences.${index}.ended_at`}
                      type="month"
                      max={thisMonth()}
                      label="Ended"
                    />
                  )}
                </div>
                <FormInput<ExperienceValues>
                  control={control}
                  errors={errors}
                  name={`experiences.${index}.is_current`}
                  type="checkbox"
                  label="I work here now"
                />
                <FormTextarea<ExperienceValues>
                  control={control}
                  errors={errors}
                  name={`experiences.${index}.achievements`}
                  label="What you achieved (optional)"
                  hint="One per line. Shown only after an unlock."
                  placeholder={"Closed the books 5 days faster\nLed the IFRS 16 adoption"}
                  maxLength={1500}
                  rows={3}
                />
              </RepeatRow>
            ))}
          </AnimatePresence>
          <Notice tone="danger" show={!!listError}>
            {listError}
          </Notice>
          {fields.length < 15 && <AddRowButton onClick={() => append(EMPTY_ROLE)}>Add another role</AddRowButton>}
        </Collapse>
      </form>
      <StepActions
        backHref={ONBOARDING_STEPS[1].path}
        formId="step-form"
        label="Continue to education"
        isLoading={isPending}
      />
    </OnboardingShell>
  );
}
