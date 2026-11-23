import type { AxiosError } from "axios";
import { showToast } from "./show-toast";

type ApiError = {
  message?: string;
  errors?: { field: string; message: string }[];
};

export function useHandleErrors() {
  return function (error: AxiosError<ApiError> | Error) {
    let errorMessage = "An unexpected error occurred. Please try again later.";
    const data = "response" in error ? error.response?.data : undefined;

    if (data?.errors?.length) {
      errorMessage = data.errors.map((e) => `${e.field}: ${e.message}`).join("\n");
    } else if (data?.message) {
      errorMessage = data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showToast("error", errorMessage);
  };
}
