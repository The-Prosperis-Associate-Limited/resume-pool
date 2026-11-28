"use client";

import { Briefcase, Clock, Eye, Lock, MapPin, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { AnonAvatar } from "@/components/illustrations/anon-avatar";
import { StatusBadge } from "@/components/shared/status-badge";
import { AVAILABILITY_LABELS, formatNaira, formatYears } from "@/lib/onboarding";
import { SPRING } from "@/lib/motion";
import type { CandidateProfileStatus } from "@/types/auth";
import type { CandidatePreview } from "@/types/candidate";

interface Props {
  preview: CandidatePreview;
  status?: CandidateProfileStatus;
  showHiddenList?: boolean;
}

const SKILL_LIMIT = 4;

export const CandidatePreviewCard = function ({ preview, status, showHiddenList = true }: Props) {
  const location = [preview.location.city, preview.location.state].filter(Boolean).join(", ");
  const extra = preview.skills.length - SKILL_LIMIT;

  return (
    <motion.div layout transition={SPRING} className="rounded-2xl border bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <AnonAvatar className="size-11" />
        {status && <StatusBadge status={status} />}
      </div>
      <p className="mt-4 text-base font-bold">
        {preview.headline || preview.target_roles[0] || <span className="text-faint">Your headline</span>}
      </p>
      <p className="text-muted-foreground text-sm">
        {[preview.certifications[0], preview.qualifications[0]?.qualification].filter(Boolean).join(" · ") ||
          "Qualifications appear here"}
      </p>
      <ul className="text-ink-2 [&_svg]:text-faint my-3.5 grid gap-1.5 text-[13px] [&_li]:flex [&_li]:items-center [&_li]:gap-2 [&_svg]:size-3.5">
        <li>
          <Briefcase />
          {preview.roles.length ? `${formatYears(preview.months_experience)} experience` : "Experience appears here"}
        </li>
        <li>
          <MapPin />
          {location || "Location"}
          {preview.location.open_to_relocate && " · open to relocate"}
        </li>
        <li>
          <Wallet />
          {preview.salary
            ? `${formatNaira(preview.salary.min)} – ${formatNaira(preview.salary.max)} / month`
            : "Expected salary"}
        </li>
        <li>
          <Clock />
          {preview.availability
            ? `Available ${AVAILABILITY_LABELS[preview.availability].toLowerCase()}`
            : "Availability"}
        </li>
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {preview.skills.slice(0, SKILL_LIMIT).map((skill) => (
          <span key={skill} className="bg-page text-ink-2 rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {skill}
          </span>
        ))}
        {extra > 0 && (
          <span className="bg-page text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs font-medium">
            +{extra}
          </span>
        )}
      </div>
      {showHiddenList && (
        <div className="bg-page text-muted-foreground mt-4 grid gap-1.5 rounded-xl p-3 text-[12.5px] [&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_svg]:size-3.5">
          <b className="text-ink-2">Hidden until unlocked</b>
          <span>
            <Lock /> Your name &amp; photo
          </span>
          <span>
            <Lock /> Phone &amp; email
          </span>
          <span>
            <Lock /> Employer names
          </span>
          <span>
            <Lock /> CV file
          </span>
        </div>
      )}
    </motion.div>
  );
};

export const PreviewLabel = function () {
  return (
    <p className="text-muted-foreground mb-2.5 flex items-center gap-1.5 text-xs font-bold tracking-[0.06em] uppercase">
      <Eye className="size-3.5" /> How employers see you
    </p>
  );
};
