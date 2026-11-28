import { ReviewQueueArt } from "@/components/illustrations/empty-art";
import { EmptyState } from "@/components/shared/empty-state";

export default function ReviewsIndexPage() {
  return (
    <div className="grid h-[calc(100dvh-4rem)] place-items-center rounded-2xl border bg-white">
      <EmptyState
        art={<ReviewQueueArt className="size-28" />}
        title="Pick a profile from the queue"
        description="Open the oldest first. You'll see the CV, the profile and the submit checks side by side."
        className="border-0"
      />
    </div>
  );
}
