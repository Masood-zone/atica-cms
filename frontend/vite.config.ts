import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ensure tsconfig path aliases are respected
    tsconfigPaths(),
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "service-worker.ts",
      devOptions: {
        enabled: true,
        navigateFallback: "/index.html",
      },
      registerType: "autoUpdate",
      manifestFilename: "manifest.webmanifest",
      manifest: {
        name: "Canteen Management System",
        short_name: "CMS",
        description: "Offline-first PWA for managing school canteen operations",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait-primary",
        icons: [
          { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
          { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
        categories: ["business", "productivity"],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest,woff,woff2}"],
        ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/localhost:3400\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 2592000 },
            },
          },
        ],
      },
    }),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
