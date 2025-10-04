import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

interface AppState {
  // Onboarding
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;

  // Sync status
  syncStatus: SyncStatus;
  setSyncStatus: (status: SyncStatus) => void;
  lastSyncTime: Date | null;
  setLastSyncTime: (time: Date | null) => void;

  // Online status
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Onboarding
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (seen) => set({ hasSeenOnboarding: seen }),

      // Sync status
      syncStatus: "idle",
      setSyncStatus: (status) => set({ syncStatus: status }),
      lastSyncTime: null,
      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      // Online status
      isOnline: true,
      setIsOnline: (online) => set({ isOnline: online }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);

