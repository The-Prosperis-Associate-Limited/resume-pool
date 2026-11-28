import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { useSubmitData } from "@/hooks/use-submit-data";
import { errorMessage } from "@/lib/handle-errors";
import { REVIEW_PATH } from "@/lib/onboarding";
import { showToast } from "@/lib/show-toast";
import type { CandidateProfileResponse } from "@/types/candidate";
import type { APIErrorBody, APIResponse } from "@/types/response";

// Reads ?from= off window - useSearchParams would force a Suspense boundary into every step page at prerender.
export const returnPath = (next: string) => {
  const from = new URLSearchParams(window.location.search).get("from");
  if (from === "review") return REVIEW_PATH;
  if (from === "profile") return "/candidate";
  return next;
};

// "skills.3" points at one chip; the chips field shows its error under "skills".
const formField = (field: string) => field.replace(/\.\d+$/, "");

export const useSaveOnboardingStep = function <TData, TValues extends FieldValues = FieldValues>({
  url,
  next,
  onSuccessMessage = "Saved",
  setError,
}: {
  url: string;
  next: string;
  onSuccessMessage?: string;
  setError?: UseFormSetError<TValues>;
}) {
  const router = useRouter();

  const { mutate, isPending } = useSubmitData<TData, APIResponse<CandidateProfileResponse>>({
    url,
    method: "put",
    onSuccessMessage,
    onSuccess: () => router.push(returnPath(next)),
    onError: (error: AxiosError<APIErrorBody>) => {
      const problems = error.response?.data?.errors;
      if (setError && problems?.length) {
        for (const problem of problems)
          setError(
            formField(problem.field) as Path<TValues>,
            { type: "server", message: problem.message },
            { shouldFocus: true },
          );
        showToast("error", error.response?.data?.message ?? "Fix the highlighted fields");
        return;
      }
      showToast("error", errorMessage(error));
    },
  });

  return { save: mutate, isPending };
};
