export type UserRole = "CANDIDATE" | "CLIENT" | "ADMIN";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

export type AuthProvider = "PASSWORD" | "GOOGLE";

export type CandidateProfileStatus = "UNSUBMITTED" | "PENDING" | "LIVE" | "REJECTED" | "PAUSED" | "HIRED" | "REMOVED";

export interface Company {
  id: string;
  name: string;
  verified_at: string | null;
}

export interface SessionUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_no: string | null;
  profile_pic: string | null;
  role: UserRole;
  has_validated_email: boolean;
  authProvider: AuthProvider;
  has_password: boolean;
  account_status: AccountStatus;
  createdAt: string;
  candidate_profile: { id: string; status: CandidateProfileStatus; onboarding_step: string; public_ref: string } | null;
  client_account: { id: string; company: Company | null } | null;
  needs_company_details: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  user: SessionUser;
  token: AuthTokens;
}
