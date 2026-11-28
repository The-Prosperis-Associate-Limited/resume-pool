import type { AxiosError } from "axios";
import type { APIErrorBody } from "@/types/response";
import { showToast } from "./show-toast";

export const errorCode = (error: unknown) => (error as AxiosError<APIErrorBody>)?.response?.data?.code;

export const errorMessage = (error: AxiosError<APIErrorBody> | Error) => {
  const data = "response" in error ? error.response?.data : undefined;

  if (data?.errors?.length) return data.errors.map((e) => e.message).join("\n");
  if (data?.message) return data.message;
  if ("response" in error && !error.response)
    return "We couldn't reach Resume Pool. Check your connection and try again.";
  if (error.message) return error.message;
  return "An unexpected error occurred. Please try again later.";
};

export function useHandleErrors() {
  return function (error: AxiosError<APIErrorBody> | Error) {
    showToast("error", errorMessage(error));
  };
}
