import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 120_000,
});

api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (config.skipAuth) return config;

    const token = Cookies.get("session_id");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// TODO(phase 1): port the single in-flight token refresh, queued retries and per-surface signin redirect from haya-drivers lib/api.ts.

export default api;
