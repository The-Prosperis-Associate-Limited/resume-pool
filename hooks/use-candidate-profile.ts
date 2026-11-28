import { useGetData } from "@/hooks/use-get-data";
import { useHydrated } from "@/hooks/use-hydrated";
import { API_ENDPOINTS } from "@/lib/endpoints";
import type { CandidateProfileResponse, OnboardingOptions } from "@/types/candidate";
import type { APIResponse } from "@/types/response";

export const useCandidateProfile = function () {
  const hydrated = useHydrated();
  const { data, isFetching, refetch } = useGetData<APIResponse<CandidateProfileResponse>>({
    url: API_ENDPOINTS.candidate.profile,
  });

  return { data: hydrated ? data?.data : undefined, isFetching, refetch };
};

export const useOnboardingOptions = function () {
  const { data } = useGetData<APIResponse<OnboardingOptions>>({
    url: API_ENDPOINTS.candidate.options,
    staleTime: 60 * 60 * 1000,
  });

  return data?.data;
};
