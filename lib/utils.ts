import { QueryClient } from "@tanstack/react-query";
import type { UserRole } from "@/types/auth";

export { cn } from "cn";

export const queryClient = new QueryClient();

export const formatMoney = (minor: number, currency = "NGN", locale = "en-NG") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(minor / 100);

export const ENV = {
  get API_URL() {
    return process.env.NEXT_PUBLIC_API_URL ?? "";
  },
} as const;

export const HOME_FOR_ROLE: Record<UserRole, string> = {
  CANDIDATE: "/candidate",
  CLIENT: "/dashboard",
  ADMIN: "/admin",
};

const OTHER_SURFACES = ["/candidate", "/admin", "/auth"];

// Only relative in-app paths, so a crafted callbackUrl cannot send a fresh session off-site.
export const isSafeCallback = (url: string | null): url is string =>
  !!url && url.startsWith("/") && !url.startsWith("//");

const belongsTo = (role: UserRole, path: string) => {
  if (role === "CANDIDATE") return path.startsWith("/candidate");
  if (role === "ADMIN") return path.startsWith("/admin") && !path.startsWith("/admin/auth");
  return !OTHER_SURFACES.some((prefix) => path.startsWith(prefix));
};

export const landingFor = (role: UserRole, callbackUrl: string | null, needsCompanyDetails = false) => {
  if (role === "CLIENT" && needsCompanyDetails) return "/company-details";
  if (isSafeCallback(callbackUrl) && belongsTo(role, callbackUrl)) return callbackUrl;
  return HOME_FOR_ROLE[role];
};

export const googleAuthUrl = (path: string) => `${ENV.API_URL}${path}`;
