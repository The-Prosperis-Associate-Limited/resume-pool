"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AddRowButton, RepeatRow, StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { useCandidateProfile } from "@/hooks/use-candidate-profile";
import { useFormSeed } from "@/hooks/use-form-seed";
import { useSaveOnboardingStep } from "@/hooks/use-save-onboarding-step";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { nextPath, ONBOARDING_STEPS } from "@/lib/onboarding";
import { educationSchema, toOptionalYear, type EducationValues } from "@/schemas/candidate";

const EMPTY_EDUCATION: EducationValues["educations"][number] = {
  institution: "",
  qualification: "",
  field_of_study: "",
  grade: "",
  start_year: "",
  end_year: "",
};
const EMPTY_CERTIFICATION: EducationValues["certifications"][number] = { name: "", issuer: "", year: "" };

export default function EducationStepPage() {
  const { data } = useCandidateProfile();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: { educations: [EMPTY_EDUCATION], certifications: [] },
  });

  const educations = useFieldArray({ control, name: "educations" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const watchedEducations = useWatch({ control, name: "educations" });
  const watchedCertifications = useWatch({ control, name: "certifications" });

  useFormSeed(data, reset, ({ profile: { education } }) => ({
    educations: education.educations.length
      ? education.educations.map((entry) => ({
          institution: entry.institution,
          qualification: entry.qualification,
          field_of_study: entry.field_of_study ?? "",
          grade: entry.grade ?? "",
          start_year: entry.start_year?.toString() ?? "",
          end_year: entry.end_year?.toString() ?? "",
        }))
      : [EMPTY_EDUCATION],
    certifications: education.certifications.map((entry) => ({
      name: entry.name,
      issuer: entry.issuer ?? "",
      year: entry.year?.toString() ?? "",
    })),
  }));

  const { save, isPending } = useSaveOnboardingStep<unknown, EducationValues>({
    setError,
    url: API_ENDPOINTS.candidate.education,
    next: nextPath("EDUCATION"),
    onSuccessMessage: "Education saved",
  });

  return (
    <OnboardingShell step="EDUCATION">
      <StepHeader
        step="EDUCATION"
        title="Education and certifications"
        lead="Your qualifications and professional certifications show in search. Institution names stay hidden until an unlock."
      />
      <form
        id="step-form"
        noValidate
        onSubmit={handleSubmit((values) =>
          save({
            educations: values.educations.map((entry) => ({
              institution: entry.institution,
              qualification: entry.qualification,
              field_of_study: entry.field_of_study || undefined,
              grade: entry.grade || undefined,
              start_year: toOptionalYear(entry.start_year),
              end_year: toOptionalYear(entry.end_year),
            })),
            certifications: values.certifications.map((entry) => ({
              name: entry.name,
              issuer: entry.issuer || undefined,
              year: toOptionalYear(entry.year),
            })),
          }),
        )}
        className="grid gap-4"
      >
        <AnimatePresence initial={false}>
          {educations.fields.map((field, index) => (
            <RepeatRow
              key={field.id}
              title={watchedEducations?.[index]?.qualification || `Qualification ${index + 1}`}
              subtitle={watchedEducations?.[index]?.institution || "Degree, diploma or certificate"}
              onRemove={educations.fields.length > 1 ? () => educations.remove(index) : undefined}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`educations.${index}.qualification`}
                  label="Qualification"
                  placeholder="B.Sc, HND, OND, SSCE"
                />
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`educations.${index}.field_of_study`}
                  label="Field of study (optional)"
                  placeholder="Accounting"
                />
              </div>
              <FormInput<EducationValues>
                control={control}
                errors={errors}
                name={`educations.${index}.institution`}
                label="Institution"
                placeholder="University of Lagos"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`educations.${index}.grade`}
                  label="Grade (optional)"
                  placeholder="Second Class Upper"
                />
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`educations.${index}.start_year`}
                  inputMode="numeric"
                  maxLength={4}
                  label="Start year"
                  placeholder="2012"
                />
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`educations.${index}.end_year`}
                  inputMode="numeric"
                  maxLength={4}
                  label="End year"
                  placeholder="2016"
                />
              </div>
            </RepeatRow>
          ))}
        </AnimatePresence>
        {educations.fields.length < 10 && (
          <AddRowButton onClick={() => educations.append(EMPTY_EDUCATION)}>Add another qualification</AddRowButton>
        )}

        <h2 className="mt-4 text-[17px] font-bold">Professional certifications</h2>
        <p className="text-muted-foreground -mt-3 text-sm">
          ICAN, ACCA, PMP, CCNA and the like. Optional, but companies filter on them.
        </p>
        <AnimatePresence initial={false}>
          {certifications.fields.map((field, index) => (
            <RepeatRow
              key={field.id}
              title={watchedCertifications?.[index]?.name || `Certification ${index + 1}`}
              onRemove={() => certifications.remove(index)}
            >
              <div className="grid gap-4 sm:grid-cols-[2fr_2fr_1fr]">
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`certifications.${index}.name`}
                  label="Certification"
                  placeholder="ICAN"
                />
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`certifications.${index}.issuer`}
                  label="Issued by (optional)"
                />
                <FormInput<EducationValues>
                  control={control}
                  errors={errors}
                  name={`certifications.${index}.year`}
                  inputMode="numeric"
                  maxLength={4}
                  label="Year"
                  placeholder="2018"
                />
              </div>
            </RepeatRow>
          ))}
        </AnimatePresence>
        {certifications.fields.length < 15 && (
          <AddRowButton onClick={() => certifications.append(EMPTY_CERTIFICATION)}>Add a certification</AddRowButton>
        )}
      </form>
      <StepActions
        backHref={ONBOARDING_STEPS[2].path}
        formId="step-form"
        label="Continue to skills"
        isLoading={isPending}
      />
    </OnboardingShell>
  );
}
