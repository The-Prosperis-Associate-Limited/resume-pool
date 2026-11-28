import { useHydrated } from "@/hooks/use-hydrated";
import { getSessionType } from "@/lib/authService";

// Public pages read the role from the session cookie, so an anonymous visitor never makes an authenticated call.
export const useViewerRole = function () {
  const hydrated = useHydrated();
  return hydrated ? (getSessionType() ?? null) : undefined;
};
