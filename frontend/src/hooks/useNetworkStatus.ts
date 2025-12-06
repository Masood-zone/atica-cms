import { useEffect } from "react";
import { useSyncStore } from "@/store/syncStore";
import { syncAll } from "@/lib/sync/syncManager";

// Minimal network status effect using navigator.onLine
export function useNetworkStatus() {
  const setSyncStatus = useSyncStore((s) => s.setSyncStatus);

  useEffect(() => {
    const updateOnline = () => {
      const online = navigator.onLine;
      setSyncStatus({ isOnline: online });
      if (online) {
        // Kick off sync when back online
        syncAll().catch(() => {
          /* errors handled inside sync manager */
        });
      }
    };

    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, [setSyncStatus]);
}
