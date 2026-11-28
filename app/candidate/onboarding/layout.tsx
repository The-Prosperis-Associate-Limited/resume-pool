import { Loader2 } from "lucide-react";
import { Suspense } from "react";

// useFieldArray mints ids with crypto.randomUUID while rendering, so the steps stream behind a boundary.
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="bg-page grid min-h-screen place-items-center">
          <Loader2 className="text-primary size-7 animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
