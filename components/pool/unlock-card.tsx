"use client";

import { FileText, Lock, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useViewerRole } from "@/hooks/use-viewer-role";

// Placeholder shapes only: the real details never reach the browser before an unlock.
const LOCKED_ROWS = [
  { icon: UserRound, label: "Full name", width: "w-32" },
  { icon: Phone, label: "Phone number", width: "w-36" },
  { icon: Mail, label: "Email address", width: "w-44" },
  { icon: FileText, label: "Full CV file", width: "w-28" },
];

export const UnlockCard = function ({ publicRef }: { publicRef: string }) {
  const role = useViewerRole();

  return (
    <aside id="unlock" className="scroll-mt-6 overflow-hidden rounded-2xl border bg-white lg:sticky lg:top-6">
      <div className="from-brand-700 to-brand-900 bg-gradient-to-br p-5.5 text-white">
        <p className="flex items-center gap-2 font-bold">
          <Lock className="size-4.5" /> Contact details locked
        </p>
        <p className="mt-1.5 text-[13.5px] text-teal-100/80">
          Unlock to see the candidate&apos;s name, phone, email, employer names and download the full CV.
        </p>
      </div>
      <div className="p-5">
        <ul>
          {LOCKED_ROWS.map(({ icon: Icon, label, width }) => (
            <li key={label} className="flex items-center gap-3 border-b py-3 last:border-b-0">
              <span className="bg-page text-muted-foreground grid size-8.5 shrink-0 place-items-center rounded-lg">
                <Icon className="size-4" />
              </span>
              <span className="sr-only">{label} hidden</span>
              <span aria-hidden className={`h-3 rounded bg-slate-200 ${width}`} />
            </li>
          ))}
        </ul>

        {role === undefined ? (
          <Skeleton className="mt-4 h-11 rounded-xl" />
        ) : role === "CLIENT" ? (
          <>
            <Button className="mt-4 h-11 w-full rounded-xl" disabled>
              <Lock /> Unlock CV · 1 unlock
            </Button>
            <p className="text-muted-foreground mt-2 text-center text-xs">
              Plans and unlocks open shortly. Reopening an unlocked CV will always be free.
            </p>
          </>
        ) : role === null ? (
          <>
            <Button asChild className="mt-4 h-11 w-full rounded-xl">
              <Link href="/auth/signup?role=client">Create a company account to unlock</Link>
            </Button>
            <p className="text-muted-foreground mt-2 text-center text-xs">
              Already hiring with us?{" "}
              <Link
                href={`/auth/signin?callbackUrl=${encodeURIComponent(`/dashboard/search/${publicRef}`)}`}
                className="text-primary font-semibold"
              >
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <p className="bg-page text-muted-foreground mt-4 rounded-xl p-3 text-center text-[13px]">
            Only company accounts can unlock CVs.
          </p>
        )}
      </div>
    </aside>
  );
};
