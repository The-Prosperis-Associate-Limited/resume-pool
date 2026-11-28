import { useSearchParams } from "next/navigation";
import { setAuthCookies } from "@/lib/authService";
import { landingFor } from "@/lib/utils";
import { useAuthFlow } from "@/store/auth-flow";
import type { AuthSession } from "@/types/auth";

export const useStartSession = function () {
  const callbackUrl = useSearchParams().get("callbackUrl");

  return (session: AuthSession, remember?: boolean) => {
    setAuthCookies({ token: session.token, role: session.user.role }, remember);
    // Storage only: resetting live state would flash the previous step while the page unloads.
    useAuthFlow.persist.clearStorage();
    // A full navigation, so proxy.ts sees the new cookies on the very next request.
    window.location.href = landingFor(session.user.role, callbackUrl, session.user.needs_company_details);
  };
};
