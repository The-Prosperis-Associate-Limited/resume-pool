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

  candidate: {
    profile: "/candidate/onboarding/profile",
    options: "/candidate/onboarding/options",
    personal: "/candidate/onboarding/personal",
    headline: "/candidate/onboarding/headline",
    experience: "/candidate/onboarding/experience",
    education: "/candidate/onboarding/education",
    skills: "/candidate/onboarding/skills",
    preferences: "/candidate/onboarding/preferences",
    privacy: "/candidate/onboarding/privacy",
    photo: "/candidate/onboarding/photo",
    cv: "/candidate/onboarding/cv",
    buildCv: "/candidate/onboarding/cv/build",
    submit: "/candidate/onboarding/submit",
  },

  admin: {
    reviews: "/admin/reviews",
    reviewSummary: "/admin/reviews/summary",
    review: (profileId: string) => `/admin/reviews/${profileId}`,
    reviewCv: (profileId: string) => `/admin/reviews/${profileId}/cv`,
    reviewCvHtml: (profileId: string) => `/admin/reviews/${profileId}/cv/html`,
  },
} as const;
