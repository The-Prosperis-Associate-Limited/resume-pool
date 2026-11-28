"use client";

import { Button } from "@/components/ui/button";
import { API_ENDPOINTS, type GoogleState } from "@/lib/endpoints";
import { googleAuthUrl } from "@/lib/utils";

interface Props {
  state: GoogleState;
  label: string;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-4.5">
    <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4" />
    <path
      d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"
      fill="#34A853"
    />
    <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z" fill="#FBBC05" />
    <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z" fill="#EA4335" />
  </svg>
);

// A full navigation, not a fetch: the Google consent screen has to own the window.
export const GoogleAuthButton = function ({ state, label }: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 w-full gap-2.5 rounded-xl text-[15px] font-semibold shadow-xs"
      onClick={() => {
        window.location.href = googleAuthUrl(API_ENDPOINTS.auth.google(state));
      }}
    >
      <GoogleIcon />
      {label}
    </Button>
  );
};

export const OrDivider = function ({ label = "or" }: { label?: string }) {
  return (
    <div className="text-faint before:bg-border after:bg-border flex items-center gap-3 text-xs font-semibold tracking-wider uppercase before:h-px before:flex-1 after:h-px after:flex-1">
      {label}
    </div>
  );
};
