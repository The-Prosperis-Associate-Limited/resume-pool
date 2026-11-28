"use client";

import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { Controller, get, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { FIELD_CLASS, FieldShell } from "./field-shell";

interface Props<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  placeholder?: string;
  max?: number;
  maxLength?: number;
  suggestions?: string[];
  containerClassName?: string;
}

export function FormChips<TFieldValues extends FieldValues>({
  control,
  name,
  errors,
  label,
  hint,
  placeholder,
  max = 30,
  maxLength = 60,
  suggestions = [],
  containerClassName,
}: Props<TFieldValues>) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const error = (get(errors, name) as { message?: string } | undefined)?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const values: string[] = field.value ?? [];
        const has = (entry: string) => values.some((value) => value.toLowerCase() === entry.toLowerCase());
        const add = (raw: string) => {
          const entries = raw
            .split(",")
            .map((entry) => entry.trim().slice(0, maxLength))
            .filter(Boolean);
          const next = [...values];
          for (const entry of entries)
            if (!next.some((value) => value.toLowerCase() === entry.toLowerCase()) && next.length < max)
              next.push(entry);
          field.onChange(next);
          setDraft("");
        };
        const remove = (entry: string) => field.onChange(values.filter((value) => value !== entry));
        const open = suggestions.filter((entry) => !has(entry)).slice(0, 8);

        return (
          <FieldShell
            id={id}
            label={label}
            hint={hint ?? `${values.length}/${max} · press Enter or comma to add`}
            error={error}
            className={containerClassName}
          >
            <div
              className={cn(
                FIELD_CLASS,
                "focus-within:border-brand-600 focus-within:ring-brand-600/15 flex min-h-11 flex-wrap items-center gap-1.5 px-2 py-1.5 focus-within:ring-4",
                error && "border-destructive",
              )}
            >
              <AnimatePresence initial={false}>
                {values.map((entry) => (
                  <motion.span
                    key={entry}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={SPRING}
                    className="bg-brand-50 text-brand-700 inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 text-[13px] font-medium"
                  >
                    {entry}
                    <button
                      type="button"
                      onClick={() => remove(entry)}
                      className="hover:bg-brand-600/15 grid size-5 place-items-center rounded-full"
                      aria-label={`Remove ${entry}`}
                    >
                      <X className="size-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <input
                id={id}
                ref={field.ref}
                value={draft}
                maxLength={maxLength}
                disabled={values.length >= max}
                placeholder={values.length ? "" : placeholder}
                onChange={(event) =>
                  event.target.value.includes(",") ? add(event.target.value) : setDraft(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (draft.trim()) add(draft);
                  }
                  if (event.key === "Backspace" && !draft && values.length) remove(values[values.length - 1]);
                }}
                onBlur={() => {
                  if (draft.trim()) add(draft);
                  field.onBlur();
                }}
                className="placeholder:text-faint min-w-32 flex-1 bg-transparent px-1.5 py-1 text-[15px] outline-none"
              />
            </div>
            {!!open.length && values.length < max && (
              <div className="flex flex-wrap gap-1.5">
                {open.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => add(entry)}
                    className="text-muted-foreground hover:border-brand-600 hover:text-brand-700 inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-xs font-medium transition-colors"
                  >
                    <Plus className="size-3" />
                    {entry}
                  </button>
                ))}
              </div>
            )}
          </FieldShell>
        );
      }}
    />
  );
}
