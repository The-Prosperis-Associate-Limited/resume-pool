"use client";

import { useId } from "react";
import { Controller, get, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FIELD_CLASS, FieldShell } from "./field-shell";

interface Props<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<"textarea">,
  "name" | "value" | "onChange" | "onBlur"
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  containerClassName?: string;
}

export function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  errors,
  label,
  hint,
  containerClassName,
  className,
  maxLength,
  rows = 4,
  ...props
}: Props<TFieldValues>) {
  const id = useId();
  const error = (get(errors, name) as { message?: string } | undefined)?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const length = String(field.value ?? "").length;
        return (
          <FieldShell
            id={id}
            label={label}
            error={error}
            className={containerClassName}
            hint={
              <span className="flex justify-between gap-3">
                <span>{hint}</span>
                {maxLength && (
                  <span
                    className={cn("tabular-nums", length > maxLength * 0.9 && "text-amber-600")}
                  >{`${length}/${maxLength}`}</span>
                )}
              </span>
            }
          >
            <textarea
              {...props}
              id={id}
              rows={rows}
              maxLength={maxLength}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={!!error}
              className={cn(FIELD_CLASS, "min-h-24 resize-y py-2.5 leading-relaxed", className)}
            />
          </FieldShell>
        );
      }}
    />
  );
}
