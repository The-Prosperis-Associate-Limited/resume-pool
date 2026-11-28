"use client";

import { AnimatePresence, motion, type HTMLMotionProps, type Variants } from "motion/react";
import { fadeUp, stagger } from "@/lib/motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  variants?: Variants;
  delay?: number;
}

export const Reveal = function ({ variants = fadeUp, delay = 0, transition, ...props }: RevealProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={delay ? { delay, ...transition } : transition}
      {...props}
    />
  );
};

interface StaggerProps extends HTMLMotionProps<"div"> {
  step?: number;
  delay?: number;
}

export const Stagger = function ({ step, delay, ...props }: StaggerProps) {
  return <motion.div variants={stagger(step, delay)} initial="hidden" animate="show" exit="exit" {...props} />;
};

export const StaggerItem = function ({ variants = fadeUp, ...props }: HTMLMotionProps<"div">) {
  return <motion.div variants={variants} {...props} />;
};

interface SwapProps {
  swapKey: string;
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
}

// Crossfades between states (a form step, a role) so one never pops in over another.
export const Swap = function ({ swapKey, children, variants = fadeUp, className }: SwapProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={swapKey} variants={variants} initial="hidden" animate="show" exit="exit" className={className}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface CollapseProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Collapse = function ({ show, children, className }: CollapseProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
