"use client";

import { PoolSearchArt } from "@/components/illustrations/empty-art";
import { SurfaceHome } from "@/components/layout/surface-home";

export default function ClientHomePage() {
  return (
    <SurfaceHome
      art={<PoolSearchArt />}
      greeting={(name) => `Welcome, ${name}`}
      lead="Your hiring workspace."
      emptyTitle="The pool opens soon"
      emptyDescription="Search, previews, plans and unlocks arrive in the coming phases."
    />
  );
}
