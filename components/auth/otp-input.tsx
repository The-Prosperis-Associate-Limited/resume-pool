"use client";

import { motion, useAnimationControls } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE_OUT, shake, SOFT_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  failures?: number;
}

export const OtpInput = function ({ value, onChange, onComplete, length = 6, disabled, invalid, failures = 0 }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const controls = useAnimationControls();
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  useEffect(() => {
    if (!failures) return;
    controls.start(shake);
    refs.current[0]?.focus();
  }, [failures, controls]);

  const commit = (next: string, focusIndex: number) => {
    const clean = next.replace(/\D/g, "").slice(0, length);
    onChange(clean);
    refs.current[Math.min(focusIndex, length - 1)]?.focus();
    if (clean.length === length) onComplete?.(clean);
  };

  const setDigit = (index: number, digit: string) => {
    const chars = digits.slice();
    chars[index] = digit;
    commit(chars.join(""), digit ? index + 1 : index);
  };

  return (
    <motion.div
      animate={controls}
      className="flex justify-between gap-2 sm:gap-2.5"
      role="group"
      aria-label="6-digit code"
    >
      {digits.map((digit, index) => (
        <motion.input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: digit ? [1, 1.08, 1] : 1 }}
          transition={{ ...SOFT_SPRING, delay: digit ? 0 : index * 0.04, scale: { duration: 0.22, ease: EASE_OUT } }}
          value={digit}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          maxLength={length}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid || undefined}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const typed = event.target.value.replace(/\D/g, "");
            // A paste or an autofill lands in one box as the whole code.
            if (typed.length > 1) return commit(digits.slice(0, index).join("") + typed, index + typed.length);
            setDigit(index, typed);
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) {
              event.preventDefault();
              setDigit(index - 1, "");
            }
            if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
            if (event.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
          }}
          className={cn(
            "text-foreground h-13.5 w-11 rounded-xl border-[1.5px] text-center text-[22px] font-bold transition-colors outline-none sm:h-16 sm:w-14 sm:text-[26px]",
            "focus:border-brand-600 focus:ring-brand-600/15 focus:ring-4",
            digit ? "bg-brand-50 border-brand-600/40" : "border-border bg-white",
            invalid && "border-destructive",
          )}
        />
      ))}
    </motion.div>
  );
};
