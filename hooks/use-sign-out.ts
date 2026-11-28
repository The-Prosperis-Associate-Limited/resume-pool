import { clearAuthCookies, getSessionType } from "@/lib/authService";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { useSubmitData } from "./use-submit-data";

const signinPath = () => (getSessionType() === "ADMIN" ? "/admin/auth/signin" : "/auth/signin");

const finish = () => {
  const signin = signinPath();
  clearAuthCookies();
  // No queryClient.clear(): it refetches mounted queries without a token, and their 401 would race this redirect.
  window.location.href = signin;
};

export const useSignOut = function () {
  // Tokens are stateless, so a failed call changes nothing: the cookies go either way.
  const { mutate, isPending } = useSubmitData<void>({
    url: API_ENDPOINTS.auth.logout,
    getBody: () => ({}),
    skipRefetch: true,
    onSuccessMessage: "You're signed out",
    onSuccess: finish,
    onError: finish,
  });

  return { signOut: () => mutate(), isSigningOut: isPending };
};
