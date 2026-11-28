"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { Swap } from "@/components/motion/motion-primitives";
import { Notice } from "@/components/shared/notice";
import { Button } from "@/components/ui/button";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { useHandleErrors } from "@/lib/handle-errors";
import { resetPasswordSchema, type ResetPasswordValues } from "@/schemas/auth";
import { LockArt, VerifiedArt } from "@/components/illustrations/auth-art";
import { AuthHeading, AuthShell } from "./auth-shell";
import { PasswordMeter } from "./password-meter";

export const ResetPasswordForm = function () {
  const params = useSearchParams();
  const token = params.get("token");
  const isAdmin = params.get("surface") === "admin";
  const signinHref = isAdmin ? "/admin/auth/signin" : "/auth/signin";
  const forgotHref = isAdmin ? "/auth/forgot-password?surface=admin" : "/auth/forgot-password";
  const handleErrors = useHandleErrors();
  const [done, setDone] = useState(false);
  const [linkDead, setLinkDead] = useState(!token);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  const password = useWatch({ control, name: "password" });

  const { mutate, isPending } = useSubmitData<ResetPasswordValues & { token: string }>({
    url: API_ENDPOINTS.auth.resetPassword,
    skipAuth: true,
    skipRefetch: true,
    silent: true,
    onSuccess: () => setDone(true),
    onError: (error) => {
      if (error.response?.status === 401) return setLinkDead(true);
      handleErrors(error);
    },
  });

  const state = done ? "done" : linkDead ? "dead" : "form";

  return (
    <AuthShell art="reset" logoHref={isAdmin ? signinHref : "/"}>
      <Swap swapKey={state}>
        {state === "done" ? (
          <>
            <AuthHeading
              icon={<VerifiedArt className="mb-5" />}
              title="Password reset"
              lead="Your new password is saved and every other device has been signed out. Sign in with it now."
            />
            <Button asChild className="h-12 w-full rounded-xl text-[15px] font-semibold">
              <Link href={signinHref}>Sign in</Link>
            </Button>
          </>
        ) : (
          <>
            <AuthHeading
              icon={<LockArt className="mb-5" />}
              title="Choose a new password"
              lead="8+ characters with a letter and a number. You'll be signed out everywhere else."
            />
            {state === "dead" ? (
              <div className="grid gap-4">
                <Notice tone="warning">
                  This reset link has expired or has already been used. Reset links last 10 minutes and work once.
                </Notice>
                <Button asChild className="h-12 w-full rounded-xl text-[15px] font-semibold">
                  <Link href={forgotHref}>Get a new code</Link>
                </Button>
              </div>
            ) : (
              <form
                className="grid gap-4"
                noValidate
                onSubmit={handleSubmit((values) => mutate({ ...values, token: token as string }))}
              >
                <FormInput<ResetPasswordValues>
                  control={control}
                  errors={errors}
                  name="password"
                  type="password"
                  label="New password"
                  autoComplete="new-password"
                  hint={<PasswordMeter password={password ?? ""} />}
                />
                <FormInput<ResetPasswordValues>
                  control={control}
                  errors={errors}
                  name="confirm_password"
                  type="password"
                  label="Repeat new password"
                  autoComplete="new-password"
                />
                <Button
                  type="submit"
                  isLoading={isPending}
                  className="h-12 w-full rounded-xl text-[15px] font-semibold"
                >
                  Reset password
                </Button>
              </form>
            )}
          </>
        )}
      </Swap>
    </AuthShell>
  );
};
