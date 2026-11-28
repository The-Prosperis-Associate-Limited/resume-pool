"use client";

import { LogOut, Menu, type LucideIcon } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Suspense, useState } from "react";
import { AppSheet } from "@/components/shared/app-sheet";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/hooks/use-session";
import { useSignOut } from "@/hooks/use-sign-out";
import { fadeUp, SPRING, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

interface Props {
  sections: NavSection[];
  home: string;
  tone?: "light" | "dark";
  children: React.ReactNode;
}

const sectionOf = (href: string, home: string) => (href === home ? null : href.slice(home.length + 1).split("/")[0]);

// The segment is runtime data on dynamic routes, so each reader sits in its own Suspense boundary.
const CurrentSegment = function ({ children }: { children: (segment: string | null) => React.ReactNode }) {
  return children(useSelectedLayoutSegment());
};

const initials = (first: string | null, last: string | null, email: string) =>
  ((first?.[0] ?? "") + (last?.[0] ?? "") || email[0]).toUpperCase();

const UserChip = function ({ tone, onSignOut }: { tone: "light" | "dark"; onSignOut: () => void }) {
  const { user } = useSession();
  const dark = tone === "dark";

  if (!user) return <Skeleton className={cn("h-13 rounded-xl", dark && "bg-white/10")} />;

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;
  const sub = user.client_account?.company?.name ?? user.email;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border p-2.5",
        dark ? "border-white/10 bg-white/5" : "bg-white",
      )}
    >
      <span className="bg-primary grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white">
        {initials(user.first_name, user.last_name, user.email)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{name}</p>
        <p className={cn("truncate text-xs", dark ? "text-white/60" : "text-muted-foreground")}>{sub}</p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Sign out"
        onClick={onSignOut}
        className={cn(dark && "text-white/70 hover:bg-white/10 hover:text-white")}
      >
        <LogOut />
      </Button>
    </motion.div>
  );
};

const Sidebar = function ({
  sections,
  home,
  tone,
  onNavigate,
  onSignOut,
  scope,
}: Omit<Props, "children"> & {
  tone: "light" | "dark";
  onNavigate?: () => void;
  onSignOut: () => void;
  scope: string;
}) {
  const dark = tone === "dark";

  const nav = (segment: string | null | undefined) => (
    <LayoutGroup id={scope}>
      <motion.nav
        variants={stagger(0.05, 0.05)}
        initial="hidden"
        animate="show"
        className="grid flex-1 content-start gap-5"
      >
        {sections.map((section) => (
          <motion.div key={section.label} variants={fadeUp} className="grid gap-1">
            <p
              className={cn(
                "px-3 text-[11px] font-bold tracking-wider uppercase",
                dark ? "text-white/45" : "text-faint",
              )}
            >
              {section.label}
            </p>
            {section.items.map(({ label, href, icon: Icon, count }) => {
              const active = sectionOf(href, home) === segment;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                    active
                      ? dark
                        ? "text-white"
                        : "text-primary"
                      : dark
                        ? "text-white/70 hover:bg-white/8"
                        : "text-ink-2 hover:bg-muted",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={SPRING}
                      className={cn("absolute inset-0 rounded-full", dark ? "bg-white/12" : "bg-brand-50")}
                    />
                  )}
                  <Icon className="relative size-4.5" />
                  <span className="relative flex-1">{label}</span>
                  {!!count && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={SPRING}
                      className={cn(
                        "relative min-w-6 rounded-full px-1.5 text-center text-[11px] leading-5 font-bold tabular-nums",
                        dark
                          ? active
                            ? "text-brand-900 bg-teal-300"
                            : "bg-white/10 text-white/90"
                          : "bg-brand-50 text-brand-700",
                      )}
                    >
                      {count}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </motion.div>
        ))}
      </motion.nav>
    </LayoutGroup>
  );

  return (
    <div className={cn("flex h-full flex-col gap-6 p-4", dark ? "bg-brand-900 text-white" : "bg-white")}>
      <Logo href={home} tone={tone} className="px-2 pt-1" />
      <Suspense fallback={nav(undefined)}>
        <CurrentSegment>{nav}</CurrentSegment>
      </Suspense>
      <UserChip tone={tone} onSignOut={onSignOut} />
    </div>
  );
};

export const SurfaceShell = function ({ sections, home, tone = "light", children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const { signOut, isSigningOut } = useSignOut();

  const askSignOut = () => {
    setMenuOpen(false);
    setConfirmSignOut(true);
  };

  return (
    <div className="bg-page min-h-dvh lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh border-r lg:block">
        <Sidebar sections={sections} home={home} tone={tone} onSignOut={askSignOut} scope="sidebar" />
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo href={home} />
        <Button variant="outline" size="icon" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu />
        </Button>
      </header>

      <AppSheet isOpen={menuOpen} onOpenChange={setMenuOpen} title="Menu" side="left" width="280px" hideHeader>
        <Sidebar
          sections={sections}
          home={home}
          tone={tone}
          onNavigate={() => setMenuOpen(false)}
          onSignOut={askSignOut}
          scope="drawer"
        />
      </AppSheet>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Suspense fallback={<Skeleton className="h-60 rounded-2xl" />}>
          <CurrentSegment>
            {(segment) => (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={segment ?? "home"} variants={fadeUp} initial="hidden" animate="show" exit="exit">
                  {children}
                </motion.div>
              </AnimatePresence>
            )}
          </CurrentSegment>
        </Suspense>
      </main>

      <ConfirmDialog
        isOpen={confirmSignOut}
        onOpenChange={setConfirmSignOut}
        title="Sign out?"
        description="You'll need your email and password, or Google, to sign back in."
        confirmLabel="Sign out"
        icon={LogOut}
        iconClassName="text-primary"
        onConfirm={signOut}
        isLoading={isSigningOut}
      />
    </div>
  );
};
