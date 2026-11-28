"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCandidateProfile } from "@/hooks/use-candidate-profile";
import { stepPath } from "@/lib/onboarding";

export default function OnboardingEntryPage() {
  const router = useRouter();
  const { data } = useCandidateProfile();

  useEffect(() => {
    if (!data) return;
    const { status, onboarding_step } = data.profile;
    if (status !== "UNSUBMITTED" && status !== "REJECTED") return router.replace("/candidate");
    router.replace(stepPath(onboarding_step));
  }, [data, router]);

  return (
    <div className="grid min-h-screen place-items-center">
      <Loader2 className="text-primary size-7 animate-spin" />
    </div>
  );
}
