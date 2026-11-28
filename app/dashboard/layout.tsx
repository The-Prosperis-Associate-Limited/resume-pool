"use client";

import { LayoutDashboard, Search } from "lucide-react";
import { SurfaceShell, type NavSection } from "@/components/layout/surface-shell";

const SECTIONS: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Search talent", href: "/dashboard/search", icon: Search },
    ],
  },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurfaceShell sections={SECTIONS} home="/dashboard">
      {children}
    </SurfaceShell>
  );
}
