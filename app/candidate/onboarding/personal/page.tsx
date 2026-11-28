"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { PhotoField } from "@/components/onboarding/photo-field";
import { StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { useCandidateProfile, useOnboardingOptions } from "@/hooks/use-candidate-profile";
import { useFormSeed } from "@/hooks/use-form-seed";
import { useSaveOnboardingStep } from "@/hooks/use-save-onboarding-step";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { nextPath } from "@/lib/onboarding";
import { personalSchema, type PersonalValues } from "@/schemas/candidate";

export default function PersonalStepPage() {
  const { data } = useCandidateProfile();
  const options = useOnboardingOptions();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: { first_name: "", last_name: "", phone_no: "", state: "", city: "" },
  });

  useFormSeed(data, reset, ({ profile: { personal } }) => ({
    first_name: personal.first_name ?? "",
    last_name: personal.last_name ?? "",
    phone_no: personal.phone_no ?? "",
    state: personal.state ?? "",
    city: personal.city ?? "",
  }));

  const { save, isPending } = useSaveOnboardingStep<PersonalValues>({
    url: API_ENDPOINTS.candidate.personal,
    next: nextPath("PERSONAL"),
    onSuccessMessage: "Personal details saved",
  });

  return (
    <OnboardingShell step="PERSONAL">
      <StepHeader
        step="PERSONAL"
        title="Tell us about you"
        lead="Companies only see your name, photo and contact details after they unlock your CV."
      />
      <form id="step-form" noValidate onSubmit={handleSubmit((values) => save(values))} className="grid gap-5">
        <PhotoField photoUrl={data?.profile.personal.photo_url ?? null} standards={options?.standards.photo} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput<PersonalValues>
            control={control}
            errors={errors}
            name="first_name"
            label="First name"
            autoComplete="given-name"
          />
          <FormInput<PersonalValues>
            control={control}
            errors={errors}
            name="last_name"
            label="Last name"
            autoComplete="family-name"
          />
        </div>
        <FormInput<PersonalValues>
          control={control}
          errors={errors}
          name="phone_no"
          type="tel"
          label="Phone number"
          placeholder="0803 000 0000"
          icon={Phone}
          autoComplete="tel"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect<PersonalValues>
            control={control}
            errors={errors}
            name="state"
            label="State"
            placeholder="Choose your state"
            options={(options?.states ?? []).map((state) => ({ value: state, label: state }))}
          />
          <FormInput<PersonalValues>
            control={control}
            errors={errors}
            name="city"
            label="City or area"
            placeholder="Ikeja"
            autoComplete="address-level2"
          />
        </div>
      </form>
      <StepActions formId="step-form" label="Continue to headline" isLoading={isPending} />
    </OnboardingShell>
  );
}
