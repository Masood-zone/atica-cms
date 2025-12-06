import { create } from "zustand";

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  syncProgress: number;
  lastSyncTime?: Date;
  pendingOperations: number;
  syncErrors: Record<string, string>;
}

interface SyncStore extends SyncStatus {
  setSyncStatus: (status: Partial<SyncStatus>) => void;
  addSyncError: (entity: string, error: string) => void;
  clearSyncError: (entity: string) => void;
  updatePendingOperations: (count: number) => void;
  updateSyncProgress: (progress: number) => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  isSyncing: false,
  syncProgress: 0,
  lastSyncTime: undefined,
  pendingOperations: 0,
  syncErrors: {},

  setSyncStatus: (status) => set((state) => ({ ...state, ...status })),

  addSyncError: (entity, error) =>
    set((state) => ({
      syncErrors: { ...state.syncErrors, [entity]: error },
    })),

  clearSyncError: (entity) =>
    set((state) => {
      const { [entity]: _, ...rest } = state.syncErrors;
      return { syncErrors: rest };
    }),

  updatePendingOperations: (count) => set({ pendingOperations: count }),
  updateSyncProgress: (progress) => set({ syncProgress: progress }),
}));
