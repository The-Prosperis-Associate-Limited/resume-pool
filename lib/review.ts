import type { ChecklistKey } from "@/types/admin";
import type { OnboardingStep, ReviewKind } from "@/types/candidate";

export const REVIEW_KIND_LABELS: Record<ReviewKind, string> = {
  NEW: "New",
  RESUBMISSION: "Resubmission",
  CV_CHANGED: "CV changed",
  DETAILS_CHANGED: "Details changed",
};

export const CHECKLIST_STEP: Record<ChecklistKey, Exclude<OnboardingStep, "REVIEW">> = {
  real_person: "CV",
  contact_current: "PERSONAL",
  matches_cv: "EXPERIENCE",
  not_duplicate: "PERSONAL",
};

export const MIN_REASON_LENGTH = 15;

export const formatWait = (hours: number) =>
  hours < 1 ? "<1h" : hours < 72 ? `${hours}h` : `${Math.floor(hours / 24)}d`;

export const waitTone = (hours: number, targetHours: number) =>
  hours >= targetHours ? "text-red-600" : hours >= 24 ? "text-amber-600" : "text-muted-foreground";

export const formatDay = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
