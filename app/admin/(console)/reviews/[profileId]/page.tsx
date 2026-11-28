"use client";

import { useParams } from "next/navigation";
import { ReviewWorkspace } from "@/components/admin/review-workspace";

export default function ReviewProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();

  return <ReviewWorkspace key={profileId} profileId={profileId} />;
}
