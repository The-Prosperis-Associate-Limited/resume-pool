"use client";

import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT, SOFT_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

const scorePassword = (password: string) => {
  if (!password) return 0;

  const meetsRule = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  if (!meetsRule) return 1;

  const extras = [
    password.length >= 12,
    /[^A-Za-z0-9]/.test(password) || (/[a-z]/.test(password) && /[A-Z]/.test(password)),
  ].filter(Boolean).length;
  return 2 + extras;
};

const LABELS = [
  "8+ characters with a number.",
  "Too weak. 8+ characters with a number.",
  "Good. 8+ characters with a number.",
  "Strong.",
  "Very strong.",
];

export const PasswordMeter = function ({ password }: { password: string }) {
  const score = scorePassword(password);

  return (
    <div className="grid gap-1.5">
      <div className="grid grid-cols-4 gap-1" aria-hidden>
        {[1, 2, 3, 4].map((bar) => (
          <i key={bar} className="bg-border h-1 overflow-hidden rounded-full">
            <motion.i
              initial={false}
              animate={{ scaleX: bar <= score ? 1 : 0 }}
              transition={{ ...SOFT_SPRING, delay: bar <= score ? (bar - 1) * 0.04 : 0 }}
              className={cn(
                "block h-full origin-left rounded-full transition-colors",
                score === 1 ? "bg-destructive" : "bg-brand-600",
              )}
            />
          </i>
        ))}
      </div>
      <span className="text-muted-foreground relative h-4 text-xs" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={score}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: EASE_OUT }}
            className="absolute inset-0"
          >
            {LABELS[score]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};
