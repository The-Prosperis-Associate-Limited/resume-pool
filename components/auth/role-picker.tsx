"use client";

import { motion } from "motion/react";
import { HirerArt, SeekerArt } from "@/components/illustrations/role-art";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SignupRole = "CANDIDATE" | "CLIENT";

const OPTIONS = [
  { value: "CANDIDATE", art: SeekerArt, title: "I'm looking for work", sub: "List my CV, free" },
  { value: "CLIENT", art: HirerArt, title: "I'm hiring", sub: "Browse & unlock CVs" },
] as const;

interface Props {
  value: SignupRole;
  onChange: (role: SignupRole) => void;
}

export const RolePicker = function ({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="How you'll use Resume Pool"
      className="mb-1 grid gap-2.5 min-[420px]:grid-cols-2"
    >
      {OPTIONS.map(({ value: option, art: Art, title, sub }) => {
        const selected = value === option;

        return (
          <motion.label
            key={option}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING}
            className={cn(
              "has-focus-visible:ring-brand-600/15 relative flex cursor-pointer gap-3 rounded-xl border-[1.5px] p-3.5 transition-colors has-focus-visible:ring-4",
              selected ? "border-primary" : "border-border hover:border-brand-600/40",
            )}
          >
            {selected && (
              <motion.span
                layoutId="role-picker-active"
                transition={SPRING}
                className="bg-brand-50 absolute inset-0 -z-0 rounded-[10px]"
              />
            )}
            <input
              type="radio"
              name="role"
              value={option}
              checked={selected}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            <Art active={selected} className="relative shrink-0" />
            <span className="relative">
              <b className="block text-sm">{title}</b>
              <span className="text-muted-foreground text-[12.5px]">{sub}</span>
            </span>
          </motion.label>
        );
      })}
    </div>
  );
};
