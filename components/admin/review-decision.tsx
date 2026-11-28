"use client";

import { Check, Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubmitData } from "@/hooks/use-submit-data";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { SPRING } from "@/lib/motion";
import { ONBOARDING_STEPS } from "@/lib/onboarding";
import { CHECKLIST_STEP, MIN_REASON_LENGTH } from "@/lib/review";
import { cn } from "@/lib/utils";
import type { ChecklistKey, ReviewDetail, ReviewQueueItem } from "@/types/admin";
import type { ReviewReason } from "@/types/candidate";
import type { PaginatedResponse } from "@/types/response";
import { Block } from "./review-facts";

interface DraftReason extends ReviewReason {
  id: number;
  source?: ChecklistKey;
}

const PLACEHOLDER: Record<ChecklistKey, string> = {
  real_person: "Your CV is a scan we can't read. Upload a PDF or Word file with selectable text.",
  contact_current: "The phone number on your CV doesn't match your profile. Update one so they match.",
  matches_cv:
    "Your profile says 8 years of experience, but your CV shows roles from 2020 onwards. Correct one so they match.",
  not_duplicate: "You already have a profile in Resume Pool. Contact support to merge them.",
};

let nextId = 1;

export const ReviewDecision = function ({ profileId, detail }: { profileId: string; detail: ReviewDetail }) {
  const router = useRouter();
  const [checklist, setChecklist] = useState<Record<ChecklistKey, boolean | null>>({
    real_person: null,
    contact_current: null,
    matches_cv: null,
    not_duplicate: detail.duplicates.length ? null : true,
  });
  const [reasons, setReasons] = useState<DraftReason[]>([]);
  const [note, setNote] = useState("");
  const pending = detail.profile.status === "PENDING";

  const mark = (key: ChecklistKey, value: boolean) => {
    setChecklist((current) => ({ ...current, [key]: value }));
    setReasons((current) => {
      if (value) return current.filter((reason) => reason.source !== key || reason.message.trim());
      if (current.some((reason) => reason.source === key)) return current;
      return [...current, { id: nextId++, step: CHECKLIST_STEP[key], message: "", source: key }];
    });
  };

  const goToNext = async () => {
    const { data } = await api.get<PaginatedResponse<ReviewQueueItem>>(`${API_ENDPOINTS.admin.reviews}?page=1&limit=1`);
    router.push(data.data[0] ? `/admin/reviews/${data.data[0].profile_id}` : "/admin/reviews");
  };

  const decide = useSubmitData<"APPROVED" | "REJECTED">({
    url: API_ENDPOINTS.admin.review(profileId),
    method: "patch",
    getBody: (decision) => ({
      decision,
      checklist: Object.fromEntries(Object.entries(checklist).map(([key, value]) => [key, value === true])),
      ...(decision === "REJECTED" && {
        reasons: reasons.map(({ step, message }) => ({ step, message: message.trim() })),
      }),
      internal_note: note.trim() || undefined,
    }),
    onSuccessMessage: "Decision saved",
    onSuccess: () => void goToNext(),
  });

  const allPassed =
    Object.values(checklist).every((value) => value === true) && detail.current_checks.failures.length === 0;
  const reasonsReady =
    reasons.length > 0 && reasons.every((reason) => reason.message.trim().length >= MIN_REASON_LENGTH);

  return (
    <>
      <Block title="Checklist">
        <div className="grid gap-1.5">
          {detail.checklist_items.map(({ key, label }) => (
            <div
              key={key}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-[13px]",
                checklist[key] === false && "border-red-200 bg-red-50/50",
              )}
            >
              <span className="flex-1">{label}</span>
              {([true, false] as const).map((value) => (
                <motion.button
                  key={String(value)}
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  transition={SPRING}
                  disabled={!pending}
                  aria-pressed={checklist[key] === value}
                  aria-label={`${label}: ${value ? "passes" : "fails"}`}
                  onClick={() => mark(key, value)}
                  className={cn(
                    "text-faint grid size-7 place-items-center rounded-lg border transition-colors",
                    checklist[key] === value && value && "border-emerald-200 bg-emerald-50 text-emerald-700",
                    checklist[key] === value && !value && "border-red-200 bg-red-50 text-red-600",
                  )}
                >
                  {value ? <Check className="size-4" /> : <X className="size-4" />}
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </Block>

      <Block title="Reasons the candidate will see">
        <AnimatePresence initial={false}>
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mb-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
                <div className="flex items-center gap-2">
                  <select
                    value={reason.step}
                    aria-label={`Step for reason ${index + 1}`}
                    onChange={(event) =>
                      setReasons((current) =>
                        current.map((entry) =>
                          entry.id === reason.id
                            ? { ...entry, step: event.target.value as ReviewReason["step"] }
                            : entry,
                        ),
                      )
                    }
                    className="h-8 flex-1 rounded-lg border bg-white px-2 text-[13px] font-semibold"
                  >
                    {ONBOARDING_STEPS.map((entry) => (
                      <option key={entry.step} value={entry.step}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove reason ${index + 1}`}
                    onClick={() => setReasons((current) => current.filter((entry) => entry.id !== reason.id))}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <textarea
                  value={reason.message}
                  rows={3}
                  maxLength={500}
                  aria-label={`Reason ${index + 1}`}
                  placeholder={
                    reason.source ? PLACEHOLDER[reason.source] : "Tell the candidate exactly what to change."
                  }
                  onChange={(event) =>
                    setReasons((current) =>
                      current.map((entry) =>
                        entry.id === reason.id ? { ...entry, message: event.target.value } : entry,
                      ),
                    )
                  }
                  className="mt-2 w-full resize-y rounded-lg border bg-white p-2 text-[13px] outline-none focus:border-red-300"
                />
                {reason.message.trim().length < MIN_REASON_LENGTH && (
                  <p className="text-[11.5px] text-red-700">
                    Write something they can act on ({MIN_REASON_LENGTH}+ characters).
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={!pending}
          onClick={() => setReasons((current) => [...current, { id: nextId++, step: "CV", message: "" }])}
        >
          <Plus /> Add a reason
        </Button>
      </Block>

      <Block title="Internal note" className="border-b-0">
        <textarea
          value={note}
          rows={2}
          maxLength={1000}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Only admins see this."
          aria-label="Internal note"
          disabled={!pending}
          className="bg-page w-full resize-y rounded-lg border p-2 text-[13px] outline-none"
        />
      </Block>

      <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t bg-white px-5 py-4">
        {pending ? (
          <>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-red-200 text-red-700 hover:bg-red-50"
              disabled={!reasonsReady || decide.isPending}
              isLoading={decide.isPending && decide.variables === "REJECTED"}
              onClick={() => decide.mutate("REJECTED")}
            >
              Reject
            </Button>
            <Button
              className="h-11 rounded-xl"
              disabled={!allPassed || reasons.length > 0 || decide.isPending}
              isLoading={decide.isPending && decide.variables === "APPROVED"}
              onClick={() => decide.mutate("APPROVED")}
            >
              Approve
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground col-span-2 text-center text-sm">
            This profile isn&apos;t waiting for review.
          </p>
        )}
      </div>
    </>
  );
};
