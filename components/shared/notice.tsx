"use client";

import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Collapse } from "@/components/motion/motion-primitives";
import { cn } from "@/lib/utils";

type Tone = "brand" | "warning" | "danger" | "success";

const TONES: Record<Tone, { box: string; icon: typeof Info }> = {
  brand: { box: "bg-brand-50 border-brand-600/20 text-ink-2 [&_svg]:text-primary", icon: Info },
  warning: { box: "bg-amber-50 border-amber-200 text-amber-900 [&_svg]:text-amber-600", icon: AlertTriangle },
  danger: { box: "bg-red-50 border-red-200 text-red-900 [&_svg]:text-red-600", icon: AlertTriangle },
  success: { box: "bg-emerald-50 border-emerald-200 text-emerald-900 [&_svg]:text-emerald-600", icon: CheckCircle2 },
};

interface Props {
  tone?: Tone;
  show?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Renders through Collapse, so a notice slides open and closed instead of shoving the form.
export const Notice = function ({ tone = "brand", show = true, children, className }: Props) {
  const { box, icon: Icon } = TONES[tone];

  return (
    <Collapse show={show}>
      <div
        role={tone === "danger" || tone === "warning" ? "alert" : "status"}
        className={cn("flex items-start gap-3 rounded-xl border p-3.5 text-sm", box, className)}
      >
        <Icon className="mt-0.5 size-4 shrink-0" />
        <div className="min-w-0">{children}</div>
      </div>
    </Collapse>
  );
};
