import { useRouter } from "next/navigation";
import { useSubmitData } from "@/hooks/use-submit-data";
import { REVIEW_PATH } from "@/lib/onboarding";
import type { CandidateProfileResponse } from "@/types/candidate";
import type { APIResponse } from "@/types/response";

// Reads ?from=review off window - useSearchParams would force a Suspense boundary into every step page at prerender.
export const useSaveOnboardingStep = function <TData>({
  url,
  next,
  onSuccessMessage = "Saved",
}: {
  url: string;
  next: string;
  onSuccessMessage?: string;
}) {
  const router = useRouter();

  const { mutate, isPending } = useSubmitData<TData, APIResponse<CandidateProfileResponse>>({
    url,
    method: "put",
    onSuccessMessage,
    onSuccess: () => {
      const fromReview = new URLSearchParams(window.location.search).get("from") === "review";
      router.push(fromReview ? REVIEW_PATH : next);
    },
  });

  return { save: mutate, isPending };
};
