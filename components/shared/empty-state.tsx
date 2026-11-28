"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
  icon?: LucideIcon;
  art?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = function ({ icon: Icon, art, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "grid place-items-center gap-3 rounded-2xl border border-dashed bg-white px-6 py-14 text-center",
        className,
      )}
    >
      {art ? (
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          {art}
        </motion.div>
      ) : (
        Icon && (
          <span className="bg-brand-50 text-primary grid size-12 place-items-center rounded-full">
            <Icon className="size-5.5" />
          </span>
        )
      )}
      <div>
        <p className="font-bold">{title}</p>
        {description && <p className="text-muted-foreground mx-auto mt-1 max-w-md text-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
};
