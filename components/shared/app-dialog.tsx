"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrimaryAction {
  label: string;
  onClick?: () => void;
  form?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  primaryAction?: PrimaryAction;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export const AppDialog = function ({
  isOpen,
  onOpenChange,
  children,
  title,
  description,
  primaryAction,
  cancelLabel = "Cancel",
  isSubmitting,
}: Props) {
  const handleOpenChange = (open: boolean) => {
    if (!open && isSubmitting) return;
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-md">
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle className="text-[15px] font-bold">{title}</DialogTitle>
          {description && <DialogDescription className="text-[13px]">{description}</DialogDescription>}
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {primaryAction && (
          <DialogFooter className="bg-page border-t px-5 py-3.5">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl px-5"
            >
              {cancelLabel}
            </Button>
            <Button
              type={primaryAction.form ? "submit" : "button"}
              form={primaryAction.form}
              onClick={primaryAction.onClick}
              isLoading={primaryAction.isLoading}
              disabled={primaryAction.disabled}
              className="h-10 rounded-xl px-5"
            >
              {primaryAction.label}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
