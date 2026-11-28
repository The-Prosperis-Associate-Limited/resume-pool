import type { Availability, CandidatePreview, JobType, WorkMode } from "@/types/candidate";

export type PoolSort = "match" | "newest" | "experience";

export interface PoolCandidate extends CandidatePreview {
  match: number | null;
}

export interface FacetCount<T extends string = string> {
  value: T;
  count: number;
}

export interface PoolFacets {
  jobTypes: FacetCount<JobType>[];
  workModes: FacetCount<WorkMode>[];
  availability: FacetCount<Availability>[];
  certifications: FacetCount[];
}

export interface PoolSearchResponse {
  message: string;
  data: PoolCandidate[];
  total: number;
  page: number;
  totalPages: number;
  sort: PoolSort;
  facets: PoolFacets;
}
