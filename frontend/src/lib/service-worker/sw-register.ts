export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      // During dev with VitePWA devOptions enabled, the SW is available at this path
      const swUrl = import.meta.env.DEV
        ? "/dev-sw.js?dev-sw"
        : "/service-worker.js";
      const reg = await navigator.serviceWorker.register(swUrl, {
        type: "module",
      });
      // Listen for updates
      if (reg && reg.waiting) {
        // Post a message to activate new SW immediately
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      reg.addEventListener("updatefound", () => {
        const sw = reg.installing;
        if (!sw) return;
        sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            console.info("New Service Worker available; refreshing to update");
          }
        });
      });
    } catch (err) {
      console.error("SW registration failed", err);
    }
  }
}
