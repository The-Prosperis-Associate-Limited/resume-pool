import { useGetData } from "@/hooks/use-get-data";
import { useHydrated } from "@/hooks/use-hydrated";
import { API_ENDPOINTS } from "@/lib/endpoints";
import type { SessionUser } from "@/types/auth";
import type { APIResponse } from "@/types/response";

export const useSession = function () {
  const hydrated = useHydrated();
  const { data, isFetching, error } = useGetData<APIResponse<SessionUser>>({
    url: API_ENDPOINTS.auth.getProfile,
    silentErrors: true,
  });

  // The query cache can already hold the user on the first client render, which the server rendered without.
  return { user: hydrated ? data?.data : undefined, isFetching, error };
};
