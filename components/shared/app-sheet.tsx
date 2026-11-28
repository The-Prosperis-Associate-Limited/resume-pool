import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  side?: "top" | "right" | "bottom" | "left";
  sheetFooter?: React.ReactNode;
  width?: string;
  hideHeader?: boolean;
  contentClassName?: string;
  bodyClassName?: string;
}

export const AppSheet = function ({
  isOpen,
  onOpenChange,
  children,
  title,
  description,
  side = "right",
  sheetFooter,
  width,
  hideHeader,
  contentClassName,
  bodyClassName,
}: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn("flex flex-col gap-0 p-0", side === "bottom" && "h-auto max-h-[85vh]", contentClassName)}
        style={width ? { width, maxWidth: "100vw" } : undefined}
      >
        <SheetHeader className={cn("border-b px-6 py-4", hideHeader && "sr-only")}>
          <SheetTitle className="truncate">{title}</SheetTitle>
          {description && <SheetDescription className="truncate">{description}</SheetDescription>}
        </SheetHeader>

        <div className={cn("min-h-0 flex-1 overflow-y-auto", bodyClassName)}>{children}</div>

        {sheetFooter && <SheetFooter className="border-t px-6 py-4">{sheetFooter}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
};
