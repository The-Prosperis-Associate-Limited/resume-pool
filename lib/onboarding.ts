import type { Availability, JobType, LanguageLevel, OnboardingStep, WorkMode } from "@/types/candidate";

export const ONBOARDING_STEPS: { step: Exclude<OnboardingStep, "REVIEW">; path: string; label: string }[] = [
  { step: "PERSONAL", path: "/candidate/onboarding/personal", label: "Personal details" },
  { step: "HEADLINE", path: "/candidate/onboarding/headline", label: "Headline & target roles" },
  { step: "EXPERIENCE", path: "/candidate/onboarding/experience", label: "Work experience" },
  { step: "EDUCATION", path: "/candidate/onboarding/education", label: "Education & certifications" },
  { step: "SKILLS", path: "/candidate/onboarding/skills", label: "Skills & languages" },
  { step: "PREFERENCES", path: "/candidate/onboarding/preferences", label: "Preferences" },
  { step: "CV", path: "/candidate/onboarding/cv", label: "Your CV" },
  { step: "PRIVACY", path: "/candidate/onboarding/privacy", label: "Privacy & consent" },
];

export const REVIEW_PATH = "/candidate/onboarding/review";

export const stepPath = (step: OnboardingStep) =>
  step === "REVIEW"
    ? REVIEW_PATH
    : (ONBOARDING_STEPS.find((entry) => entry.step === step)?.path ?? ONBOARDING_STEPS[0].path);

export const nextPath = (step: OnboardingStep) => {
  const index = ONBOARDING_STEPS.findIndex((entry) => entry.step === step);
  return ONBOARDING_STEPS[index + 1]?.path ?? REVIEW_PATH;
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = { ONSITE: "On-site", HYBRID: "Hybrid", REMOTE: "Remote" };

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  IMMEDIATELY: "Immediately",
  TWO_WEEKS: "In 2 weeks",
  ONE_MONTH: "In 1 month",
  TWO_MONTHS: "In 2 months",
  THREE_MONTHS: "In 3 months or more",
};

export const LANGUAGE_LEVEL_LABELS: Record<LanguageLevel, string> = {
  BASIC: "Basic",
  CONVERSATIONAL: "Conversational",
  FLUENT: "Fluent",
  NATIVE: "Native",
};

export const formatNaira = (amount: number) =>
  `₦${amount >= 1_000_000 ? `${+(amount / 1_000_000).toFixed(1)}m` : `${Math.round(amount / 1000)}k`}`;

export const formatYears = (months: number) => {
  if (months < 12) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"}`;
};

export const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// PLACEHOLDER until the client confirms the review turnaround (server CLAUDE.md, "Still to ask the client").
export const REVIEW_TURNAROUND = "within 2 working days";
