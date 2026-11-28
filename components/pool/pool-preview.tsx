"use client";

import { ArrowLeft, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PoolSearchArt } from "@/components/illustrations/empty-art";
import { AnonAvatar } from "@/components/illustrations/anon-avatar";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import {
  AVAILABILITY_LABELS,
  formatNaira,
  formatYears,
  JOB_TYPE_LABELS,
  LANGUAGE_LEVEL_LABELS,
  WORK_MODE_LABELS,
} from "@/lib/onboarding";
import { formatDuration } from "@/lib/pool";
import type { CandidatePreview } from "@/types/candidate";
import type { APIResponse } from "@/types/response";
import { UnlockCard } from "./unlock-card";

const Section = function ({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b px-5 py-5.5 last:border-b-0 sm:px-6">
      <h3 className="mb-3.5 text-[15px] font-bold">{title}</h3>
      {children}
    </section>
  );
};

const bullets = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

export const PoolPreview = function ({ publicRef, basePath }: { publicRef: string; basePath: string }) {
  const params = useSearchParams();
  const back = params.toString() ? `${basePath}?${params}` : basePath;
  const { data, error } = useGetData<APIResponse<CandidatePreview>>({
    url: API_ENDPOINTS.pool.candidate(publicRef),
    silentErrors: true,
    retry: false,
  });
  const preview = data?.data;

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit rounded-lg">
      <Link href={back}>
        <ArrowLeft /> Back to results
      </Link>
    </Button>
  );

  if (error) {
    return (
      <div className="grid gap-4">
        {backLink}
        <div className="grid justify-items-center gap-3 rounded-2xl border bg-white px-6 py-14 text-center">
          <PoolSearchArt className="size-28" />
          <p className="text-lg font-bold">This profile isn&apos;t in the pool</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            The candidate may have paused their profile, been hired, or be updating it for review.
          </p>
          <Button asChild className="mt-2 rounded-xl">
            <Link href={basePath}>Browse the pool</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!preview) {
    return (
      <div className="grid gap-4">
        {backLink}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const place = [preview.location.city, preview.location.state].filter(Boolean).join(", ");
  const facts = [
    ["Experience", preview.roles.length ? formatYears(preview.months_experience) : "New to work"],
    ["Location", `${place}${preview.location.open_to_relocate ? " · will relocate" : ""}`],
    [
      "Expected salary",
      preview.salary ? `${formatNaira(preview.salary.min)}–${formatNaira(preview.salary.max)}/mo` : "Not given",
    ],
    ["Available", preview.availability ? AVAILABILITY_LABELS[preview.availability] : "Not given"],
  ];

  return (
    <div className="grid gap-4">
      {backLink}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Stagger step={0.07} className="grid min-w-0 gap-5">
          <StaggerItem className="overflow-hidden rounded-2xl border bg-white">
            <div className="flex items-start gap-4 p-5 sm:p-6.5">
              <AnonAvatar className="size-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                    {preview.headline ?? preview.target_roles[0]}
                  </h1>
                  <span className="bg-brand-50 text-brand-700 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    <ShieldCheck className="size-3.5" /> Reviewed by Prosperis
                  </span>
                </div>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  {preview.target_roles.join(" · ")} · {preview.public_ref}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {preview.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-page text-ink-2 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px border-t bg-slate-100 sm:grid-cols-4">
              {facts.map(([label, value]) => (
                <div key={label} className="bg-white px-5 py-3.5">
                  <dt className="text-muted-foreground text-xs font-semibold">{label}</dt>
                  <dd className="text-[14.5px] font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          </StaggerItem>

          <StaggerItem className="overflow-hidden rounded-2xl border bg-white">
            {preview.summary && (
              <Section title="Summary">
                <p className="text-ink-2 text-sm whitespace-pre-line">{preview.summary}</p>
              </Section>
            )}
            <Section title="Experience">
              {preview.roles.length === 0 ? (
                <p className="text-muted-foreground text-sm">No work experience yet.</p>
              ) : (
                <ol className="grid gap-4.5">
                  {preview.roles.map((role, index) => (
                    <li key={index} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3.5">
                      <span className="bg-page text-muted-foreground grid size-10 place-items-center rounded-xl border">
                        <Building2 className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-bold">{role.title}</p>
                        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span aria-hidden className="inline-block h-2.5 w-24 rounded bg-slate-200" />
                          <span className="sr-only">Employer hidden until unlocked</span>· {formatDuration(role.months)}
                          {role.is_current && " · current"}
                        </p>
                        {role.achievements && (
                          <ul className="text-ink-2 mt-2 list-disc pl-4.5 text-[13.5px] marker:text-slate-300">
                            {bullets(role.achievements).map((line, lineIndex) => (
                              <li key={lineIndex} className="my-0.5">
                                {line}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </Section>
            <Section title="Education & certifications">
              <ul className="grid gap-2 text-sm">
                {preview.qualifications.map((entry, index) => (
                  <li key={`q-${index}`}>
                    <b>{entry.qualification}</b>
                    {entry.field_of_study ? ` ${entry.field_of_study}` : ""}
                  </li>
                ))}
                {preview.certifications.map((entry, index) => (
                  <li key={`c-${index}`}>
                    <b>{entry.name}</b>
                    {entry.issuer ? <span className="text-muted-foreground"> · {entry.issuer}</span> : null}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Languages & work preferences">
              <dl className="grid gap-2 text-sm sm:grid-cols-[140px_minmax(0,1fr)]">
                <dt className="text-muted-foreground">Languages</dt>
                <dd>
                  {preview.languages
                    .map((entry) => `${entry.name} (${LANGUAGE_LEVEL_LABELS[entry.level]})`)
                    .join(", ") || "–"}
                </dd>
                <dt className="text-muted-foreground">Job types</dt>
                <dd>{preview.job_types.map((value) => JOB_TYPE_LABELS[value]).join(", ") || "–"}</dd>
                <dt className="text-muted-foreground">Work modes</dt>
                <dd>{preview.work_modes.map((value) => WORK_MODE_LABELS[value]).join(", ") || "–"}</dd>
              </dl>
            </Section>
          </StaggerItem>
        </Stagger>

        <UnlockCard publicRef={preview.public_ref} />
      </div>
    </div>
  );
};
