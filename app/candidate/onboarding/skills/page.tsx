"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "motion/react";
import { get, useFieldArray, useForm } from "react-hook-form";
import { FormChips } from "@/components/form/form-chips";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AddRowButton, RepeatRow, StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { Notice } from "@/components/shared/notice";
import { useCandidateProfile, useOnboardingOptions } from "@/hooks/use-candidate-profile";
import { useFormSeed } from "@/hooks/use-form-seed";
import { useSaveOnboardingStep } from "@/hooks/use-save-onboarding-step";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { LANGUAGE_LEVEL_LABELS, nextPath, ONBOARDING_STEPS } from "@/lib/onboarding";
import { skillsSchema, type SkillsValues } from "@/schemas/candidate";

const LEVEL_OPTIONS = Object.entries(LANGUAGE_LEVEL_LABELS).map(([value, label]) => ({ value, label }));
const LANGUAGE_SUGGESTIONS = ["English", "Yoruba", "Igbo", "Hausa", "Pidgin", "French"];

export default function SkillsStepPage() {
  const { data } = useCandidateProfile();
  const options = useOnboardingOptions();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillsValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: { skills: [], languages: [{ name: "English", level: "FLUENT" }] },
  });

  const languages = useFieldArray({ control, name: "languages" });

  useFormSeed(data, reset, ({ profile: { skills } }): SkillsValues => ({
    skills: skills.skills,
    languages: skills.languages.length
      ? skills.languages.map(({ name, level }) => ({ name, level }))
      : [{ name: "English", level: "FLUENT" }],
  }));

  const { save, isPending } = useSaveOnboardingStep<SkillsValues>({
    url: API_ENDPOINTS.candidate.skills,
    next: nextPath("SKILLS"),
    onSuccessMessage: "Skills saved",
  });

  const minSkills = options?.standards.profile.minSkills ?? 3;
  const languageError = (get(errors, "languages") as { message?: string } | undefined)?.message;

  return (
    <OnboardingShell step="SKILLS">
      <StepHeader
        step="SKILLS"
        title="Skills and languages"
        lead="Companies search by skill, so list the tools and techniques you actually use at work."
      />
      <form id="step-form" noValidate onSubmit={handleSubmit((values) => save(values))} className="grid gap-5">
        <FormChips<SkillsValues>
          control={control}
          errors={errors}
          name="skills"
          label="Skills"
          placeholder="IFRS, Sage 300, Excel…"
          max={options?.standards.profile.maxSkills ?? 30}
          maxLength={40}
          hint={`Add at least ${minSkills}. Press Enter or comma after each one.`}
        />

        <h2 className="mt-2 text-[17px] font-bold">Languages</h2>
        <AnimatePresence initial={false}>
          {languages.fields.map((field, index) => (
            <RepeatRow
              key={field.id}
              title={`Language ${index + 1}`}
              onRemove={languages.fields.length > 1 ? () => languages.remove(index) : undefined}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput<SkillsValues>
                  control={control}
                  errors={errors}
                  name={`languages.${index}.name`}
                  label="Language"
                  list="language-suggestions"
                />
                <FormSelect<SkillsValues>
                  control={control}
                  errors={errors}
                  name={`languages.${index}.level`}
                  label="Level"
                  options={LEVEL_OPTIONS}
                />
              </div>
            </RepeatRow>
          ))}
        </AnimatePresence>
        <datalist id="language-suggestions">
          {LANGUAGE_SUGGESTIONS.map((language) => (
            <option key={language} value={language} />
          ))}
        </datalist>
        <Notice tone="danger" show={!!languageError}>
          {languageError}
        </Notice>
        {languages.fields.length < 10 && (
          <AddRowButton onClick={() => languages.append({ name: "", level: "CONVERSATIONAL" })}>
            Add a language
          </AddRowButton>
        )}
      </form>
      <StepActions
        backHref={ONBOARDING_STEPS[3].path}
        formId="step-form"
        label="Continue to preferences"
        isLoading={isPending}
      />
    </OnboardingShell>
  );
}
