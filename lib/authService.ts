import Cookies from "js-cookie";
import type { AuthSession, UserRole } from "@/types/auth";
import { SESSION_COOKIES } from "./session-cookies";

export const isProd = process.env.NODE_ENV === "production";

export { SESSION_COOKIES };

export const ACCESS_TOKEN_TTL_MS = 30 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const REMEMBER_KEY = "rp_remember";

export const cookieOpts = (expires?: Date) => ({
  secure: isProd,
  sameSite: "lax" as const,
  ...(expires && { expires }),
});

const remembered = () => {
  try {
    return localStorage.getItem(REMEMBER_KEY) !== "0";
  } catch {
    return true;
  }
};

// "Keep me signed in" off makes the refresh and type cookies last for the browser session only.
export const setAuthCookies = (session: Pick<AuthSession, "token"> & { role: UserRole }, remember = remembered()) => {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  } catch {}

  const longLived = remember ? new Date(Date.now() + REFRESH_TOKEN_TTL_MS) : undefined;

  Cookies.set(
    SESSION_COOKIES.access,
    session.token.accessToken,
    cookieOpts(new Date(Date.now() + ACCESS_TOKEN_TTL_MS)),
  );
  Cookies.set(SESSION_COOKIES.refresh, session.token.refreshToken, cookieOpts(longLived));
  Cookies.set(SESSION_COOKIES.type, session.role, cookieOpts(longLived));
};

export const setAccessCookie = (accessToken: string) => {
  Cookies.set(SESSION_COOKIES.access, accessToken, cookieOpts(new Date(Date.now() + ACCESS_TOKEN_TTL_MS)));
};

export const getSessionType = () => Cookies.get(SESSION_COOKIES.type) as UserRole | undefined;

export const getRefreshToken = () => Cookies.get(SESSION_COOKIES.refresh);

export const getAccessToken = () => Cookies.get(SESSION_COOKIES.access);

export const clearAuthCookies = () => {
  Cookies.remove(SESSION_COOKIES.access);
  Cookies.remove(SESSION_COOKIES.refresh);
  Cookies.remove(SESSION_COOKIES.type);
};
