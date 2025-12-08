import { Toaster } from "./components/ui/sonner";
import { RouterProvider } from "react-router-dom";
import rootRoutes from "./routes/root.routes";
import { useAuthStore } from "./store/authStore";
import LoadingOverlay from "./components/shared/page-loader/loading-overlay";
import { ThemeProvider } from "./components/ui/theme-provider";

export default function App() {
  const { isLoading } = useAuthStore();
  return (
    <>
      {isLoading && <LoadingOverlay />}
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={rootRoutes} />
      </ThemeProvider>
      <Toaster />
    </>
  );
}
