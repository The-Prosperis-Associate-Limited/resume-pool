"use client";

import { FileCheck2, LayoutDashboard } from "lucide-react";
import { SurfaceShell, type NavSection } from "@/components/layout/surface-shell";
import { useReviewSummary } from "@/hooks/use-review-summary";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const summary = useReviewSummary();

  const sections: NavSection[] = [
    {
      label: "Operations",
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "CV review", href: "/admin/reviews", icon: FileCheck2, count: summary?.waiting },
      ],
    },
  ];

  return (
    <SurfaceShell sections={sections} home="/admin" tone="dark">
      {children}
    </SurfaceShell>
  );
}
