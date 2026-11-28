"use client";

import type { LucideIcon } from "lucide-react";
import { Controller, get, type Control, type FieldErrors, type FieldValues, type Path } from "react-hook-form";
import { AppInput } from "@/components/shared/app-input";

interface Props<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<"input">,
  "name" | "value" | "onChange" | "onBlur"
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  hint?: React.ReactNode;
  containerClassName?: string;
  icon?: LucideIcon;
}

export function FormInput<TFieldValues extends FieldValues>({ control, name, errors, ...props }: Props<TFieldValues>) {
  const errorMessage = (get(errors, name) as { message?: string } | undefined)?.message;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AppInput
          {...props}
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          error={errorMessage}
          {...(props.type === "checkbox"
            ? { checked: !!field.value, onChange: (event) => field.onChange(event.target.checked) }
            : { value: field.value ?? "", onChange: field.onChange })}
        />
      )}
    />
  );
}
