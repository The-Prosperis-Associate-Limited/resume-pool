import { API_ENDPOINTS } from "@/lib/endpoints";
import { formatNaira } from "@/lib/onboarding";
import type { Availability, JobType, WorkMode } from "@/types/candidate";
import type { PoolSort } from "@/types/pool";

export const PAGE_SIZE = 12;

export const EXPERIENCE_BANDS = [
  { key: "0-2", label: "0–2", chip: "0–2 yrs", min: 0, max: 2 },
  { key: "3-7", label: "3–7", chip: "3–7 yrs", min: 3, max: 7 },
  { key: "8+", label: "8+", chip: "8+ yrs", min: 8, max: undefined },
] as const;

export const AVAILABILITY_BUCKETS: { key: string; label: string; values: Availability[] }[] = [
  { key: "now", label: "Immediately", values: ["IMMEDIATELY"] },
  { key: "month", label: "Within 1 month", values: ["TWO_WEEKS", "ONE_MONTH"] },
  { key: "later", label: "1–3 months", values: ["TWO_MONTHS", "THREE_MONTHS"] },
];

export const SALARY_STEP = 50_000;
export const SALARY_CEILING = 3_000_000;

export const SORT_LABELS: Record<PoolSort, string> = {
  match: "Best match",
  newest: "Newest",
  experience: "Most experienced",
};

export interface PoolQuery {
  q: string;
  location: string;
  relocate: boolean;
  exp: string;
  salary: [number, number] | null;
  jobTypes: JobType[];
  workModes: WorkMode[];
  availability: string[];
  certifications: string[];
  skills: string[];
  sort: PoolSort | "";
}

const csv = (value: string | null) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const readPoolQuery = (params: URLSearchParams): PoolQuery => {
  const [low, high] = csv(params.get("salary")).map(Number);
  const sort = params.get("sort");

  return {
    q: params.get("q") ?? "",
    location: params.get("location") ?? "",
    relocate: params.get("relocate") === "1",
    exp: EXPERIENCE_BANDS.some((band) => band.key === params.get("exp")) ? (params.get("exp") as string) : "",
    salary: Number.isFinite(low) && Number.isFinite(high) && low <= high ? [low, high] : null,
    jobTypes: csv(params.get("job_types")) as JobType[],
    workModes: csv(params.get("work_modes")) as WorkMode[],
    availability: csv(params.get("availability")).filter((key) =>
      AVAILABILITY_BUCKETS.some((bucket) => bucket.key === key),
    ),
    certifications: csv(params.get("certifications")),
    skills: csv(params.get("skills")),
    sort: sort === "match" || sort === "newest" || sort === "experience" ? sort : "",
  };
};

export const writePoolQuery = (query: PoolQuery) => {
  const params = new URLSearchParams();
  const set = (key: string, value: string) => value && params.set(key, value);

  set("q", query.q.trim());
  set("location", query.location.trim());
  if (query.relocate) params.set("relocate", "1");
  set("exp", query.exp);
  if (query.salary) params.set("salary", query.salary.join(","));
  set("job_types", query.jobTypes.join(","));
  set("work_modes", query.workModes.join(","));
  set("availability", query.availability.join(","));
  set("certifications", query.certifications.join(","));
  set("skills", query.skills.join(","));
  set("sort", query.sort);

  return params.toString();
};

export const poolApiUrl = (query: PoolQuery, page: number) => {
  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
  const set = (key: string, value: string | number | undefined) =>
    value !== undefined && value !== "" && params.set(key, String(value));
  const band = EXPERIENCE_BANDS.find((entry) => entry.key === query.exp);

  set("q", query.q.trim());
  set("location", query.location.trim());
  if (query.location.trim() && query.relocate) params.set("include_relocating", "true");
  set("min_years", band?.min);
  set("max_years", band?.max);
  if (query.salary) {
    set("salary_min", query.salary[0] || undefined);
    set("salary_max", query.salary[1] >= SALARY_CEILING ? undefined : query.salary[1]);
  }
  set("job_types", query.jobTypes.join(","));
  set("work_modes", query.workModes.join(","));
  set(
    "availability",
    AVAILABILITY_BUCKETS.filter((bucket) => query.availability.includes(bucket.key))
      .flatMap((bucket) => bucket.values)
      .join(","),
  );
  set("certifications", query.certifications.join(","));
  set("skills", query.skills.join(","));
  set("sort", query.sort);

  return `${API_ENDPOINTS.pool.candidates}?${params}`;
};

export const salaryLabel = ([low, high]: [number, number]) =>
  `${formatNaira(low)} – ${high >= SALARY_CEILING ? `${formatNaira(SALARY_CEILING)}+` : formatNaira(high)}`;

export const EMPTY_QUERY: PoolQuery = {
  q: "",
  location: "",
  relocate: false,
  exp: "",
  salary: null,
  jobTypes: [],
  workModes: [],
  availability: [],
  certifications: [],
  skills: [],
  sort: "",
};

export const formatDuration = (months: number) => {
  if (months < 1) return "Under a month";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years && `${years} yr${years === 1 ? "" : "s"}`, rest && `${rest} mo${rest === 1 ? "" : "s"}`]
    .filter(Boolean)
    .join(" ");
};

export const listedAgo = (iso: string | null) => {
  if (!iso) return "";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Listed today";
  if (days === 1) return "Listed yesterday";
  if (days < 7) return `Listed ${days} days ago`;
  if (days < 30) return `Listed ${Math.floor(days / 7)} week${days < 14 ? "" : "s"} ago`;
  return `Listed ${new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`;
};
