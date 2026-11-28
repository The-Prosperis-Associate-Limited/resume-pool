"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { useId } from "react";
import { Controller, get, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FieldShell } from "./field-shell";

interface Props<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  options: { value: string; label: string }[];
  multiple?: boolean;
  containerClassName?: string;
}

export function FormToggleGroup<TFieldValues extends FieldValues>({
  control,
  name,
  errors,
  label,
  hint,
  options,
  multiple = true,
  containerClassName,
}: Props<TFieldValues>) {
  const id = useId();
  const error = (get(errors, name) as { message?: string } | undefined)?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selected: string[] = multiple ? (field.value ?? []) : field.value ? [field.value] : [];
        const toggle = (value: string) => {
          if (!multiple) return field.onChange(value);
          field.onChange(selected.includes(value) ? selected.filter((entry) => entry !== value) : [...selected, value]);
        };

        return (
          <FieldShell id={id} label={label} hint={hint} error={error} className={containerClassName}>
            <div id={id} role={multiple ? "group" : "radiogroup"} className="flex flex-wrap gap-2">
              {options.map((option) => {
                const on = selected.includes(option.value);
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    role={multiple ? "checkbox" : "radio"}
                    aria-checked={on}
                    whileTap={{ scale: 0.96 }}
                    transition={SPRING}
                    onClick={() => toggle(option.value)}
                    onBlur={field.onBlur}
                    className={cn(
                      "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
                      on
                        ? "border-primary bg-brand-50 text-brand-700"
                        : "text-ink-2 hover:border-brand-600/50 bg-white",
                    )}
                  >
                    <motion.span
                      initial={false}
                      animate={{ width: on ? 14 : 0, opacity: on ? 1 : 0 }}
                      className="inline-flex overflow-hidden"
                    >
                      <Check className="size-3.5 shrink-0" strokeWidth={3} />
                    </motion.span>
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </FieldShell>
        );
      }}
    />
  );
}
