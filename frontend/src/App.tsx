import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { RouterProvider } from "react-router-dom";
import rootRoutes from "./routes/root.routes";
import { useAuthStore } from "./store/authStore";
import LoadingOverlay from "./components/shared/page-loader/loading-overlay";
import { registerServiceWorker } from "@/lib/service-worker/sw-register";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { prefetchInitialData } from "@/lib/prefetch/routes";

export default function App() {
  const { isLoading } = useAuthStore();
  useNetworkStatus();

  useEffect(() => {
    registerServiceWorker();
    if (navigator.onLine) {
      prefetchInitialData();
    }
  }, []);
  return (
    <>
      {isLoading && <LoadingOverlay />}
      <RouterProvider router={rootRoutes} />
      <Toaster />
    </>
  );
}
