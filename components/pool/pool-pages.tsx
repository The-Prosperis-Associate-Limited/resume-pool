"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PoolPreview } from "./pool-preview";
import { PoolSearch } from "./pool-search";

const Loading = () => <Skeleton className="h-[60vh] rounded-2xl" />;

export const PoolSearchPage = function ({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{lead}</p>
      </div>
      <Suspense fallback={<Loading />}>
        <PoolSearch />
      </Suspense>
    </div>
  );
};

const Preview = function ({ basePath }: { basePath: string }) {
  const { ref } = useParams<{ ref: string }>();
  return <PoolPreview key={ref} publicRef={decodeURIComponent(ref)} basePath={basePath} />;
};

export const PoolPreviewPage = function ({ basePath }: { basePath: string }) {
  return (
    <Suspense fallback={<Loading />}>
      <Preview basePath={basePath} />
    </Suspense>
  );
};
