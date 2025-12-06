// Simple prefetch utility: warm API endpoints likely needed soon
import { useAuthStore } from "@/store/authStore";

export async function prefetchInitialData() {
  const endpoints = [
    "/settings/amount",
    "/references",
    "/classes",
    "/students?limit=50",
  ];

  const token = useAuthStore.getState().token;
  const base = "http://localhost:3400";
  const controller = new AbortController();
  const { signal } = controller;

  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // fire-and-forget prefetch; relies on SW runtime caching
  endpoints.forEach((ep) => {
    fetch(`${base}${ep}`, { signal, headers }).catch(() => {});
  });

  // Optionally cancel after a short window
  setTimeout(() => controller.abort(), 5000);
}
