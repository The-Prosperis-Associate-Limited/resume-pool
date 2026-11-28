import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UserRole } from "@/types/auth";

interface AuthFlowState {
  pendingEmail: string | null;
  pendingRole: UserRole | null;
  codeSentAt: number | null;
  startVerification: (email: string, role?: UserRole | null) => void;
  markCodeSent: () => void;
  clear: () => void;
}

// Session storage, so the address being verified survives a refresh but never outlives the tab.
export const useAuthFlow = create<AuthFlowState>()(
  persist(
    (set) => ({
      pendingEmail: null,
      pendingRole: null,
      codeSentAt: null,
      startVerification: (email, role = null) =>
        set({ pendingEmail: email, pendingRole: role, codeSentAt: Date.now() }),
      markCodeSent: () => set({ codeSentAt: Date.now() }),
      clear: () => set({ pendingEmail: null, pendingRole: null, codeSentAt: null }),
    }),
    { name: "rp-auth-flow", storage: createJSONStorage(() => sessionStorage) },
  ),
);
