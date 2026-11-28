import { Suspense } from "react";
import { SigninForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SigninForm surface="main" />
    </Suspense>
  );
}
