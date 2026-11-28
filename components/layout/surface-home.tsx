"use client";

import { Stagger, StaggerItem } from "@/components/motion/motion-primitives";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";

interface Props {
  art: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: React.ReactNode;
  greeting: (firstName: string) => string;
  lead: string;
}

// Each surface's landing until its phase builds the real one.
export const SurfaceHome = function ({ art, emptyTitle, emptyDescription, emptyAction, greeting, lead }: Props) {
  const { user } = useSession();

  return (
    <Stagger step={0.08} className="mx-auto grid max-w-5xl gap-6">
      <StaggerItem>
        {user ? (
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">
            {greeting(user.first_name ?? "there")}
          </h1>
        ) : (
          <Skeleton className="h-8 w-64" />
        )}
        <p className="text-muted-foreground mt-1.5">{lead}</p>
      </StaggerItem>
      <StaggerItem>
        <EmptyState art={art} title={emptyTitle} description={emptyDescription} action={emptyAction} />
      </StaggerItem>
    </Stagger>
  );
};
