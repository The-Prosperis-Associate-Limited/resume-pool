"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PoolSearchArt } from "@/components/illustrations/empty-art";
import { SurfaceHome } from "@/components/layout/surface-home";
import { Button } from "@/components/ui/button";

export default function ClientHomePage() {
  return (
    <SurfaceHome
      art={<PoolSearchArt />}
      greeting={(name) => `Welcome, ${name}`}
      lead="Your hiring workspace."
      emptyTitle="Find your next hire"
      emptyDescription="Search reviewed, anonymised profiles by role, skills, experience and salary. Plans and unlocks open shortly."
      emptyAction={
        <Button asChild className="rounded-xl">
          <Link href="/dashboard/search">
            Search talent <ArrowRight />
          </Link>
        </Button>
      }
    />
  );
}
