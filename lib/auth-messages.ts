// The `?error=` codes the server's Google callback and email link redirect with, in words a person can act on.
export const AUTH_REDIRECT_ERRORS: Record<string, string> = {
  google_failed: "Google sign-in didn't complete. Please try again.",
  google_unavailable: "Google sign-in isn't available right now. Use your email and password instead.",
  google_no_email: "Google didn't share an email address with us, so we couldn't sign you in.",
  google_email_unverified: "Your Google email address isn't verified yet. Verify it with Google, then try again.",
  google_mismatch: "This email is linked to a different Google account. Sign in with that one, or use your password.",
  disposable_email: "Temporary or disposable email addresses aren't accepted.",
  account_inactive: "This account isn't active. Please contact support.",
  invalid_link:
    "That verification link is no longer valid. Enter the code from your latest email, or request a new one.",
};

export const authRedirectError = (code: string | null) =>
  code ? (AUTH_REDIRECT_ERRORS[code] ?? AUTH_REDIRECT_ERRORS.google_failed) : null;
