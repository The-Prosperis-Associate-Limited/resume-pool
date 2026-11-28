import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { clearAuthCookies, getAccessToken, getRefreshToken, getSessionType, setAccessCookie } from "./authService";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

interface RefreshResponse {
  message: string;
  token: { accessToken: string };
}

const REFRESH_PATH = "/auth/token";

// Auth calls answer 401 for a wrong password or a used link, which is not an expired session.
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/create-user",
  "/auth/google",
  "/auth/token",
  "/auth/reset-password",
  "/auth/verify",
];

// Read before clearAuthCookies wipes session_type.
const signinFor = () => (getSessionType() === "ADMIN" ? "/admin/auth/signin" : "/auth/signin");

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 120_000,
});

let refreshing: Promise<string> | null = null;

const refreshAccessToken = () => {
  // One refresh in flight; every 401 that arrives meanwhile waits on the same promise.
  refreshing ??= (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const { data } = await api.post<RefreshResponse>(REFRESH_PATH, { refreshToken }, {
      skipAuth: true,
    } as CustomAxiosRequestConfig);
    setAccessCookie(data.token.accessToken);
    return data.token.accessToken;
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
};

const endSession = () => {
  // Nothing to end once the cookies are gone: a deliberate sign-out is already navigating away.
  if (!getSessionType() && !getRefreshToken()) return;
  const signin = signinFor();
  clearAuthCookies();

  if (typeof window === "undefined" || window.location.pathname.includes("/auth")) return;

  const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- a full load drops every cached query from the dead session
  window.location.assign(`${signin}?callbackUrl=${callbackUrl}&reason=expired`);
};

api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (config.skipAuth) return config;

    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as CustomAxiosRequestConfig | undefined;

    if (!original || original.skipAuth || NO_REFRESH_PATHS.some((path) => original.url?.includes(path)))
      return Promise.reject(error);
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    original._retry = true;

    try {
      const token = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      endSession();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
