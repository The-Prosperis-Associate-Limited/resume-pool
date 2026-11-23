import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { toast } from "sonner";

type ToastType = "error" | "success" | "warning" | "info" | "loading";

const toastConfig: Record<ToastType, { icon: ReactNode; style: CSSProperties }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    style: { background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46" },
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    style: { background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" },
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    style: { background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E" },
  },
  info: {
    icon: <Info className="h-5 w-5 text-sky-600" />,
    style: { background: "#F0F9FF", border: "1px solid #BAE6FD", color: "#075985" },
  },
  loading: {
    icon: <Loader2 className="h-5 w-5 animate-spin text-gray-500" />,
    style: { background: "#F9FAFB", border: "1px solid #E5E7EB", color: "#374151" },
  },
};

export const showToast = (type: ToastType, message: string) => {
  toast.dismiss();
  const { icon, style } = toastConfig[type];
  toast[type](message, { icon, style });
};
