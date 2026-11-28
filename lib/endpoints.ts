export type GoogleState = "candidate" | "client" | "signin";

export const API_ENDPOINTS = {
  health: "/",

  auth: {
    signup: "/auth/create-user",
    changeSignupEmail: "/auth/change-signup-email",
    signin: "/auth/login",
    refresh: "/auth/token",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    getProfile: "/auth/get-profile",
    sendEmailOtp: "/auth/send-email-otp",
    verifyEmailOtp: "/auth/verify-email-otp",
    sendPasswordResetOtp: "/auth/send-password-reset-otp",
    verifyPasswordResetOtp: "/auth/verify-password-reset-otp",
    resetPassword: "/auth/reset-password",
    updatePassword: "/auth/update-password",
    google: (state: GoogleState) => `/auth/google/${state}`,
    validateGoogleSession: (token: string) => `/auth/google/callback/validate-session/${encodeURIComponent(token)}`,
  },

  client: {
    companyDetails: "/client/account/company",
  },
} as const;
