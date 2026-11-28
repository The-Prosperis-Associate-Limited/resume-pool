"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { AppDialog } from "@/components/shared/app-dialog";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { changeEmailSchema, type ChangeEmailValues } from "@/schemas/auth";
import type { APIResponse } from "@/types/response";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  onChanged: (email: string) => void;
}

const FORM_ID = "change-signup-email";

export const ChangeEmailDialog = function ({ isOpen, onOpenChange, currentEmail, onChanged }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { new_email: "", password: "" },
  });

  const { mutate, isPending } = useSubmitData<ChangeEmailValues & { email: string }, APIResponse<{ email: string }>>({
    url: API_ENDPOINTS.auth.changeSignupEmail,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "Email updated. We've sent a new code to it.",
    onSuccess: ({ data }) => {
      reset();
      onOpenChange(false);
      onChanged(data.email);
    },
  });

  return (
    <AppDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isSubmitting={isPending}
      title="Change your email"
      description={`Typo in ${currentEmail}? Enter the right address and the password you just chose.`}
      primaryAction={{ label: "Update and send code", form: FORM_ID, isLoading: isPending }}
    >
      <form
        id={FORM_ID}
        className="grid gap-4"
        noValidate
        onSubmit={handleSubmit((values) => mutate({ ...values, email: currentEmail }))}
      >
        <FormInput<ChangeEmailValues>
          control={control}
          errors={errors}
          name="new_email"
          type="email"
          label="New email"
          icon={Mail}
          autoComplete="email"
        />
        <FormInput<ChangeEmailValues>
          control={control}
          errors={errors}
          name="password"
          type="password"
          label="Password"
          icon={LockKeyhole}
          autoComplete="current-password"
        />
      </form>
    </AppDialog>
  );
};
