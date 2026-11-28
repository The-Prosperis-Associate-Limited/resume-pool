"use client";

import { CheckCircle2, Eye, Info, Sparkles, Upload, Wand2 } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepActions, StepHeader } from "@/components/onboarding/step-parts";
import { Swap } from "@/components/motion/motion-primitives";
import { AppDropzone } from "@/components/shared/app-dropzone";
import { Notice } from "@/components/shared/notice";
import { Button } from "@/components/ui/button";
import { useCandidateProfile, useOnboardingOptions } from "@/hooks/use-candidate-profile";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { SPRING } from "@/lib/motion";
import { formatBytes, nextPath, ONBOARDING_STEPS, REVIEW_PATH } from "@/lib/onboarding";
import { showToast } from "@/lib/show-toast";
import { cn } from "@/lib/utils";

type Mode = "upload" | "build";

const TIPS = [
  { ok: true, text: "Job titles and dates match your work experience step" },
  { ok: true, text: "Text is selectable, not a photo or scan of a page" },
  { ok: true, text: "Your phone and email on the CV are current" },
  { ok: false, text: "Replacing your CV later sends your profile back for review" },
];

const FILE_LABEL: Record<string, string> = { "application/pdf": "PDF", "application/msword": "DOC" };

export default function CvStepPage() {
  const router = useRouter();
  const { data } = useCandidateProfile();
  const options = useOnboardingOptions();
  const cv = data?.profile.cv ?? null;
  const [chosen, setChosen] = useState<Mode | null>(null);
  const mode: Mode = chosen ?? (cv?.source === "BUILT" ? "build" : "upload");

  const upload = useSubmitData<FormData>({ url: API_ENDPOINTS.candidate.cv, onSuccessMessage: "CV uploaded" });
  const build = useSubmitData<void>({ url: API_ENDPOINTS.candidate.buildCv, onSuccessMessage: "Your CV is ready" });

  const standards = options?.standards.cv;
  const next = () =>
    router.push(new URLSearchParams(window.location.search).get("from") === "review" ? REVIEW_PATH : nextPath("CV"));

  return (
    <OnboardingShell step="CV">
      <StepHeader
        step="CV"
        title="Add your CV"
        lead="Companies see your CV after they unlock your profile. Upload your own, or let us build a clean one from what you've told us."
      />

      <LayoutGroup>
        <div role="tablist" className="bg-page mb-6 grid grid-cols-2 gap-1 rounded-xl border p-1">
          {(["upload", "build"] as const).map((entry) => (
            <button
              key={entry}
              type="button"
              role="tab"
              aria-selected={mode === entry}
              onClick={() => setChosen(entry)}
              className={cn(
                "relative h-11 rounded-lg text-sm font-semibold transition-colors",
                mode === entry ? "text-brand-700" : "text-muted-foreground",
              )}
            >
              {mode === entry && (
                <motion.span
                  layoutId="cv-mode"
                  transition={SPRING}
                  className="absolute inset-0 rounded-lg bg-white shadow-xs"
                />
              )}
              <span className="relative inline-flex items-center gap-2">
                {entry === "upload" ? <Upload className="size-4" /> : <Wand2 className="size-4" />}
                {entry === "upload" ? "Upload my CV" : "Build one for me"}
              </span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <Swap swapKey={mode}>
        {mode === "upload" ? (
          <AppDropzone
            accept={standards?.mimeTypes ?? ["application/pdf"]}
            maxBytes={standards?.maxBytes ?? 5 * 1024 * 1024}
            title={
              <>
                Drop your CV here, or <span className="text-primary">browse</span>
              </>
            }
            hint={`PDF, DOC or DOCX · Max 5 MB · Up to ${standards?.maxPages ?? 6} pages`}
            isUploading={upload.isPending}
            onReject={(message) => showToast("error", message)}
            onFile={(file) => {
              const form = new FormData();
              form.append("file", file);
              upload.mutate(form);
            }}
          />
        ) : (
          <div className="bg-brand-50 border-brand-600/15 rounded-2xl border p-5 sm:p-6">
            <Sparkles className="text-primary size-6" />
            <p className="mt-3 font-bold">We&apos;ll lay out your CV from your profile</p>
            <p className="text-ink-2 mt-1 text-sm">
              Your name, contact details, experience, education, certifications, skills and languages, on a clean
              one-page design. It&apos;s rebuilt when you submit, so later edits are always included.
            </p>
            <Button
              type="button"
              className="mt-4 h-11 rounded-xl px-5"
              isLoading={build.isPending}
              onClick={() => build.mutate()}
            >
              <Wand2 /> {cv?.source === "BUILT" ? "Rebuild my CV" : "Build my CV"}
            </Button>
          </div>
        )}
      </Swap>

      <AnimatePresence>
        {cv && (
          <motion.div
            key={cv.updated_at}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={SPRING}
            className="mt-4 flex flex-wrap items-center gap-3.5 rounded-xl border p-3.5"
          >
            <span className="relative grid h-12 w-10.5 shrink-0 place-items-center rounded-lg bg-red-50 text-[10.5px] font-extrabold text-red-700">
              {FILE_LABEL[cv.mime_type] ?? (cv.mime_type.includes("word") ? "DOCX" : "FILE")}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className="text-sm break-all">{cv.file_name}</b>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="size-3.5" /> {cv.source === "BUILT" ? "Built" : "Uploaded"}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                {[cv.pages && `${cv.pages} page${cv.pages === 1 ? "" : "s"}`, formatBytes(cv.size_bytes)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <Button asChild variant="ghost" size="icon-sm" aria-label="Open your CV">
              <a href={cv.download_url} target="_blank" rel="noreferrer">
                <Eye />
              </a>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {TIPS.map((tip) => (
          <p key={tip.text} className="bg-page text-ink-2 flex gap-2.5 rounded-xl p-3 text-[13px]">
            {tip.ok ? (
              <CheckCircle2 className="text-primary mt-px size-4 shrink-0" />
            ) : (
              <Info className="mt-px size-4 shrink-0 text-amber-600" />
            )}
            {tip.text}
          </p>
        ))}
      </div>

      <Notice className="mt-4" tone="brand">
        We check the file type, size, page count and that the text can be read before it reaches our reviewers.
      </Notice>

      <StepActions backHref={ONBOARDING_STEPS[5].path} label="Continue to privacy" disabled={!cv} onClick={next} />
    </OnboardingShell>
  );
}
