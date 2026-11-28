import { CheckCircle2, ChevronDown, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Collapse } from "@/components/motion/motion-primitives";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatNaira, formatYears, ONBOARDING_STEPS } from "@/lib/onboarding";
import { formatDay, REVIEW_KIND_LABELS } from "@/lib/review";
import { cn } from "@/lib/utils";
import type { ReviewDetail } from "@/types/admin";

export const Block = function ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b px-5 py-4", className)}>
      <h4 className="text-muted-foreground mb-3 text-xs font-bold tracking-[0.07em] uppercase">{title}</h4>
      {children}
    </div>
  );
};

const stepLabel = (step: string) => ONBOARDING_STEPS.find((entry) => entry.step === step)?.label ?? step;

export const ReviewFacts = function ({ detail }: { detail: ReviewDetail }) {
  const { profile, preview, account, current_checks, duplicates } = detail;
  const [showHistory, setShowHistory] = useState(false);
  const name = [profile.personal.first_name, profile.personal.last_name].filter(Boolean).join(" ");

  const facts: [string, React.ReactNode][] = [
    ["Reference", profile.public_ref],
    ["Headline", profile.headline.headline ?? "–"],
    [
      "Experience",
      profile.experience.has_no_experience ? "None yet" : `${formatYears(preview.months_experience)} (profile)`,
    ],
    [
      "Location",
      `${[profile.personal.city, profile.personal.state].filter(Boolean).join(", ")}${profile.preferences.open_to_relocate ? " · will relocate" : ""}`,
    ],
    [
      "Salary",
      profile.preferences.salary_min !== null
        ? `${formatNaira(profile.preferences.salary_min)}–${formatNaira(profile.preferences.salary_max ?? 0)}`
        : "–",
    ],
    ["Phone", profile.personal.phone_no ?? "–"],
  ];

  return (
    <>
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <span className="bg-brand-50 text-brand-700 grid size-12 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-bold">
          {profile.personal.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.personal.photo_url} alt={`${name}'s photo`} className="size-full object-cover" />
          ) : (
            name.slice(0, 2).toUpperCase()
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate font-bold">{name}</p>
          <p className="text-muted-foreground truncate text-xs">
            Joined {formatDay(account.joined_at)} · {account.email_verified ? "email verified" : "email not verified"}
          </p>
          <p className="text-muted-foreground truncate text-xs">{account.email}</p>
        </div>
      </div>

      <Block title="Candidate">
        <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-[13px]">
          {facts.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="break-words">{value}</dd>
            </div>
          ))}
          <dt className="text-muted-foreground">Duplicates</dt>
          <dd>
            {duplicates.length === 0 ? (
              "None found"
            ) : (
              <ul className="grid gap-1">
                {duplicates.map((entry) => (
                  <li key={entry.profile_id} className="text-red-700">
                    <Link
                      href={`/admin/reviews/${entry.profile_id}`}
                      className="font-semibold underline-offset-2 hover:underline"
                    >
                      {entry.public_ref}
                    </Link>{" "}
                    {entry.name} · same {entry.matched_on.join(" and ")} ·{" "}
                    <StatusBadge status={entry.status} className="align-middle" />
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </dl>
      </Block>

      <Block title="Submit checks (run now)">
        <ul className="grid gap-1.5 text-[13px]">
          {current_checks.failures.map((failure, index) => (
            <li key={`f-${index}`} className="flex gap-2 text-red-700">
              <XCircle className="mt-0.5 size-4 shrink-0" />
              <span>
                <b>{stepLabel(failure.step)}:</b> {failure.message}
              </span>
            </li>
          ))}
          {current_checks.passed.map((check) => (
            <li key={check.key} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <span>
                <b>{check.label}</b> <span className="text-muted-foreground">· {check.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </Block>

      {(detail.previous_reviews.length > 0 || detail.history.length > 0) && (
        <Block title="History">
          <button
            type="button"
            onClick={() => setShowHistory((value) => !value)}
            className="text-primary flex items-center gap-1 text-[13px] font-semibold"
            aria-expanded={showHistory}
          >
            {detail.previous_reviews.length} earlier review{detail.previous_reviews.length === 1 ? "" : "s"},{" "}
            {detail.history.length} status change{detail.history.length === 1 ? "" : "s"}
            <ChevronDown className={cn("size-4 transition-transform", showHistory && "rotate-180")} />
          </button>
          <Collapse show={showHistory}>
            <ul className="mt-3 grid gap-3 text-[13px]">
              {detail.previous_reviews.map((review) => (
                <li key={review.id} className="bg-page rounded-xl p-3">
                  <p className="font-semibold">
                    {review.decision === "APPROVED" ? "Approved" : "Rejected"} · {REVIEW_KIND_LABELS[review.kind]} ·{" "}
                    {formatDay(review.decided_at)}
                    {review.reviewer ? ` · ${review.reviewer}` : ""}
                  </p>
                  {review.reasons?.map((reason, index) => (
                    <p key={index} className="text-ink-2 mt-1">
                      <b>{stepLabel(reason.step)}:</b> {reason.message}
                    </p>
                  ))}
                  {review.internal_note && (
                    <p className="text-muted-foreground mt-1 italic">Note: {review.internal_note}</p>
                  )}
                </li>
              ))}
              {detail.history.map((event, index) => (
                <li key={index} className="text-muted-foreground">
                  {formatDay(event.at)} · {event.from.toLowerCase()} → {event.to.toLowerCase()} by {event.actor}
                  {event.reason ? ` · ${event.reason}` : ""}
                </li>
              ))}
            </ul>
          </Collapse>
        </Block>
      )}
    </>
  );
};
