"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, FileWarning } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import { errorMessage } from "@/lib/handle-errors";
import { showToast } from "@/lib/show-toast";
import type { OwnProfile } from "@/types/candidate";
import type { APIResponse } from "@/types/response";

const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// DOCX html comes from the candidate's file, so it renders in a sandbox with no scripts and no same-origin access.
const paperHtml = (body: string) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>body{font:13px/1.6 system-ui,sans-serif;color:#1e293b;max-width:680px;margin:32px auto;padding:0 32px}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #e2e8f0;padding:4px 8px}</style></head><body>${body}</body></html>`;

interface Props {
  profileId: string;
  cv: NonNullable<OwnProfile["cv"]>;
}

export const CvViewer = function ({ profileId, cv }: Props) {
  const isPdf = cv.mime_type === "application/pdf";
  const isDocx = cv.mime_type === DOCX;
  const [downloading, setDownloading] = useState(false);

  const pdf = useQuery({
    queryKey: ["admin-cv", profileId, cv.updated_at],
    enabled: isPdf,
    staleTime: Infinity,
    queryFn: async () => (await api.get<Blob>(API_ENDPOINTS.admin.reviewCv(profileId), { responseType: "blob" })).data,
  });

  const html = useQuery({
    queryKey: ["admin-cv-html", profileId, cv.updated_at],
    enabled: isDocx,
    staleTime: Infinity,
    queryFn: async () =>
      (await api.get<APIResponse<{ html: string }>>(API_ENDPOINTS.admin.reviewCvHtml(profileId))).data.data.html,
  });

  const pdfUrl = useMemo(
    () => (pdf.data ? URL.createObjectURL(new Blob([pdf.data], { type: "application/pdf" })) : null),
    [pdf.data],
  );
  useEffect(() => () => void (pdfUrl && URL.revokeObjectURL(pdfUrl)), [pdfUrl]);

  const download = async () => {
    setDownloading(true);
    try {
      const { data } = await api.get<Blob>(`${API_ENDPOINTS.admin.reviewCv(profileId)}?download=1`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(data);
      const link = Object.assign(document.createElement("a"), { href: url, download: cv.file_name });
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast("error", errorMessage(error as Error));
    } finally {
      setDownloading(false);
    }
  };

  const failed = pdf.isError || html.isError;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 text-sm">
          <b className="break-all">{cv.file_name}</b>
          <span className="text-muted-foreground">
            {" "}
            · {cv.source === "BUILT" ? "Built from the profile" : "Uploaded"}
            {cv.pages ? ` · ${cv.pages} page${cv.pages === 1 ? "" : "s"}` : ""}
          </span>
        </p>
        <Button variant="outline" size="sm" className="rounded-lg" isLoading={downloading} onClick={download}>
          <Download /> Download
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl bg-[#eceff3]">
        {isPdf && pdfUrl && <iframe title="Candidate CV" src={pdfUrl} className="h-[78vh] w-full" />}
        {isDocx && html.data && (
          <iframe title="Candidate CV" sandbox="" srcDoc={paperHtml(html.data)} className="h-[78vh] w-full bg-white" />
        )}
        {(isPdf || isDocx) && !failed && !pdfUrl && !html.data && <Skeleton className="h-[78vh] rounded-none" />}
        {(failed || (!isPdf && !isDocx)) && (
          <div className="grid h-60 place-items-center p-6 text-center text-sm">
            <div className="grid justify-items-center gap-2">
              <FileWarning className="text-muted-foreground size-7" />
              <p className="font-semibold">
                {failed ? "The CV couldn't be loaded." : "Old Word (.doc) files can't be previewed here."}
              </p>
              <p className="text-muted-foreground">Download it to read it in Word.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
