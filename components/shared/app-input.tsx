"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"input"> {
  label?: React.ReactNode;
  labelAction?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  containerClassName?: string;
  icon?: LucideIcon;
}

export const AppInput = function ({
  label,
  labelAction,
  hint,
  error,
  containerClassName,
  icon: Icon,
  id,
  type,
  className,
  ...props
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  if (type === "checkbox") {
    return (
      <div className={cn("grid gap-1.5", containerClassName)}>
        <label htmlFor={inputId} className="text-ink-2 flex cursor-pointer items-start gap-2.5 text-[13px]">
          <input id={inputId} type="checkbox" className="accent-primary mt-px size-4.25 shrink-0" {...props} />
          <span>{label}</span>
        </label>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-1.5", containerClassName)}>
      {(label || labelAction) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <Label htmlFor={inputId} className="text-ink-2 text-[13px] font-semibold">
              {label}
            </Label>
          )}
          {labelAction}
        </div>
      )}
      <div className="relative flex items-center">
        {Icon && <Icon className="text-faint pointer-events-none absolute left-3.25 size-4.5" />}
        <Input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "placeholder:text-faint focus-visible:border-brand-600 focus-visible:ring-brand-600/15 h-11 rounded-[10px] bg-white px-3.5 text-[15px] shadow-none focus-visible:ring-4",
            Icon && "pl-10",
            isPassword && "pr-11",
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            className="text-muted-foreground hover:text-foreground absolute right-3 grid size-6 place-items-center"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {hint && !error && <div className="text-muted-foreground text-xs">{hint}</div>}
      {error && (
        <p id={`${inputId}-error`} className="text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  );
};
