import type { CandidateProfileStatus } from "./auth";
import type { CandidatePreview, OwnProfile, ReviewKind, ReviewReason } from "./candidate";

export interface ReviewQueueItem {
  review_id: string;
  profile_id: string;
  public_ref: string;
  name: string;
  photo_url: string | null;
  headline: string | null;
  kind: ReviewKind;
  submitted_at: string;
  waiting_hours: number;
}

export interface ReviewSummary {
  waiting: number;
  over_24h: number;
  over_target: number;
  target_hours: number;
  decided_today: number;
  median_hours_today: number | null;
}

export interface StandardsResult {
  failures: { field: string; step: string; message: string }[];
  passed: { key: string; label: string; detail: string }[];
}

export type ChecklistKey = "real_person" | "contact_current" | "matches_cv" | "not_duplicate";

export interface ReviewDetail {
  profile: OwnProfile;
  preview: CandidatePreview;
  account: { email: string; email_verified: boolean; joined_at: string };
  review: { id: string; kind: ReviewKind; submitted_at: string; waiting_hours: number; checks: StandardsResult } | null;
  current_checks: StandardsResult;
  checklist_items: { key: ChecklistKey; label: string }[];
  duplicates: {
    profile_id: string;
    public_ref: string;
    name: string | null;
    status: CandidateProfileStatus;
    matched_on: ("phone" | "name")[];
  }[];
  previous_reviews: {
    id: string;
    kind: ReviewKind;
    decision: "APPROVED" | "REJECTED";
    reasons: ReviewReason[] | null;
    checklist: Record<ChecklistKey, boolean> | null;
    internal_note: string | null;
    reviewer: string | null;
    submitted_at: string;
    decided_at: string;
  }[];
  history: {
    from: CandidateProfileStatus;
    to: CandidateProfileStatus;
    reason: string | null;
    actor: string | null;
    at: string;
  }[];
}
