"use client";

import {
  Bell,
  Check,
  Eye,
  EyeOff,
  FileSearch,
  KeyRound,
  LockKeyhole,
  Pencil,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AnonAvatar } from "@/components/illustrations/anon-avatar";
import { fadeUp, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type AuthArtKey = "signin" | "signup-candidate" | "signup-client" | "verify" | "reset" | "company" | "admin";

interface ArtCopy {
  title: string;
  body: string;
}

const COPY: Record<AuthArtKey, ArtCopy> = {
  signin: {
    title: "Reviewed CVs. Real people. Ready to talk.",
    body: "Every profile in the pool has been checked by a Prosperis reviewer before an employer ever sees it.",
  },
  "signup-candidate": {
    title: "Your next job can find you.",
    body: "List your CV once. We review it, then employers across Nigeria can discover you without you applying to a single posting.",
  },
  "signup-client": {
    title: "Skip the job post. Start with the shortlist.",
    body: "Search reviewed candidates by role, skills, location and salary, then unlock only the CVs you want to act on.",
  },
  verify: {
    title: "One quick check, then your profile.",
    body: "Verifying your email proves the inbox is yours. Employers reply to it, so it has to work.",
  },
  reset: {
    title: "Back in, in a minute.",
    body: "Choose a new password and we'll sign you out everywhere else, so only you stay signed in.",
  },
  company: {
    title: "One last detail before you browse.",
    body: "Candidates see which company unlocked their CV, so we need to know who you are.",
  },
  admin: {
    title: "Keep the pool worth paying for.",
    body: "Review CVs, handle reports and keep an eye on unusual activity. Admin accounts are created by Prosperis.",
  },
};

interface CardProps {
  icon: LucideIcon;
  title: string;
  sub: string;
  tag?: string;
  anon?: boolean;
  float?: number;
  className?: string;
}

const ArtCard = function ({ icon: Icon, title, sub, tag, anon, float, className }: CardProps) {
  return (
    <motion.div variants={fadeUp} className={className}>
      <motion.div
        animate={
          float === undefined
            ? undefined
            : { y: [0, -5, 0], transition: { duration: 5, delay: float, repeat: Infinity, ease: "easeInOut" } }
        }
        className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3.5 backdrop-blur-sm"
      >
        {anon ? (
          <AnonAvatar tone="dark" className="size-9 shrink-0" />
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/14">
            <Icon className="size-4" />
          </span>
        )}
        <div className="min-w-0">
          <div className="text-sm font-bold">{title}</div>
          <div className="text-art-muted text-[12.5px]">{sub}</div>
        </div>
        {tag && (
          <span className="bg-art-glow/18 text-art-mint ml-auto rounded-full px-2.5 py-0.5 text-[11.5px] font-bold">
            {tag}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};

const Footnote = function ({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <p className="text-art-muted flex items-center gap-2 text-sm">
      <Icon className="size-4 shrink-0" />
      {children}
    </p>
  );
};

const VERIFY_STEPS = [
  { label: "Create account", state: "done" },
  { label: "Verify email", state: "current" },
  { label: "Build profile & upload CV", state: "upcoming" },
  { label: "Submit for review", state: "upcoming" },
] as const;

const Middle = function ({ art }: { art: AuthArtKey }) {
  if (art === "signin") {
    return (
      <>
        <motion.div variants={stagger(0.09)} className="my-10 grid max-w-[420px] gap-3">
          <ArtCard
            icon={UserRound}
            anon
            title="Backend Engineer · 5 yrs"
            sub="Yaba, Lagos · Node, PostgreSQL"
            tag="Live"
            float={0}
          />
          <ArtCard
            icon={UserRound}
            anon
            float={1.2}
            title="HR Generalist · 4 yrs"
            sub="Wuse, Abuja · CIPM"
            tag="Live"
            className="ml-9"
          />
          <ArtCard
            icon={UserRound}
            anon
            float={2.4}
            title="Sales Manager · 9 yrs"
            sub="Port Harcourt · FMCG"
            tag="Live"
          />
        </motion.div>
        <motion.figure
          variants={fadeUp}
          className="max-w-[460px] rounded-2xl border border-white/15 bg-white/8 p-5.5 backdrop-blur-sm"
        >
          <blockquote className="text-[15.5px] leading-relaxed">
            &ldquo;We filled two finance roles in a week. The CVs were what the previews said they&rsquo;d be, and every
            number we called picked up.&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-2.5 text-[13px]">
            <span className="bg-highlight grid size-8 place-items-center rounded-full text-xs font-bold text-white">
              TB
            </span>
            <span>
              <b className="block text-sm">Tolu Bamidele</b>
              <span className="text-art-muted">Head of People, Kestrel Logistics</span>
            </span>
          </figcaption>
        </motion.figure>
      </>
    );
  }

  if (art === "verify") {
    return (
      <motion.div
        variants={fadeUp}
        className="my-10 max-w-[420px] rounded-2xl border border-white/15 bg-white/8 p-5.5 backdrop-blur-sm"
      >
        <div className="text-art-mint text-sm font-bold tracking-wider uppercase">What&rsquo;s next</div>
        <motion.ol variants={stagger(0.08, 0.1)} className="mt-4 grid gap-3.5">
          {VERIFY_STEPS.map((step, index) => (
            <motion.li
              key={step.label}
              variants={fadeUp}
              className={cn("flex items-center gap-3", step.state === "upcoming" && "opacity-70")}
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full text-xs font-bold",
                  step.state === "done" && "bg-art-glow text-brand-900",
                  step.state === "current" && "text-brand-900 bg-white",
                  step.state === "upcoming" && "bg-white/14",
                )}
              >
                {step.state === "done" ? <Check className="size-4" /> : index + 1}
              </span>
              {step.state === "current" ? <b>{step.label}</b> : <span>{step.label}</span>}
            </motion.li>
          ))}
        </motion.ol>
      </motion.div>
    );
  }

  const cards: Record<Exclude<AuthArtKey, "signin" | "verify">, CardProps[]> = {
    "signup-candidate": [
      { icon: Pencil, title: "Build your profile", sub: "About 10 minutes, 8 short steps" },
      { icon: ShieldCheck, title: "We review it within 48 hours", sub: "You'll know exactly what to fix, if anything" },
      { icon: Bell, title: "Know who unlocked your CV", sub: "So you know whose call to expect" },
    ],
    "signup-client": [
      { icon: FileSearch, title: "Browse for free", sub: "Role, skills, experience, location and salary band" },
      { icon: ShieldCheck, title: "Every CV reviewed first", sub: "A Prosperis reviewer checks each profile" },
      { icon: KeyRound, title: "Unlock only who you want", sub: "Full CV, name and contact details" },
    ],
    reset: [
      { icon: KeyRound, title: "Codes and links are single-use", sub: "Requesting a new one cancels the old one" },
      { icon: LockKeyhole, title: "Other devices are signed out", sub: "The moment your new password is saved" },
    ],
    company: [
      { icon: Eye, title: "Candidates see your company name", sub: "When you unlock their CV" },
      {
        icon: ShieldCheck,
        title: "Your phone stays with Prosperis",
        sub: "We use it if there's a problem with your account",
      },
    ],
    admin: [
      { icon: FileSearch, title: "CV review queue", sub: "Oldest first, profile and CV side by side" },
      { icon: ShieldCheck, title: "Reports and abuse watch", sub: "Pause, remove or suspend with a reason" },
      { icon: Users, title: "Clients and subscriptions", sub: "Plans, payments and unlock quotas" },
    ],
  };

  return (
    <motion.div variants={stagger(0.09)} className="my-10 grid max-w-[420px] gap-3">
      {cards[art].map((card) => (
        <ArtCard key={card.title} {...card} />
      ))}
    </motion.div>
  );
};

const FOOTNOTE: Partial<Record<AuthArtKey, { icon: LucideIcon; text: string }>> = {
  "signup-candidate": {
    icon: EyeOff,
    text: "Your name and contacts stay hidden until a paying employer unlocks your CV.",
  },
  "signup-client": { icon: EyeOff, text: "Previews never show a name, employer or contact details." },
  verify: { icon: ShieldCheck, text: "Codes are single-use. Requesting a new one cancels the old one." },
};

// Keyed on the art, so switching role on sign-up crossfades the panel instead of snapping.
export const AuthArt = function ({ art }: { art: AuthArtKey }) {
  const copy = COPY[art];
  const footnote = FOOTNOTE[art];

  return (
    <aside className="auth-art relative isolate m-3 hidden overflow-hidden rounded-3xl p-12 text-white lg:block">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={art}
          variants={stagger(0.08, 0.05)}
          initial="hidden"
          animate="show"
          exit="exit"
          className="relative flex h-full flex-col justify-between"
        >
          <div>
            <motion.h2
              variants={fadeUp}
              className="max-w-[460px] text-[34px] leading-[1.15] font-extrabold tracking-tight"
            >
              {copy.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-art-muted mt-3 max-w-[440px]">
              {copy.body}
            </motion.p>
          </div>
          <Middle art={art} />
          <motion.div variants={fadeUp}>
            {footnote && <Footnote icon={footnote.icon}>{footnote.text}</Footnote>}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
};
