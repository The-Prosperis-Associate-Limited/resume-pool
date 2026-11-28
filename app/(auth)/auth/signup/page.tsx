import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
