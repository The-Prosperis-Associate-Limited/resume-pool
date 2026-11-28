"use client";

import { Loader2, UploadCloud } from "lucide-react";
import { motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Props {
  accept: string[];
  maxBytes: number;
  title: React.ReactNode;
  hint: React.ReactNode;
  onFile: (file: File) => void;
  onReject: (message: string) => void;
  isUploading?: boolean;
  className?: string;
}

export const AppDropzone = function ({
  accept,
  maxBytes,
  title,
  hint,
  onFile,
  onReject,
  isUploading,
  className,
}: Props) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const take = (file: File | undefined) => {
    if (!file || isUploading) return;
    if (!accept.includes(file.type)) return onReject("That file type isn't accepted here");
    if (file.size > maxBytes) return onReject(`That file is over ${Math.round(maxBytes / 1024 / 1024)} MB`);
    onFile(file);
  };

  return (
    <motion.label
      htmlFor={id}
      animate={{ scale: dragging ? 1.01 : 1 }}
      transition={SPRING}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        take(event.dataTransfer.files[0]);
      }}
      className={cn(
        "to-page grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed bg-gradient-to-b from-white px-6 py-9 text-center transition-colors",
        dragging ? "border-primary bg-brand-50" : "border-border hover:border-brand-600 hover:bg-brand-50/60",
        isUploading && "pointer-events-none opacity-70",
        className,
      )}
    >
      <input
        ref={input}
        id={id}
        type="file"
        accept={accept.join(",")}
        className="sr-only"
        onChange={(event) => {
          take(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <span className="text-primary mb-3.5 grid size-14 place-items-center rounded-2xl border bg-white shadow-xs">
        {isUploading ? <Loader2 className="size-6 animate-spin" /> : <UploadCloud className="size-6" />}
      </span>
      <span className="font-semibold">{isUploading ? "Uploading…" : title}</span>
      <span className="text-muted-foreground mt-1.5 text-sm">{hint}</span>
    </motion.label>
  );
};
