"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch, type Control, type FieldErrors, type UseFormSetError } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { Swap } from "@/components/motion/motion-primitives";
import { Notice } from "@/components/shared/notice";
import { Button } from "@/components/ui/button";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { errorCode, useHandleErrors } from "@/lib/handle-errors";
import {
  candidateSignupSchema,
  clientSignupSchema,
  type CandidateSignupValues,
  type ClientSignupValues,
} from "@/schemas/auth";
import { useAuthFlow } from "@/store/auth-flow";
import type { APIResponse } from "@/types/response";
import { AuthHeading, AuthShell } from "./auth-shell";
import { GoogleAuthButton, OrDivider } from "./google-auth-button";
import { PasswordMeter } from "./password-meter";
import { RolePicker, type SignupRole } from "./role-picker";

type SignupValues = CandidateSignupValues | ClientSignupValues;

const TermsLabel = () => (
  <>
    I agree to the{" "}
    <Link className="text-primary font-semibold hover:underline" href="/terms" target="_blank">
      Terms
    </Link>{" "}
    and{" "}
    <Link className="text-primary font-semibold hover:underline" href="/privacy" target="_blank">
      Privacy Policy
    </Link>
    .
  </>
);

const useSignup = function (setError: UseFormSetError<SignupValues>) {
  const router = useRouter();
  const startVerification = useAuthFlow((state) => state.startVerification);
  const handleErrors = useHandleErrors();

  return useSubmitData<SignupValues, APIResponse<{ email: string; role: SignupRole }>>({
    url: API_ENDPOINTS.auth.signup,
    skipAuth: true,
    skipRefetch: true,
    onSuccessMessage: "Account created. Check your email for the code.",
    onSuccess: ({ data }) => {
      startVerification(data.email, data.role);
      router.push("/auth/verify-email");
    },
    onError: (error) => {
      if (errorCode(error) === "EMAIL_TAKEN") {
        setError("email", { message: "An account already uses this email. Sign in instead." });
        return;
      }
      handleErrors(error);
    },
  });
};

interface FieldsProps<T extends SignupValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

const CandidateFields = function ({ control, errors }: FieldsProps<CandidateSignupValues>) {
  return (
    <>
      <div className="grid gap-3 min-[420px]:grid-cols-2">
        <FormInput<CandidateSignupValues>
          control={control}
          errors={errors}
          name="first_name"
          label="First name"
          autoComplete="given-name"
        />
        <FormInput<CandidateSignupValues>
          control={control}
          errors={errors}
          name="last_name"
          label="Last name"
          autoComplete="family-name"
        />
      </div>
      <FormInput<CandidateSignupValues>
        control={control}
        errors={errors}
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        autoComplete="email"
      />
    </>
  );
};

const ClientFields = function ({ control, errors }: FieldsProps<ClientSignupValues>) {
  return (
    <>
      <FormInput<ClientSignupValues>
        control={control}
        errors={errors}
        name="company_name"
        label="Company name"
        placeholder="Kestrel Logistics Ltd"
        icon={Building2}
        autoComplete="organization"
      />
      <div className="grid gap-3 min-[420px]:grid-cols-2">
        <FormInput<ClientSignupValues>
          control={control}
          errors={errors}
          name="contact_name"
          label="Your name"
          placeholder="Tolu Bamidele"
          autoComplete="name"
        />
        <FormInput<ClientSignupValues>
          control={control}
          errors={errors}
          name="phone_no"
          type="tel"
          label="Phone"
          placeholder="+234 803 000 0000"
          autoComplete="tel"
        />
      </div>
      <FormInput<ClientSignupValues>
        control={control}
        errors={errors}
        name="email"
        type="email"
        label="Work email"
        placeholder="tolu@kestrel.ng"
        autoComplete="email"
        hint="Use your company address. We use it to confirm you're a real employer."
      />
    </>
  );
};

const RoleForm = function ({ role }: { role: SignupRole }) {
  const isCandidate = role === "CANDIDATE";

  const form = useForm<SignupValues>({
    resolver: zodResolver(isCandidate ? candidateSignupSchema : clientSignupSchema),
    defaultValues: isCandidate
      ? { role: "CANDIDATE", first_name: "", last_name: "", email: "", password: "", accepted_terms: false }
      : {
          role: "CLIENT",
          company_name: "",
          contact_name: "",
          phone_no: "",
          email: "",
          password: "",
          accepted_terms: false,
        },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const password = useWatch({ control, name: "password" });
  const { mutate: signup, isPending } = useSignup(setError);

  return (
    <form onSubmit={handleSubmit((values) => signup(values))} className="grid gap-4" noValidate>
      <GoogleAuthButton state={isCandidate ? "candidate" : "client"} label="Sign up with Google" />
      <OrDivider />

      {isCandidate ? (
        <CandidateFields
          control={control as Control<CandidateSignupValues>}
          errors={errors as FieldErrors<CandidateSignupValues>}
        />
      ) : (
        <ClientFields
          control={control as Control<ClientSignupValues>}
          errors={errors as FieldErrors<ClientSignupValues>}
        />
      )}

      <FormInput<SignupValues>
        control={control}
        errors={errors}
        name="password"
        type="password"
        label="Password"
        autoComplete="new-password"
        hint={<PasswordMeter password={password ?? ""} />}
      />
      <FormInput<SignupValues>
        control={control}
        errors={errors}
        name="accepted_terms"
        type="checkbox"
        label={<TermsLabel />}
      />

      <Button type="submit" isLoading={isPending} className="h-12 w-full rounded-xl text-[15px] font-semibold">
        Create account <ArrowRight />
      </Button>
    </form>
  );
};

export const SignupForm = function () {
  const params = useSearchParams();
  const [role, setRole] = useState<SignupRole>(params.get("role") === "client" ? "CLIENT" : "CANDIDATE");
  const noAccount = params.get("error") === "no_account";

  return (
    <AuthShell
      art={role === "CANDIDATE" ? "signup-candidate" : "signup-client"}
      topRight={
        <span className="text-muted-foreground hidden text-sm sm:inline">
          Have an account?{" "}
          <Link className="text-primary font-semibold hover:underline" href="/auth/signin">
            Sign in
          </Link>
        </span>
      }
    >
      <AuthHeading
        title="Create your account"
        lead="Pick how you'll use Resume Pool. You can't switch later, so choose the one that fits."
      />

      <div className="grid gap-4">
        {noAccount && (
          <Notice tone="warning">
            No Resume Pool account uses that Google address yet. Pick how you&rsquo;ll use Resume Pool, then sign up
            with Google.
          </Notice>
        )}
        <RolePicker value={role} onChange={setRole} />
        <Swap swapKey={role}>
          <RoleForm role={role} />
        </Swap>
        <p className="text-muted-foreground text-center text-sm sm:hidden">
          Have an account?{" "}
          <Link className="text-primary font-semibold" href="/auth/signin">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};
