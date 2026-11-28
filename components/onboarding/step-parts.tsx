"use client";

import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";
import { ONBOARDING_STEPS } from "@/lib/onboarding";
import type { OnboardingStep } from "@/types/candidate";

interface HeaderProps {
  step: OnboardingStep;
  title: string;
  lead: React.ReactNode;
}

export const StepHeader = function ({ step, title, lead }: HeaderProps) {
  const index = ONBOARDING_STEPS.findIndex((entry) => entry.step === step);

  return (
    <div className="mb-6 sm:mb-7">
      <span className="bg-brand-50 text-brand-700 inline-flex h-6 items-center rounded-full px-2.5 text-xs font-bold">
        {step === "REVIEW" ? "Review" : `Step ${index + 1}`}
      </span>
      <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight sm:text-[26px]">{title}</h1>
      <p className="text-muted-foreground mt-1.5 text-[15px]">{lead}</p>
    </div>
  );
};

interface ActionsProps {
  backHref?: string;
  formId?: string;
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const StepActions = function ({ backHref, formId, label, isLoading, disabled, onClick }: ActionsProps) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-between">
      {backHref ? (
        <Button asChild variant="outline" className="h-11 rounded-xl px-5">
          <Link href={backHref}>
            <ArrowLeft /> Back
          </Link>
        </Button>
      ) : (
        <span />
      )}
      <Button
        type={formId ? "submit" : "button"}
        form={formId}
        onClick={onClick}
        isLoading={isLoading}
        disabled={disabled}
        className="h-11 rounded-xl px-6"
      >
        {label} <ArrowRight />
      </Button>
    </div>
  );
};

interface RowProps {
  title: string;
  subtitle?: string;
  onRemove?: () => void;
  children: React.ReactNode;
}

export const RepeatRow = function ({ title, subtitle, onRemove, children }: RowProps) {
  return (
    <motion.section
      layout
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit="exit"
      className="rounded-2xl border p-4 sm:p-5"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold">{title}</h3>
          {subtitle && <p className="text-muted-foreground truncate text-[13px]">{subtitle}</p>}
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Remove ${title}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        )}
      </div>
      <div className="grid gap-4">{children}</div>
    </motion.section>
  );
};

export const AddRowButton = function ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="h-11 w-full rounded-xl border-dashed">
      <Plus /> {children}
    </Button>
  );
};
