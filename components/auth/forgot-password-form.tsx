"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { Swap } from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { useHandleErrors } from "@/lib/handle-errors";
import { emailOnlySchema, type EmailOnlyValues } from "@/schemas/auth";
import type { APIResponse } from "@/types/response";
import { KeyArt } from "@/components/illustrations/auth-art";
import { AuthHeading, AuthShell } from "./auth-shell";
import { CodeStep } from "./code-step";

export const ForgotPasswordForm = function () {
  const router = useRouter();
  const isAdmin = useSearchParams().get("surface") === "admin";
  const signinHref = isAdmin ? "/admin/auth/signin" : "/auth/signin";
  const [email, setEmail] = useState<string | null>(null);
  const [codeSentAt, setCodeSentAt] = useState<number | null>(null);
  const [failures, setFailures] = useState(0);
  const handleErrors = useHandleErrors();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<EmailOnlyValues>({ resolver: zodResolver(emailOnlySchema), defaultValues: { email: "" } });

  const { mutate: sendCode, isPending: isSending } = useSubmitData<EmailOnlyValues>({
    url: API_ENDPOINTS.auth.sendPasswordResetOtp,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "If that account exists, a reset code is on its way.",
    onSuccess: () => {
      setEmail(getValues("email"));
      setCodeSentAt(Date.now());
    },
  });

  const { mutate: verify, isPending: isVerifying } = useSubmitData<
    { email: string; code: string },
    APIResponse<{ resetToken: string }>
  >({
    url: API_ENDPOINTS.auth.verifyPasswordResetOtp,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "Code accepted. Choose a new password.",
    onSuccess: ({ data }) =>
      router.push(
        `/auth/reset-password?token=${encodeURIComponent(data.resetToken)}${isAdmin ? "&surface=admin" : ""}`,
      ),
    onError: (error) => {
      setFailures((count) => count + 1);
      handleErrors(error);
    },
  });

  const icon = <KeyArt className="mb-5" />;

  return (
    <AuthShell
      art="reset"
      logoHref={isAdmin ? signinHref : "/"}
      topRight={
        <Button asChild variant="ghost" size="sm" className="rounded-lg">
          <Link href={signinHref}>
            <ArrowLeft /> Back to sign in
          </Link>
        </Button>
      }
    >
      <Swap swapKey={email ? `code:${email}` : "ask"}>
        {email ? (
          <>
            <AuthHeading
              icon={icon}
              title="Enter your reset code"
              lead={
                <>
                  If <b className="text-foreground break-all">{email}</b> has an account, we&rsquo;ve sent it a 6-digit
                  code. It expires in 10 minutes.
                </>
              }
            />
            <CodeStep
              codeSentAt={codeSentAt}
              isVerifying={isVerifying}
              isResending={isSending}
              submitLabel="Continue"
              failures={failures}
              onVerify={(code) => verify({ email, code })}
              onResend={() => sendCode({ email })}
              secondaryAction={
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline"
                  onClick={() => setEmail(null)}
                >
                  Use another email
                </button>
              }
              footnote="The email also has a reset link. Either one works."
            />
          </>
        ) : (
          <>
            <AuthHeading
              icon={icon}
              title="Forgot your password?"
              lead="Enter the email on your account and we'll send you a code to reset it."
            />
            <form className="grid gap-4" noValidate onSubmit={handleSubmit((values) => sendCode(values))}>
              <FormInput<EmailOnlyValues>
                control={control}
                errors={errors}
                name="email"
                type="email"
                label="Email"
                placeholder="you@company.com"
                icon={Mail}
                autoComplete="email"
              />
              <Button type="submit" isLoading={isSending} className="h-12 w-full rounded-xl text-[15px] font-semibold">
                Send reset code
              </Button>
              {!isAdmin && (
                <p className="text-muted-foreground text-center text-[13px]">
                  Signed up with Google? There&rsquo;s no password to reset, use{" "}
                  <Link href={signinHref} className="text-primary font-semibold hover:underline">
                    Continue with Google
                  </Link>{" "}
                  instead.
                </p>
              )}
            </form>
          </>
        )}
      </Swap>
    </AuthShell>
  );
};
