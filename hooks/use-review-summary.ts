import { useGetData } from "@/hooks/use-get-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import type { ReviewSummary } from "@/types/admin";
import type { APIResponse } from "@/types/response";

export const useReviewSummary = function () {
  const { data } = useGetData<APIResponse<ReviewSummary>>({
    url: API_ENDPOINTS.admin.reviewSummary,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    silentErrors: true,
  });

  return data?.data;
};
