"use client";

import { LayoutDashboard } from "lucide-react";
import { SurfaceShell, type NavSection } from "@/components/layout/surface-shell";

const SECTIONS: NavSection[] = [
  { label: "My profile", items: [{ label: "Overview", href: "/candidate", icon: LayoutDashboard }] },
];

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurfaceShell sections={SECTIONS} home="/candidate">
      {children}
    </SurfaceShell>
  );
}
