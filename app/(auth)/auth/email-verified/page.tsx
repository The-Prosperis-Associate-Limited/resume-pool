import { Suspense } from "react";
import { EmailVerifiedView } from "@/components/auth/email-verified-view";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <EmailVerifiedView />
    </Suspense>
  );
}
