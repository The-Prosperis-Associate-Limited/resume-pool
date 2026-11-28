"use client";

import { LayoutDashboard } from "lucide-react";
import { SurfaceShell, type NavSection } from "@/components/layout/surface-shell";

const SECTIONS: NavSection[] = [
  { label: "Operations", items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurfaceShell sections={SECTIONS} home="/admin" tone="dark">
      {children}
    </SurfaceShell>
  );
}
