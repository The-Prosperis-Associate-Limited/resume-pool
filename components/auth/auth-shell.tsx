"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { fadeUp, popIn, stagger } from "@/lib/motion";
import { AuthArt, type AuthArtKey } from "./auth-art";

interface Props {
  children: React.ReactNode;
  art: AuthArtKey;
  topRight?: React.ReactNode;
  logoHref?: string;
}

export const AuthShell = function ({ children, art, topRight, logoHref = "/" }: Props) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex min-h-dvh flex-col px-4 py-6 sm:px-8 lg:px-12 lg:py-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center justify-between gap-3"
        >
          <Logo href={logoHref} />
          {topRight}
        </motion.div>

        <motion.main
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.05 }}
          className="mx-auto my-auto w-full max-w-[420px] py-10"
        >
          {children}
        </motion.main>

        <p className="text-muted-foreground text-center text-[13px]">
          © {new Date().getFullYear()} Prosperis ·{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </p>
      </div>
      <AuthArt art={art} />
    </div>
  );
};

interface HeadingProps {
  title: string;
  lead?: React.ReactNode;
  icon?: React.ReactNode;
}

export const AuthHeading = function ({ title, lead, icon }: HeadingProps) {
  return (
    <motion.div variants={stagger(0.07)} initial="hidden" animate="show" className="mb-7">
      {icon && (
        <motion.div variants={popIn} className="w-fit">
          {icon}
        </motion.div>
      )}
      <motion.h1 variants={fadeUp} className="text-[30px] leading-tight font-extrabold tracking-tight">
        {title}
      </motion.h1>
      {lead && (
        <motion.p variants={fadeUp} className="text-muted-foreground mt-2">
          {lead}
        </motion.p>
      )}
    </motion.div>
  );
};
