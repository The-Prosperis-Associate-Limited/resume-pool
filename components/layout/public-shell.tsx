"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useViewerRole } from "@/hooks/use-viewer-role";
import type { UserRole } from "@/types/auth";

const HOME: Record<UserRole, string> = { CANDIDATE: "/candidate", CLIENT: "/dashboard", ADMIN: "/admin" };

const HeaderActions = function () {
  const role = useViewerRole();

  if (role === undefined) return <Skeleton className="h-9 w-40 rounded-lg" />;

  if (role) {
    return (
      <Button asChild size="sm" className="rounded-lg">
        <Link href={HOME[role]}>My account</Link>
      </Button>
    );
  }

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="rounded-lg">
        <Link href="/auth/signin">Sign in</Link>
      </Button>
      <Button asChild size="sm" className="rounded-lg">
        <Link href="/auth/signup?role=client">Hire talent</Link>
      </Button>
    </>
  );
};

export const PublicShell = function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-page min-h-dvh">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Logo href="/" />
          <nav className="flex items-center gap-1.5">
            <HeaderActions />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
};
