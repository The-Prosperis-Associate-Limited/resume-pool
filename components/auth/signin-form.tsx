"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { Notice } from "@/components/shared/notice";
import { Button } from "@/components/ui/button";
import { useGetData } from "@/hooks/use-get-data";
import { useStartSession } from "@/hooks/use-start-session";
import { useSubmitData } from "@/hooks/use-submit-data";
import { authRedirectError } from "@/lib/auth-messages";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { errorCode, useHandleErrors } from "@/lib/handle-errors";
import { signinSchema, type SigninValues } from "@/schemas/auth";
import { useAuthFlow } from "@/store/auth-flow";
import type { AuthSession } from "@/types/auth";
import type { APIResponse } from "@/types/response";
import { AuthHeading, AuthShell } from "./auth-shell";
import { GoogleAuthButton, OrDivider } from "./google-auth-button";

interface Props {
  surface: "main" | "admin";
}

const GoogleReturn = function ({ token }: { token: string }) {
  const startSession = useStartSession();
  const started = useRef(false);
  const { data, error } = useGetData<APIResponse<AuthSession>>({
    url: API_ENDPOINTS.auth.validateGoogleSession(token),
    skipAuth: true,
    retry: false,
  });

  useEffect(() => {
    if (!data?.data || started.current) return;
    started.current = true;
    startSession(data.data);
  }, [data, startSession]);

  return (
    <div className="grid place-items-center gap-3 py-16 text-center">
      {error ? (
        <>
          <p className="font-semibold">That Google sign-in link has expired.</p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/auth/signin">Try again</Link>
          </Button>
        </>
      ) : (
        <>
          <Loader2 className="text-primary size-6 animate-spin" />
          <p className="text-muted-foreground text-sm">Signing you in with Google…</p>
        </>
      )}
    </div>
  );
};

export const SigninForm = function ({ surface }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const googleToken = params.get("token");
  const redirectError = authRedirectError(params.get("error"));
  const expired = params.get("reason") === "expired";
  const isAdmin = surface === "admin";

  const startSession = useStartSession();
  const startVerification = useAuthFlow((state) => state.startVerification);
  const handleErrors = useHandleErrors();
  const [locked, setLocked] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const { mutate: signin, isPending } = useSubmitData<Omit<SigninValues, "remember">, APIResponse<AuthSession>>({
    url: API_ENDPOINTS.auth.signin,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "You're signed in",
    onSuccess: (response) => startSession(response.data, getValues("remember")),
    onError: (error) => {
      const code = errorCode(error);

      if (code === "EMAIL_NOT_VERIFIED") {
        startVerification(getValues("email"));
        router.push("/auth/verify-email");
        return;
      }

      setLocked(code === "ACCOUNT_LOCKED");
      handleErrors(error);
    },
  });

  return (
    <AuthShell
      art={isAdmin ? "admin" : "signin"}
      logoHref={isAdmin ? "/admin/auth/signin" : "/"}
      topRight={
        !isAdmin && (
          <span className="text-muted-foreground hidden text-sm sm:inline">
            New here?{" "}
            <Link className="text-primary font-semibold hover:underline" href="/auth/signup">
              Create an account
            </Link>
          </span>
        )
      }
    >
      {googleToken ? (
        <GoogleReturn token={googleToken} />
      ) : (
        <>
          <AuthHeading
            title={isAdmin ? "Admin sign in" : "Welcome back"}
            lead={
              isAdmin
                ? "Prosperis staff only. Admin accounts are created for you."
                : "Sign in to manage your profile or pick up where your search left off."
            }
          />

          <div className="grid gap-4">
            {expired && (
              <Notice tone="warning">Your session expired. Sign in again to carry on where you left off.</Notice>
            )}
            {redirectError && <Notice tone="danger">{redirectError}</Notice>}
            <Notice tone="danger" show={locked}>
              This account is locked after too many attempts.{" "}
              <Link href="/auth/forgot-password" className="font-semibold underline">
                Reset your password
              </Link>{" "}
              to unlock it.
            </Notice>

            {!isAdmin && (
              <>
                <GoogleAuthButton state="signin" label="Continue with Google" />
                <OrDivider label="or with email" />
              </>
            )}

            <form
              onSubmit={handleSubmit(({ email, password }) => signin({ email, password }))}
              className="grid gap-4"
              noValidate
            >
              <FormInput<SigninValues>
                control={control}
                errors={errors}
                name="email"
                type="email"
                label="Email"
                placeholder="you@company.com"
                icon={Mail}
                autoComplete="email"
              />
              <FormInput<SigninValues>
                control={control}
                errors={errors}
                name="password"
                type="password"
                label="Password"
                icon={LockKeyhole}
                autoComplete="current-password"
                labelAction={
                  <Link
                    className="text-primary text-[13px] font-semibold hover:underline"
                    href={isAdmin ? "/auth/forgot-password?surface=admin" : "/auth/forgot-password"}
                  >
                    Forgot password?
                  </Link>
                }
              />
              <FormInput<SigninValues>
                control={control}
                errors={errors}
                name="remember"
                type="checkbox"
                label="Keep me signed in on this device"
              />
              <Button type="submit" isLoading={isPending} className="h-12 w-full rounded-xl text-[15px] font-semibold">
                Sign in
              </Button>
              {!isAdmin && (
                <p className="text-muted-foreground text-center text-[13px]">
                  Signing in as an employer? Same form, we&rsquo;ll take you to your workspace.
                </p>
              )}
              {!isAdmin && (
                <p className="text-muted-foreground text-center text-sm sm:hidden">
                  New here?{" "}
                  <Link className="text-primary font-semibold" href="/auth/signup">
                    Create an account
                  </Link>
                </p>
              )}
            </form>
          </div>
        </>
      )}
    </AuthShell>
  );
};
