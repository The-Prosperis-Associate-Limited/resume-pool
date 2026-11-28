"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";
import { Controller, get, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FIELD_CLASS, FieldShell } from "./field-shell";

interface Props<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  placeholder?: string;
  options: { value: string; label: string }[];
  containerClassName?: string;
}

export function FormSelect<TFieldValues extends FieldValues>({
  control,
  name,
  errors,
  label,
  hint,
  placeholder = "Choose…",
  options,
  containerClassName,
}: Props<TFieldValues>) {
  const id = useId();
  const error = (get(errors, name) as { message?: string } | undefined)?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FieldShell id={id} label={label} hint={hint} error={error} className={containerClassName}>
          <div className="relative">
            <select
              id={id}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={!!error}
              className={cn(FIELD_CLASS, "h-11 appearance-none pr-10", !field.value && "text-faint")}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value} className="text-foreground">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2" />
          </div>
        </FieldShell>
      )}
    />
  );
}
