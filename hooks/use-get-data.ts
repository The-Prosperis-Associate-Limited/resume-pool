import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import api, { type CustomAxiosRequestConfig } from "@/lib/api";
import { useHandleErrors } from "@/lib/handle-errors";

interface Props {
  url: string;
  skipAuth?: boolean;
  shouldFetch?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnMount?: boolean | "always";
  refetchInterval?: number;
  silentErrors?: boolean;
  retry?: boolean | number;
}

interface UseGetDataResult<T> {
  isFetching: boolean;
  data: T | undefined;
  refetch: () => void;
  error: Error | null;
}

export const useGetData = <T>({
  url,
  skipAuth = false,
  shouldFetch = true,
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000,
  refetchOnMount = true,
  refetchInterval,
  silentErrors = false,
  retry,
}: Props): UseGetDataResult<T> => {
  const handleErrors = useHandleErrors();
  const hydrated = useHydrated();

  const queryFn = useCallback(async () => {
    try {
      const response = await api.get(url, { skipAuth } as CustomAxiosRequestConfig);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) throw new Error(error.response?.data?.message || "An error occurred");
      throw new Error((error as Error).message || "An unexpected error occurred");
    }
  }, [url, skipAuth]);

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: [url],
    queryFn,
    staleTime,
    gcTime,
    refetchOnMount,
    refetchOnWindowFocus: true,
    refetchInterval,
    enabled: shouldFetch,
    ...(retry !== undefined && { retry }),
  });

  useEffect(() => {
    if (error && !silentErrors) handleErrors(error);
  }, [error, handleErrors, silentErrors]);

  // A late-hydrating Suspense boundary must render what the server did, even if the cache filled meanwhile.
  return { isFetching, data: hydrated ? data : undefined, refetch, error };
};
