"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PoolSearchArt } from "@/components/illustrations/empty-art";
import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { AppSheet } from "@/components/shared/app-sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { errorMessage } from "@/lib/handle-errors";
import { SPRING } from "@/lib/motion";
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/onboarding";
import {
  AVAILABILITY_BUCKETS,
  EMPTY_QUERY,
  EXPERIENCE_BANDS,
  PAGE_SIZE,
  type PoolQuery,
  poolApiUrl,
  readPoolQuery,
  salaryLabel,
  SORT_LABELS,
  writePoolQuery,
} from "@/lib/pool";
import type { PoolSearchResponse, PoolSort } from "@/types/pool";
import { PoolFilters } from "./pool-filters";
import { PoolResultCard } from "./pool-result-card";

const activeChips = (query: PoolQuery): { key: string; label: string; clear: Partial<PoolQuery> }[] => [
  ...(query.q ? [{ key: "q", label: `“${query.q}”`, clear: { q: "" } }] : []),
  ...(query.location
    ? [
        {
          key: "loc",
          label: query.relocate ? `${query.location} + relocating` : query.location,
          clear: { location: "", relocate: false },
        },
      ]
    : []),
  ...(query.exp
    ? [
        {
          key: "exp",
          label: EXPERIENCE_BANDS.find((band) => band.key === query.exp)?.chip ?? query.exp,
          clear: { exp: "" },
        },
      ]
    : []),
  ...(query.salary ? [{ key: "salary", label: salaryLabel(query.salary), clear: { salary: null } }] : []),
  ...query.jobTypes.map((value) => ({
    key: `jt-${value}`,
    label: JOB_TYPE_LABELS[value],
    clear: { jobTypes: query.jobTypes.filter((entry) => entry !== value) },
  })),
  ...query.workModes.map((value) => ({
    key: `wm-${value}`,
    label: WORK_MODE_LABELS[value],
    clear: { workModes: query.workModes.filter((entry) => entry !== value) },
  })),
  ...query.availability.map((key) => ({
    key: `av-${key}`,
    label: AVAILABILITY_BUCKETS.find((bucket) => bucket.key === key)?.label ?? key,
    clear: { availability: query.availability.filter((entry) => entry !== key) },
  })),
  ...query.certifications.map((name) => ({
    key: `c-${name}`,
    label: name,
    clear: { certifications: query.certifications.filter((entry) => entry !== name) },
  })),
  ...query.skills.map((name) => ({
    key: `s-${name}`,
    label: name,
    clear: { skills: query.skills.filter((entry) => entry !== name) },
  })),
];

export const PoolSearch = function () {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const query = useMemo(() => readPoolQuery(new URLSearchParams(params.toString())), [params]);
  const [keywords, setKeywords] = useState(query.q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const update = (next: Partial<PoolQuery>) => {
    const merged = { ...query, ...next };
    if (next.q !== undefined) setKeywords(next.q);
    const search = writePoolQuery(merged);
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  const results = useInfiniteQuery({
    queryKey: ["pool", poolApiUrl(query, 1)],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => (await api.get<PoolSearchResponse>(poolApiUrl(query, pageParam))).data,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    staleTime: 30_000,
  });

  const first = results.data?.pages[0];
  const candidates = results.data?.pages.flatMap((page) => page.data) ?? [];
  const chips = activeChips(query);
  const ranked = !!query.q.trim();
  const sort: PoolSort = first?.sort ?? (ranked ? "match" : "newest");
  const here = params.toString();
  const hrefFor = (ref: string) => `${pathname}/${ref}${here ? `?${here}` : ""}`;

  const filters = <PoolFilters key={query.location} query={query} facets={first?.facets} onChange={update} />;

  return (
    <div className="grid gap-5">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          update({ q: keywords });
        }}
        className="flex gap-2"
      >
        <label className="focus-within:border-primary flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-xl border bg-white px-4 shadow-xs">
          <Search className="text-faint size-4.5 shrink-0" />
          <input
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
            placeholder="Search roles, skills or keywords"
            aria-label="Search roles, skills or keywords"
            maxLength={100}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
          {keywords && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => update({ q: "" })}
              className="text-faint hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        <Button type="submit" className="h-12 rounded-xl px-5">
          Search
        </Button>
      </form>

      <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden overflow-hidden rounded-2xl border bg-white xl:sticky xl:top-6 xl:block">
          {filters}
        </aside>

        <section className="min-w-0">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm" aria-live="polite">
              {first ? (
                <>
                  <b className="tabular-nums">{first.total}</b> candidate{first.total === 1 ? "" : "s"}{" "}
                  <span className="text-muted-foreground">{chips.length ? "match your filters" : "in the pool"}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Searching…</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg xl:hidden" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal /> Filters{chips.length ? ` (${chips.length})` : ""}
              </Button>
              <label className="text-muted-foreground flex items-center gap-2 text-sm">
                Sort
                <select
                  value={sort}
                  onChange={(event) => update({ sort: event.target.value as PoolSort })}
                  className="text-foreground h-9 rounded-lg border bg-white px-2 text-sm font-semibold"
                >
                  {(Object.keys(SORT_LABELS) as PoolSort[])
                    .filter((key) => key !== "match" || ranked)
                    .map((key) => (
                      <option key={key} value={key}>
                        {SORT_LABELS[key]}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          </div>

          {!!chips.length && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              <AnimatePresence initial={false}>
                {chips.map((chip) => (
                  <motion.button
                    key={chip.key}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={SPRING}
                    type="button"
                    onClick={() => update(chip.clear)}
                    aria-label={`Remove filter ${chip.label}`}
                    className="border-primary bg-brand-50 text-brand-700 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
                  >
                    {chip.label} <X className="size-3" />
                  </motion.button>
                ))}
              </AnimatePresence>
              <button
                type="button"
                onClick={() => update({ ...EMPTY_QUERY })}
                className="text-primary px-1 text-xs font-semibold"
              >
                Clear all
              </button>
            </div>
          )}

          {results.isError ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-sm">
              <p className="font-semibold">The search couldn&apos;t load.</p>
              <p className="text-muted-foreground mt-1">{errorMessage(results.error as Error)}</p>
              <Button variant="outline" className="mt-4 rounded-lg" onClick={() => results.refetch()}>
                Try again
              </Button>
            </div>
          ) : !first ? (
            <div className="grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <div className="grid justify-items-center gap-3 rounded-2xl border bg-white px-6 py-14 text-center">
              <PoolSearchArt className="size-28" />
              <p className="text-lg font-bold">No one matches all of that</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                Try fewer filters or a broader keyword. New profiles join the pool every day after review.
              </p>
              {!!chips.length && (
                <Button variant="outline" className="mt-2 rounded-lg" onClick={() => update({ ...EMPTY_QUERY })}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <Stagger
                key={poolApiUrl(query, 1)}
                step={0.04}
                className="grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4"
              >
                {candidates.map((candidate) => (
                  <StaggerItem key={candidate.public_ref}>
                    <PoolResultCard candidate={candidate} href={hrefFor(candidate.public_ref)} />
                  </StaggerItem>
                ))}
              </Stagger>
              {results.hasNextPage && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    isLoading={results.isFetchingNextPage}
                    onClick={() => results.fetchNextPage()}
                  >
                    Load {Math.min(PAGE_SIZE, first.total - candidates.length)} more
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <AppSheet isOpen={filtersOpen} onOpenChange={setFiltersOpen} title="Filters" side="right" width="320px">
        {filters}
      </AppSheet>
    </div>
  );
};
