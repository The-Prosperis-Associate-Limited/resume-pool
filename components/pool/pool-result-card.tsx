"use client";

import { Briefcase, Clock, Eye, MapPin, Unlock, Wallet } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { AnonAvatar } from "@/components/illustrations/anon-avatar";
import { Button } from "@/components/ui/button";
import { SPRING } from "@/lib/motion";
import { AVAILABILITY_LABELS, formatNaira, formatYears } from "@/lib/onboarding";
import { listedAgo } from "@/lib/pool";
import type { PoolCandidate } from "@/types/pool";

const SKILL_LIMIT = 3;

export const PoolResultCard = function ({ candidate, href }: { candidate: PoolCandidate; href: string }) {
  const place = [candidate.location.city, candidate.location.state].filter(Boolean).join(", ");
  const extra = candidate.skills.length - SKILL_LIMIT;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={SPRING}
      className="flex h-full flex-col gap-3.5 rounded-2xl border bg-white p-5 transition-shadow hover:shadow-[0_10px_30px_-12px_rgba(15,23,42,.18)]"
    >
      <div className="flex items-start gap-3">
        <AnonAvatar className="size-11 shrink-0" />
        <div className="min-w-0 flex-1">
          <Link href={href} className="line-clamp-2 leading-snug font-bold hover:underline">
            {candidate.headline ?? candidate.target_roles[0]}
          </Link>
          <p className="text-muted-foreground text-xs">
            {candidate.public_ref} · {listedAgo(candidate.listed_at)}
          </p>
        </div>
        {candidate.match !== null ? (
          <span className="bg-brand-50 text-brand-700 shrink-0 rounded-md px-2 py-0.5 text-xs font-bold tabular-nums">
            {candidate.match}% match
          </span>
        ) : (
          candidate.is_new && (
            <span className="bg-brand-50 text-brand-700 shrink-0 rounded-md px-2 py-0.5 text-xs font-bold">New</span>
          )
        )}
      </div>

      <ul className="text-ink-2 [&_svg]:text-faint flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13px] [&_li]:inline-flex [&_li]:items-center [&_li]:gap-1.5 [&_svg]:size-3.5">
        <li>
          <Briefcase /> {candidate.roles.length ? formatYears(candidate.months_experience) : "New to work"}
        </li>
        <li>
          <MapPin /> {place}
          {candidate.location.open_to_relocate && " · will relocate"}
        </li>
        {candidate.salary && (
          <li>
            <Wallet /> {formatNaira(candidate.salary.min)}–{formatNaira(candidate.salary.max)}
          </li>
        )}
        {candidate.availability && (
          <li>
            <Clock /> {AVAILABILITY_LABELS[candidate.availability]}
          </li>
        )}
      </ul>

      {candidate.summary && <p className="text-muted-foreground line-clamp-2 text-[13.5px]">{candidate.summary}</p>}

      <div className="flex flex-wrap gap-1.5">
        {candidate.skills.slice(0, SKILL_LIMIT).map((skill) => (
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

      <div className="mt-auto flex items-center gap-2 border-t pt-3.5">
        <Button asChild variant="outline" size="sm" className="rounded-lg">
          <Link href={href}>
            <Eye /> Preview
          </Link>
        </Button>
        <Button asChild size="sm" className="rounded-lg">
          <Link href={`${href}#unlock`}>
            <Unlock /> Unlock CV
          </Link>
        </Button>
      </div>
    </motion.article>
  );
};
