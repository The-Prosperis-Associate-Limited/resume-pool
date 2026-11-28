import { Suspense } from "react";
import { CompanyDetailsForm } from "@/components/auth/company-details-form";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CompanyDetailsForm />
    </Suspense>
  );
}
