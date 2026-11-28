import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ONBOARDING_STEPS } from "@/lib/onboarding";

interface Props {
  items: { step?: string; message: string }[];
  from?: "review" | "profile";
}

export const StepIssueList = function ({ items, from = "review" }: Props) {
  return (
    <ul className="mt-2 grid gap-2">
      {items.map((item, index) => {
        const step = ONBOARDING_STEPS.find((entry) => entry.step === item.step);
        return (
          <li key={`${item.step}-${index}`} className="grid gap-0.5">
            {step && (
              <Link
                href={`${step.path}?from=${from}`}
                className="inline-flex w-fit items-center gap-1 text-[13px] font-bold underline-offset-2 hover:underline"
              >
                {step.label} <ArrowRight className="size-3.5" />
              </Link>
            )}
            <span>{item.message}</span>
          </li>
        );
      })}
    </ul>
  );
};
