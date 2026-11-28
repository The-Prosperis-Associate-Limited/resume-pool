import Link from "next/link";
import { BrandMark } from "@/components/illustrations/brand-mark";
import { cn } from "@/lib/utils";

interface Props {
  href?: string;
  tone?: "light" | "dark";
  className?: string;
}

export const Logo = function ({ href = "/", tone = "light", className }: Props) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight", className)}
    >
      <BrandMark />
      <span className={cn("leading-tight", tone === "dark" && "text-white")}>
        Resume Pool
        <small
          className={cn(
            "-mt-0.5 block text-[11px] font-semibold tracking-wide",
            tone === "dark" ? "text-art-muted" : "text-muted-foreground",
          )}
        >
          by Prosperis
        </small>
      </span>
    </Link>
  );
};
