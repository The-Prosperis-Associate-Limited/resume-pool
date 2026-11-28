import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="bg-card w-full max-w-xl rounded-2xl border p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="from-brand-600 to-brand-900 grid size-10 place-items-center rounded-xl bg-gradient-to-br text-white">
            <FileText className="size-5" />
          </span>
          <div>
            <p className="font-extrabold tracking-tight">Resume Pool</p>
            <p className="text-muted-foreground text-xs font-semibold">by Prosperis</p>
          </div>
          <Badge className="ml-auto" variant="secondary">
            Phase 1
          </Badge>
        </div>
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Foundation is in place.</h1>
        <p className="text-muted-foreground mt-3">
          Next.js, Tailwind, shadcn/ui, TanStack Query and the data hooks are wired up. The landing page is built in
          phase 9, from the mockup in <code className="font-mono text-sm">design/</code>.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/auth/signup">Create an account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
