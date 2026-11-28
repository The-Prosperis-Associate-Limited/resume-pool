"use client";

import { useState } from "react";
import { SALARY_CEILING, SALARY_STEP, salaryLabel } from "@/lib/pool";

interface Props {
  value: [number, number] | null;
  onCommit: (value: [number, number] | null) => void;
}

const THUMB =
  "pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4.5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm";

export const SalaryRange = function ({ value, onCommit }: Props) {
  const [draft, setDraft] = useState<[number, number]>(value ?? [0, SALARY_CEILING]);
  const [low, high] = draft;
  const commit = () => onCommit(low === 0 && high >= SALARY_CEILING ? null : draft);

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-semibold tabular-nums">{salaryLabel(draft)} a month</p>
      <div className="relative h-6" onPointerUp={commit} onKeyUp={commit} onTouchEnd={commit}>
        <div className="bg-border absolute inset-x-0 top-2.5 h-1 rounded-full" />
        <div
          className="bg-primary absolute top-2.5 h-1 rounded-full"
          style={{ left: `${(low / SALARY_CEILING) * 100}%`, right: `${100 - (high / SALARY_CEILING) * 100}%` }}
        />
        <input
          type="range"
          aria-label="Minimum monthly salary"
          min={0}
          max={SALARY_CEILING}
          step={SALARY_STEP}
          value={low}
          onChange={(event) => setDraft([Math.min(Number(event.target.value), high - SALARY_STEP), high])}
          className={THUMB}
        />
        <input
          type="range"
          aria-label="Maximum monthly salary"
          min={0}
          max={SALARY_CEILING}
          step={SALARY_STEP}
          value={high}
          onChange={(event) => setDraft([low, Math.max(Number(event.target.value), low + SALARY_STEP)])}
          className={THUMB}
        />
      </div>
    </div>
  );
};
