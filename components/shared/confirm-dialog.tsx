"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  icon?: LucideIcon;
  iconClassName?: string;
  confirmVariant?: "default" | "destructive";
}

export const ConfirmDialog = function ({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading = false,
  icon: Icon,
  iconClassName,
  confirmVariant = "default",
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && onOpenChange(open)}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader className="items-center text-center sm:text-center">
          {Icon && (
            <div className="bg-muted mb-2 grid size-14 place-items-center rounded-full">
              <Icon className={cn("size-7", iconClassName)} />
            </div>
          )}
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {description && <DialogDescription className="text-sm">{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="mt-2 flex-row justify-center gap-3 sm:justify-center">
          <Button
            variant="outline"
            className="h-10 flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} className="h-10 flex-1 rounded-xl" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
