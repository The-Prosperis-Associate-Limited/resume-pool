import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = { fast: 0.18, base: 0.32, slow: 0.55 } as const;

export const SPRING: Transition = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 };

export const SOFT_SPRING: Transition = { type: "spring", stiffness: 260, damping: 28 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, x: -24, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: SOFT_SPRING },
  exit: { opacity: 0, scale: 0.92, transition: { duration: DURATION.fast } },
};

export const stagger = (step = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren } },
  exit: { transition: { staggerChildren: step / 2, staggerDirection: -1 } },
});

export const shake = { x: [0, -10, 9, -6, 5, -2, 0], transition: { duration: 0.42, ease: "easeInOut" as const } };
