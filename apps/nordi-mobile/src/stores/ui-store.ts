import { create } from "zustand";
import type { AuthStatus } from "@/auth/types";

interface AuthUiState {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthUiState>((set) => ({
  status: "signed_out",
  setStatus: (status) => set({ status }),
}));

interface DashboardUiState {
  actionMessage: string | null;
  setActionMessage: (message: string | null) => void;
}

export const useDashboardUiStore = create<DashboardUiState>((set) => ({
  actionMessage: null,
  setActionMessage: (message) => set({ actionMessage: message }),
}));
