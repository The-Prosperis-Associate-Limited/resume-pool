"use client";

import { ProfileBuilderArt } from "@/components/illustrations/empty-art";
import { SurfaceHome } from "@/components/layout/surface-home";

export default function CandidateHomePage() {
  return (
    <SurfaceHome
      art={<ProfileBuilderArt />}
      greeting={(name) => `Welcome, ${name}`}
      lead="Your profile isn't in the pool yet."
      emptyTitle="Profile builder coming next"
      emptyDescription="The 8 onboarding steps, CV upload and submit for review land here in the next phase."
    />
  );
}
