import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import api, { type CustomAxiosRequestConfig } from "@/lib/api";
import { useHandleErrors } from "@/lib/handle-errors";
import { showToast } from "@/lib/show-toast";
import { queryClient } from "@/lib/utils";

interface UseSubmitDataOptions<TData, TResponse> {
  url: string | ((data: TData) => string);
  getBody?: (data: TData) => unknown;
  method?: "post" | "put" | "patch" | "delete";
  onSuccessMessage?: string;
  onLoadingMessage?: string;
  onError?: (error: AxiosError<{ message?: string }>) => void;
  onSuccess?: (data: TResponse) => void;
  redirectTo?: string;
  skipAuth?: boolean;
  silent?: boolean;
  skipRefetch?: boolean;
}

export function useSubmitData<TData = unknown, TResponse = unknown>(options: UseSubmitDataOptions<TData, TResponse>) {
  const {
    url,
    getBody,
    method = "post",
    onSuccessMessage = "Operation successful",
    onLoadingMessage,
    onError,
    onSuccess,
    redirectTo,
    skipAuth,
    silent,
    skipRefetch,
  } = options;

  const router = useRouter();
  const handleErrors = useHandleErrors();

  return useMutation<TResponse, AxiosError<{ message?: string }>, TData>({
    mutationFn: async (data: TData) => {
      if (onLoadingMessage && !silent) showToast("loading", onLoadingMessage);

      const resolvedUrl = typeof url === "function" ? url(data) : url;
      if (!resolvedUrl.trim()) throw new Error("This action isn't wired up to an endpoint yet");

      const config: Partial<CustomAxiosRequestConfig> = {};
      if (skipAuth) config.skipAuth = true;

      const response = await api[method]<TResponse>(resolvedUrl, getBody ? getBody(data) : data, config);
      return response.data;
    },

    onSuccess: (data) => {
      if (!silent) showToast("success", onSuccessMessage);

      // A write can change data under any key (an approval empties a queue on another route): on-screen queries refetch now, the rest on their next mount.
      if (!skipRefetch) queryClient.invalidateQueries();

      onSuccess?.(data);
      if (redirectTo) router.push(redirectTo);
    },

    onError: (error) => {
      if (onError) onError(error);
      else if (!silent) handleErrors(error);
    },
  });
}
