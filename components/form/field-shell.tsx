import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export const FIELD_CLASS =
  "border-input placeholder:text-faint focus-visible:border-brand-600 focus-visible:ring-brand-600/15 aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full rounded-[10px] border bg-white px-3.5 text-[15px] outline-none transition-[color,box-shadow] focus-visible:ring-4 disabled:opacity-50";

export const FieldShell = function ({ id, label, hint, error, className, children }: Props) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-ink-2 text-[13px] font-semibold">
          {label}
        </Label>
      )}
      {children}
      {hint && !error && <div className="text-muted-foreground text-xs">{hint}</div>}
      {error && (
        <p id={`${id}-error`} className="text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  );
};
