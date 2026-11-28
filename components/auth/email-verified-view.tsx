"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { getSessionType } from "@/lib/authService";
import { HOME_FOR_ROLE } from "@/lib/utils";
import { VerifiedArt } from "@/components/illustrations/auth-art";
import { AuthHeading, AuthShell } from "./auth-shell";

// The emailed link verifies without signing in, because it may be opened on a different device from the one that signed up.
export const EmailVerifiedView = function () {
  const hydrated = useHydrated();
  const isClient = useSearchParams().get("role") === "client";
  const signedIn = hydrated && !!getSessionType();
  const home = isClient ? HOME_FOR_ROLE.CLIENT : HOME_FOR_ROLE.CANDIDATE;

  return (
    <AuthShell art={isClient ? "signup-client" : "verify"}>
      <AuthHeading
        icon={<VerifiedArt className="mb-5" />}
        title="Email verified"
        lead={
          isClient
            ? "Your account is ready. Sign in to browse the pool and unlock the CVs you want."
            : "Your account is ready. Sign in to build your profile and upload your CV. It takes about 10 minutes."
        }
      />
      <Button asChild className="h-12 w-full rounded-xl text-[15px] font-semibold">
        <Link href={signedIn ? home : `/auth/signin?callbackUrl=${encodeURIComponent(home)}`}>
          {signedIn ? (isClient ? "Open your workspace" : "Build my profile") : "Sign in"} <ArrowRight />
        </Link>
      </Button>
    </AuthShell>
  );
};
