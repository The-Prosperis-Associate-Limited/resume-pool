import type { CandidateProfileStatus } from "./auth";

export type OnboardingStep =
  "PERSONAL" | "HEADLINE" | "EXPERIENCE" | "EDUCATION" | "SKILLS" | "PREFERENCES" | "CV" | "PRIVACY" | "REVIEW";
export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type WorkMode = "ONSITE" | "HYBRID" | "REMOTE";
export type Availability = "IMMEDIATELY" | "TWO_WEEKS" | "ONE_MONTH" | "TWO_MONTHS" | "THREE_MONTHS";
export type LanguageLevel = "BASIC" | "CONVERSATIONAL" | "FLUENT" | "NATIVE";
export type CvSource = "UPLOADED" | "BUILT";

export interface OwnExperience {
  id: string;
  title: string;
  employer: string;
  location: string | null;
  started_at: string;
  ended_at: string | null;
  is_current: boolean;
  achievements: string | null;
}

export interface OwnProfile {
  public_ref: string;
  status: CandidateProfileStatus;
  onboarding_step: OnboardingStep;
  submitted_at: string | null;
  personal: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone_no: string | null;
    photo_url: string | null;
    state: string | null;
    city: string | null;
  };
  headline: { headline: string | null; summary: string | null; target_roles: string[] };
  experience: { has_no_experience: boolean; experiences: OwnExperience[] };
  education: {
    educations: {
      id: string;
      institution: string;
      qualification: string;
      field_of_study: string | null;
      grade: string | null;
      start_year: number | null;
      end_year: number | null;
    }[];
    certifications: { id: string; name: string; issuer: string | null; year: number | null }[];
  };
  skills: { skills: string[]; languages: { id: string; name: string; level: LanguageLevel }[] };
  preferences: {
    job_types: JobType[];
    work_modes: WorkMode[];
    salary_min: number | null;
    salary_max: number | null;
    availability: Availability | null;
    open_to_relocate: boolean;
  };
  cv: {
    source: CvSource;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    pages: number | null;
    updated_at: string;
    download_url: string;
  } | null;
  privacy: { hidden_companies: { id: string; name: string }[] };
}

export interface CandidatePreview {
  public_ref: string;
  is_live: boolean;
  headline: string | null;
  summary: string | null;
  target_roles: string[];
  months_experience: number;
  roles: { title: string; is_current: boolean; months: number }[];
  location: { state: string | null; city: string | null; open_to_relocate: boolean };
  salary: { min: number; max: number; currency: string; period: string } | null;
  availability: Availability | null;
  job_types: JobType[];
  work_modes: WorkMode[];
  skills: string[];
  qualifications: { qualification: string; field_of_study: string | null }[];
  certifications: string[];
  languages: { name: string; level: LanguageLevel }[];
}

export interface Readiness {
  ready: boolean;
  issues: { step: OnboardingStep; message: string }[];
}

export type ReviewKind = "NEW" | "RESUBMISSION" | "CV_CHANGED" | "DETAILS_CHANGED";

export interface ReviewReason {
  step: Exclude<OnboardingStep, "REVIEW">;
  message: string;
}

export interface CandidateReviewState {
  kind: ReviewKind;
  submitted_at: string;
  decision: "APPROVED" | "REJECTED" | null;
  reasons: ReviewReason[] | null;
  decided_at: string | null;
}

export interface CandidateProfileResponse {
  profile: OwnProfile;
  preview: CandidatePreview;
  readiness: Readiness;
  review: CandidateReviewState | null;
}

export interface OnboardingOptions {
  states: string[];
  standards: {
    placeholder: boolean;
    cv: { maxBytes: number; maxPages: number; mimeTypes: string[] };
    photo: { maxBytes: number; minWidth: number; minHeight: number; mimeTypes: string[] };
    profile: { minSkills: number; maxSkills: number; photoRequired: boolean };
  };
  consent: { version: string; text: string };
}
