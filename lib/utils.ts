import { QueryClient } from "@tanstack/react-query";

export { cn } from "cn";

export const queryClient = new QueryClient();

export const formatMoney = (minor: number, currency = "NGN", locale = "en-NG") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(minor / 100);
