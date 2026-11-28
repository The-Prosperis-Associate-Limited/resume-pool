import { Suspense } from "react";
import { SigninForm } from "@/components/auth/signin-form";

export default function AdminSignInPage() {
  return (
    <Suspense fallback={null}>
      <SigninForm surface="admin" />
    </Suspense>
  );
}
