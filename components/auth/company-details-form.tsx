"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useSignOut } from "@/hooks/use-sign-out";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { HOME_FOR_ROLE } from "@/lib/utils";
import { companyDetailsSchema, type CompanyDetailsValues } from "@/schemas/auth";
import { CompanyArt } from "@/components/illustrations/auth-art";
import { AuthHeading, AuthShell } from "./auth-shell";

export const CompanyDetailsForm = function () {
  const { user } = useSession();
  const { signOut, isSigningOut } = useSignOut();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyDetailsValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: { company_name: "", contact_name: "", phone_no: "" },
  });

  useEffect(() => {
    if (!user) return;
    if (!user.needs_company_details) return window.location.replace(HOME_FOR_ROLE.CLIENT);
    reset({
      company_name: "",
      contact_name: [user.first_name, user.last_name].filter(Boolean).join(" "),
      phone_no: user.phone_no ?? "",
    });
  }, [user, reset]);

  const { mutate, isPending } = useSubmitData<CompanyDetailsValues>({
    url: API_ENDPOINTS.client.companyDetails,
    method: "put",
    skipRefetch: true,
    onSuccessMessage: "Company details saved",
    onSuccess: () => window.location.replace(HOME_FOR_ROLE.CLIENT),
  });

  return (
    <AuthShell
      art="company"
      topRight={
        <Button variant="ghost" size="sm" className="rounded-lg" onClick={signOut} isLoading={isSigningOut}>
          Sign out
        </Button>
      }
    >
      <AuthHeading
        icon={<CompanyArt className="mb-5" />}
        title="Tell us about your company"
        lead={
          user ? (
            <>
              Signed in as <b className="text-foreground break-all">{user.email}</b>. Add your company to start
              browsing.
            </>
          ) : (
            "Add your company to start browsing."
          )
        }
      />
      <form className="grid gap-4" noValidate onSubmit={handleSubmit((values) => mutate(values))}>
        <FormInput<CompanyDetailsValues>
          control={control}
          errors={errors}
          name="company_name"
          label="Company name"
          placeholder="Kestrel Logistics Ltd"
          icon={Building2}
          autoComplete="organization"
        />
        <div className="grid gap-3 min-[420px]:grid-cols-2">
          <FormInput<CompanyDetailsValues>
            control={control}
            errors={errors}
            name="contact_name"
            label="Your name"
            autoComplete="name"
          />
          <FormInput<CompanyDetailsValues>
            control={control}
            errors={errors}
            name="phone_no"
            type="tel"
            label="Phone"
            placeholder="+234 803 000 0000"
            autoComplete="tel"
          />
        </div>
        <Button type="submit" isLoading={isPending} className="h-12 w-full rounded-xl text-[15px] font-semibold">
          Continue to the pool
        </Button>
      </form>
    </AuthShell>
  );
};
