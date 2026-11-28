"use client";

import { Camera, Loader2, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSubmitData } from "@/hooks/use-submit-data";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { popIn } from "@/lib/motion";
import { showToast } from "@/lib/show-toast";
import type { OnboardingOptions } from "@/types/candidate";

interface Props {
  photoUrl: string | null;
  standards?: OnboardingOptions["standards"]["photo"];
}

export const PhotoField = function ({ photoUrl, standards }: Props) {
  const input = useRef<HTMLInputElement>(null);

  const upload = useSubmitData<FormData>({ url: API_ENDPOINTS.candidate.photo, onSuccessMessage: "Photo uploaded" });
  const remove = useSubmitData<void>({
    url: API_ENDPOINTS.candidate.photo,
    method: "delete",
    onSuccessMessage: "Photo removed",
  });
  const busy = upload.isPending || remove.isPending;

  const choose = (file: File | undefined) => {
    if (!file) return;
    if (standards && !standards.mimeTypes.includes(file.type))
      return showToast("error", "Use a JPG, PNG or WebP photo");
    if (standards && file.size > standards.maxBytes) return showToast("error", "That photo is over 5 MB");
    const form = new FormData();
    form.append("file", file);
    upload.mutate(form);
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border p-4">
      <div className="bg-brand-50 relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          {photoUrl ? (
            <motion.img
              key={photoUrl}
              variants={popIn}
              initial="hidden"
              animate="show"
              exit="exit"
              src={photoUrl}
              alt="Your profile photo"
              className="size-full object-cover"
            />
          ) : (
            <motion.span key="empty" variants={popIn} initial="hidden" animate="show" exit="exit">
              <Camera className="text-primary size-7" />
            </motion.span>
          )}
        </AnimatePresence>
        {busy && (
          <span className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="text-primary size-5 animate-spin" />
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">Profile photo</p>
        <p className="text-muted-foreground text-[13px]">
          A clear photo of your face, at least {standards?.minWidth ?? 400}×{standards?.minHeight ?? 400}. Only
          companies that unlock your CV see it.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <input
            ref={input}
            type="file"
            accept={standards?.mimeTypes.join(",") ?? "image/*"}
            className="sr-only"
            onChange={(event) => {
              choose(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {photoUrl ? "Replace photo" : "Upload photo"}
          </Button>
          {photoUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground rounded-lg"
              disabled={busy}
              onClick={() => remove.mutate()}
            >
              <Trash2 /> Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
