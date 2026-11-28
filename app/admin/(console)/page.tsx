"use client";

import { ReviewQueueArt } from "@/components/illustrations/empty-art";
import { SurfaceHome } from "@/components/layout/surface-home";

export default function AdminHomePage() {
  return (
    <SurfaceHome
      art={<ReviewQueueArt />}
      greeting={(name) => `Hello, ${name}`}
      lead="Prosperis admin console."
      emptyTitle="Nothing to review yet"
      emptyDescription="The CV review queue arrives in phase 3, reports and abuse watch in phase 8."
    />
  );
}
