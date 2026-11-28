"use client";

import { Info } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCountdown, useCountdown } from "@/hooks/use-countdown";
import { EASE_OUT, fadeUp } from "@/lib/motion";
import { OtpInput } from "./otp-input";

interface Props {
  codeSentAt: number | null;
  onVerify: (code: string) => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
  submitLabel: string;
  failures?: number;
  secondaryAction?: React.ReactNode;
  footnote?: React.ReactNode;
}

export const RESEND_SECONDS = 60;

export const CodeStep = function ({
  codeSentAt,
  onVerify,
  onResend,
  isVerifying,
  isResending,
  submitLabel,
  failures = 0,
  secondaryAction,
  footnote,
}: Props) {
  const [code, setCode] = useState("");
  const [seenFailures, setSeenFailures] = useState(failures);
  const remaining = useCountdown(codeSentAt, RESEND_SECONDS);

  // A rejected code empties the boxes, so the next attempt starts clean.
  if (failures !== seenFailures) {
    setSeenFailures(failures);
    setCode("");
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (code.length === 6) onVerify(code);
      }}
    >
      <OtpInput
        value={code}
        onChange={setCode}
        onComplete={onVerify}
        disabled={isVerifying}
        failures={failures}
        invalid={failures > 0 && code.length === 0}
      />

      <Button
        type="submit"
        isLoading={isVerifying}
        disabled={code.length !== 6}
        className="mt-4 h-12 w-full rounded-xl text-[15px] font-semibold"
      >
        {submitLabel}
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">
          Didn&rsquo;t get it?{" "}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={remaining > 0 ? "wait" : "ready"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              {remaining > 0 ? (
                <span className="text-faint tabular-nums">Resend code in {formatCountdown(remaining)}</span>
              ) : (
                <button
                  type="button"
                  onClick={onResend}
                  disabled={isResending}
                  className="text-primary font-semibold hover:underline disabled:opacity-60"
                >
                  {isResending ? "Sending…" : "Resend code"}
                </button>
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        {secondaryAction}
      </div>

      {footnote && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
          className="bg-brand-50 border-brand-600/20 mt-4 flex items-start gap-3 rounded-xl border p-3.5"
        >
          <span className="grid size-7.5 shrink-0 place-items-center rounded-full bg-white">
            <Info className="text-primary size-4" />
          </span>
          <p className="text-ink-2 text-[13px]">{footnote}</p>
        </motion.div>
      )}
    </form>
  );
};
