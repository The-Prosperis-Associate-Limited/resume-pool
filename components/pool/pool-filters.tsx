"use client";

import { MapPin, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AppInput } from "@/components/shared/app-input";
import { SPRING } from "@/lib/motion";
import { JOB_TYPE_LABELS, WORK_MODE_LABELS } from "@/lib/onboarding";
import { AVAILABILITY_BUCKETS, EXPERIENCE_BANDS, type PoolQuery } from "@/lib/pool";
import { cn } from "@/lib/utils";
import type { JobType, WorkMode } from "@/types/candidate";
import type { PoolFacets } from "@/types/pool";
import { SalaryRange } from "./salary-range";

interface Props {
  query: PoolQuery;
  facets: PoolFacets | undefined;
  onChange: (next: Partial<PoolQuery>) => void;
}

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

const Group = function ({
  title,
  onClear,
  children,
}: {
  title: string;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b px-4.5 py-4 last:border-b-0">
      <h4 className="mb-2.5 flex items-center justify-between text-[13px] font-bold">
        {title}
        {onClear && (
          <button type="button" onClick={onClear} className="text-primary text-xs font-semibold">
            Clear
          </button>
        )}
      </h4>
      {children}
    </div>
  );
};

const FacetCheck = function ({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <AppInput type="checkbox" checked={checked} onChange={onToggle} label={label} />
      <span className="text-faint text-xs tabular-nums">{count ?? 0}</span>
    </div>
  );
};

const Chip = function ({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      transition={SPRING}
      aria-pressed={on}
      onClick={onToggle}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
        on ? "border-primary bg-brand-50 text-brand-700" : "text-ink-2 hover:bg-muted bg-white",
      )}
    >
      {label}
    </motion.button>
  );
};

export const PoolFilters = function ({ query, facets, onChange }: Props) {
  const [location, setLocation] = useState(query.location);
  const [skill, setSkill] = useState("");
  const count = <T extends string>(list: { value: T; count: number }[] | undefined, value: T) =>
    list?.find((entry) => entry.value === value)?.count;
  const certs = [...new Set([...query.certifications, ...(facets?.certifications.map((entry) => entry.value) ?? [])])];

  const addSkill = () => {
    const value = skill.trim();
    if (
      value &&
      !query.skills.some((entry) => entry.toLowerCase() === value.toLowerCase()) &&
      query.skills.length < 10
    ) {
      onChange({ skills: [...query.skills, value] });
    }
    setSkill("");
  };

  return (
    <div>
      <Group
        title="Location"
        onClear={query.location ? () => (setLocation(""), onChange({ location: "", relocate: false })) : undefined}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onChange({ location });
          }}
        >
          <label className="bg-page focus-within:border-primary flex h-10 items-center gap-2 rounded-xl border px-3">
            <MapPin className="text-faint size-4" />
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onBlur={() => location !== query.location && onChange({ location })}
              placeholder="State or city"
              aria-label="Location"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
        </form>
        <div className="mt-2.5">
          <AppInput
            type="checkbox"
            checked={query.relocate}
            disabled={!query.location}
            onChange={() => onChange({ relocate: !query.relocate })}
            label="Include open to relocate"
          />
        </div>
      </Group>

      <Group title="Experience" onClear={query.exp ? () => onChange({ exp: "" }) : undefined}>
        <div
          role="radiogroup"
          aria-label="Years of experience"
          className="bg-page grid grid-cols-3 gap-1 rounded-xl border p-1"
        >
          {EXPERIENCE_BANDS.map((band) => (
            <button
              key={band.key}
              type="button"
              role="radio"
              aria-checked={query.exp === band.key}
              onClick={() => onChange({ exp: query.exp === band.key ? "" : band.key })}
              className={cn(
                "relative rounded-lg py-1.5 text-[12.5px] font-semibold",
                query.exp === band.key ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {query.exp === band.key && (
                <motion.span
                  layoutId="exp-band"
                  transition={SPRING}
                  className="absolute inset-0 rounded-lg bg-white shadow-xs"
                />
              )}
              <span className="relative">{band.label}</span>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Monthly salary" onClear={query.salary ? () => onChange({ salary: null }) : undefined}>
        <SalaryRange
          key={query.salary?.join("-") ?? "any"}
          value={query.salary}
          onCommit={(salary) => onChange({ salary })}
        />
      </Group>

      <Group title="Job type">
        {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map((value) => (
          <FacetCheck
            key={value}
            label={JOB_TYPE_LABELS[value]}
            count={count(facets?.jobTypes, value)}
            checked={query.jobTypes.includes(value)}
            onToggle={() => onChange({ jobTypes: toggle(query.jobTypes, value) })}
          />
        ))}
      </Group>

      <Group title="Work mode">
        {(Object.keys(WORK_MODE_LABELS) as WorkMode[]).map((value) => (
          <FacetCheck
            key={value}
            label={WORK_MODE_LABELS[value]}
            count={count(facets?.workModes, value)}
            checked={query.workModes.includes(value)}
            onToggle={() => onChange({ workModes: toggle(query.workModes, value) })}
          />
        ))}
      </Group>

      <Group title="Availability">
        {AVAILABILITY_BUCKETS.map((bucket) => (
          <FacetCheck
            key={bucket.key}
            label={bucket.label}
            count={bucket.values.reduce((sum, value) => sum + (count(facets?.availability, value) ?? 0), 0)}
            checked={query.availability.includes(bucket.key)}
            onToggle={() => onChange({ availability: toggle(query.availability, bucket.key) })}
          />
        ))}
      </Group>

      <Group title="Certifications">
        {certs.length ? (
          <div className="flex flex-wrap gap-1.5">
            {certs.map((name) => (
              <Chip
                key={name}
                label={name}
                on={query.certifications.includes(name)}
                onToggle={() => onChange({ certifications: toggle(query.certifications, name) })}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">No certifications in these results.</p>
        )}
      </Group>

      <Group title="Skills" onClear={query.skills.length ? () => onChange({ skills: [] }) : undefined}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            addSkill();
          }}
          className="bg-page focus-within:border-primary flex h-10 items-center gap-2 rounded-xl border pr-1 pl-3"
        >
          <input
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
            placeholder="Must have, e.g. Excel"
            aria-label="Required skill"
            maxLength={60}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <button
            type="submit"
            aria-label="Add skill"
            className="text-primary hover:bg-brand-50 grid size-8 place-items-center rounded-lg"
          >
            <Plus className="size-4" />
          </button>
        </form>
        {!!query.skills.length && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {query.skills.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => onChange({ skills: query.skills.filter((entry) => entry !== name) })}
                className="border-primary bg-brand-50 text-brand-700 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
              >
                {name} <X className="size-3" />
              </button>
            ))}
          </div>
        )}
      </Group>
    </div>
  );
};
