"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { Notice } from "@/components/shared/notice";
import { Swap } from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useStartSession } from "@/hooks/use-start-session";
import { useSubmitData } from "@/hooks/use-submit-data";
import { authRedirectError } from "@/lib/auth-messages";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { useHandleErrors } from "@/lib/handle-errors";
import { emailOnlySchema, type EmailOnlyValues } from "@/schemas/auth";
import { useAuthFlow } from "@/store/auth-flow";
import type { AuthSession } from "@/types/auth";
import type { APIResponse } from "@/types/response";
import { InboxArt } from "@/components/illustrations/auth-art";
import { AuthHeading, AuthShell } from "./auth-shell";
import { ChangeEmailDialog } from "./change-email-dialog";
import { CodeStep } from "./code-step";

const AskForEmail = function ({ onSent }: { onSent: (email: string) => void }) {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EmailOnlyValues>({ resolver: zodResolver(emailOnlySchema), defaultValues: { email: "" } });

  const { mutate, isPending } = useSubmitData<EmailOnlyValues>({
    url: API_ENDPOINTS.auth.sendEmailOtp,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "If that email needs verifying, a code is on its way.",
    onSuccess: () => onSent(getValues("email")),
  });

  return (
    <form className="grid gap-4" noValidate onSubmit={handleSubmit((values) => mutate(values))}>
      <FormInput<EmailOnlyValues>
        control={control}
        errors={errors}
        name="email"
        type="email"
        label="Email"
        icon={Mail}
        autoComplete="email"
      />
      <Button type="submit" isLoading={isPending} className="h-12 w-full rounded-xl text-[15px] font-semibold">
        Send me a code
      </Button>
    </form>
  );
};

export const VerifyEmailForm = function () {
  const hydrated = useHydrated();
  const linkError = authRedirectError(useSearchParams().get("error"));
  const { pendingEmail, codeSentAt, startVerification, markCodeSent } = useAuthFlow();
  const [changingEmail, setChangingEmail] = useState(false);
  const [failures, setFailures] = useState(0);
  const handleErrors = useHandleErrors();
  const startSession = useStartSession();

  const { mutate: verify, isPending: isVerifying } = useSubmitData<
    { email: string; code: string },
    APIResponse<AuthSession>
  >({
    url: API_ENDPOINTS.auth.verifyEmailOtp,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "Email verified",
    onSuccess: ({ data }) => startSession(data),
    onError: (error) => {
      setFailures((count) => count + 1);
      handleErrors(error);
    },
  });

  const { mutate: resend, isPending: isResending } = useSubmitData<{ email: string }>({
    url: API_ENDPOINTS.auth.sendEmailOtp,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "A new code is on its way",
    onSuccess: () => markCodeSent(),
  });

  const email = hydrated ? pendingEmail : null;

  return (
    <AuthShell
      art="verify"
      topRight={
        <Button asChild variant="ghost" size="sm" className="rounded-lg">
          <Link href="/auth/signup">
            <ArrowLeft /> Back
          </Link>
        </Button>
      }
    >
      <AuthHeading
        icon={<InboxArt className="mb-5" />}
        title="Check your inbox"
        lead={
          email ? (
            <>
              We sent a 6-digit code to <b className="text-foreground break-all">{email}</b>. It expires in 10 minutes.
            </>
          ) : (
            "Enter the email you signed up with and we'll send you a fresh 6-digit code."
          )
        }
      />

      {linkError && (
        <Notice tone="warning" className="mb-4">
          {linkError}
        </Notice>
      )}

      {hydrated && (
        <Swap swapKey={email ? `code:${email}` : "ask"}>
          {email ? (
            <>
              <CodeStep
                key={email}
                codeSentAt={codeSentAt}
                isVerifying={isVerifying}
                isResending={isResending}
                submitLabel="Verify email"
                failures={failures}
                onVerify={(code) => verify({ email, code })}
                onResend={() => resend({ email })}
                secondaryAction={
                  <button
                    type="button"
                    className="text-primary font-semibold hover:underline"
                    onClick={() => setChangingEmail(true)}
                  >
                    Change email
                  </button>
                }
                footnote="The email also has a link. Either one works, use whichever is easier on this device."
              />
              <ChangeEmailDialog
                isOpen={changingEmail}
                onOpenChange={setChangingEmail}
                currentEmail={email}
                onChanged={(next) => startVerification(next)}
              />
            </>
          ) : (
            <AskForEmail onSent={(next) => startVerification(next)} />
          )}
        </Swap>
      )}
    </AuthShell>
  );
};
