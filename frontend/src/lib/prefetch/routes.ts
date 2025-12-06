// Simple prefetch utility: warm API endpoints likely needed soon
import { useAuthStore } from "@/store/authStore";
export type Importer = () => Promise<unknown>;
export type DataPrefetcher = (qc: unknown) => Promise<unknown>;

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

// Prefetch page bundles (code-split chunks) based on route path
export function getImportersForPath(path: string): Importer[] {
  const list: Importer[] = [];

  // Public / Auth
  if (path === "/" || path.startsWith("/login")) {
    list.push(() => import("@/pages/auth/login.tsx"));
  }
  if (path.startsWith("/contact-us")) {
    list.push(() => import("@/pages/auth/help/contact-us.tsx"));
  }
  if (path.startsWith("/terms-and-conditions")) {
    list.push(() => import("@/pages/auth/help/terms-and-conditions.tsx"));
  }
  if (path.startsWith("/not-found")) {
    list.push(() => import("@/pages/not-found/not-found.tsx"));
  }

  // Admin dashboard
  if (path === "/admin" || path.startsWith("/admin/dashboard")) {
    list.push(() => import("@/pages/admin/home/index.tsx"));
  }
  // Administrators
  if (path.startsWith("/admin/administrators")) {
    list.push(() => import("@/pages/admin/administrators/index.tsx"));
    list.push(() => import("@/pages/admin/administrators/administrators.tsx"));
    list.push(
      () => import("@/pages/admin/administrators/add/create-admin.tsx")
    );
    list.push(() => import("@/pages/admin/administrators/edit/edit-admin.tsx"));
    list.push(() => import("@/pages/admin/administrators/view/view-admin.tsx"));
  }
  // Teachers
  if (path.startsWith("/admin/teachers")) {
    list.push(() => import("@/pages/admin/teachers/index.tsx"));
    list.push(() => import("@/pages/admin/teachers/teachers.tsx"));
    list.push(() => import("@/pages/admin/teachers/add/create-teacher.tsx"));
    list.push(() => import("@/pages/admin/teachers/edit/edit-teacher.tsx"));
    list.push(() => import("@/pages/admin/teachers/view/view-teacher.tsx"));
  }
  // Students
  if (path.startsWith("/admin/students")) {
    list.push(() => import("@/pages/admin/students/index.tsx"));
    list.push(() => import("@/pages/admin/students/students.tsx"));
    list.push(() => import("@/pages/admin/students/add/create-student.tsx"));
    list.push(() => import("@/pages/admin/students/edit/edit-student.tsx"));
    list.push(() => import("@/pages/admin/students/view/view-student.tsx"));
  }
  // Classes
  if (path.startsWith("/admin/classes")) {
    list.push(() => import("@/pages/admin/classes/index.tsx"));
    list.push(() => import("@/pages/admin/classes/classes.tsx"));
    list.push(() => import("@/pages/admin/classes/add/create-class.tsx"));
    list.push(() => import("@/pages/admin/classes/edit/edit-class.tsx"));
    list.push(() => import("@/pages/admin/classes/view/view-class.tsx"));
  }
  // Canteen / Records
  if (path.startsWith("/admin/canteen")) {
    list.push(() => import("@/pages/admin/canteen/index.tsx"));
    list.push(() => import("@/pages/admin/canteen/canteen.tsx"));
    list.push(() => import("@/pages/admin/canteen/details/records-detail.tsx"));
    list.push(() => import("@/pages/admin/canteen/setup/index.tsx"));
    list.push(() => import("@/pages/admin/canteen/setup/setup.tsx"));
    list.push(
      () => import("@/pages/admin/canteen/setup/list/setup-canteen.tsx")
    );
  }
  if (path.startsWith("/admin/canteen-records")) {
    list.push(() => import("@/pages/admin/canteen/index.tsx"));
    list.push(() => import("@/pages/admin/canteen/canteen.tsx"));
    list.push(() => import("@/pages/admin/canteen/details/records-detail.tsx"));
    list.push(() => import("@/pages/admin/canteen/setup/index.tsx"));
    list.push(() => import("@/pages/admin/canteen/setup/setup.tsx"));
    list.push(
      () => import("@/pages/admin/canteen/setup/list/setup-canteen.tsx")
    );
  }
  // Prepayments
  if (path.startsWith("/admin/prepayments")) {
    list.push(() => import("@/pages/admin/canteen/prepayments/index.tsx"));
    list.push(
      () => import("@/pages/admin/canteen/prepayments/prepayments.tsx")
    );
  }
  // Owings
  if (path.startsWith("/admin/owings")) {
    list.push(() => import("@/pages/admin/canteen/owings/owings.tsx"));
    list.push(
      () =>
        import("@/pages/admin/canteen/owings/[id]/student-owing-details.tsx")
    );
  }
  // Accounts (Expenses)
  if (path.startsWith("/admin/accounts")) {
    list.push(() => import("@/pages/admin/expenses/index.tsx"));
    list.push(() => import("@/pages/admin/expenses/expenses.tsx"));
    list.push(() => import("@/pages/admin/expenses/add/create-expense.tsx"));
    list.push(() => import("@/pages/admin/expenses/edit/edit-expense.tsx"));
    list.push(() => import("@/pages/admin/expenses/view/view-expense.tsx"));
    list.push(() => import("@/pages/admin/expenses/overall/overall.tsx"));
  }
  // Reports
  if (path.startsWith("/admin/reports")) {
    list.push(() => import("@/pages/admin/reports/index.tsx"));
  }
  // Settings
  if (path.startsWith("/admin/settings")) {
    list.push(() => import("@/pages/admin/settings/index.tsx"));
    list.push(() => import("@/pages/admin/settings/settings.tsx"));
    list.push(() => import("@/pages/admin/settings/profile/profile.tsx"));
    list.push(() => import("@/pages/admin/settings/canteen/canteen.tsx"));
  }

  // Teacher
  if (path === "/teacher" || path === "/teacher/") {
    list.push(() => import("@/pages/teacher/home/index.tsx"));
  }
  if (path.startsWith("/teacher/canteen")) {
    list.push(() => import("@/pages/teacher/canteen/index.tsx"));
    list.push(() => import("@/pages/teacher/canteen/canteen.tsx"));
    list.push(
      () => import("@/pages/teacher/canteen/list/submitted-records-list.tsx")
    );
    list.push(
      () => import("@/pages/teacher/canteen/view/view-canteen.records.tsx")
    );
    list.push(() => import("@/pages/teacher/canteen/edit/edit-canteen.tsx"));
    list.push(
      () => import("@/pages/teacher/canteen/submit/record-canteen.tsx")
    );
  }
  if (path.startsWith("/teacher/prepayments")) {
    list.push(() => import("@/pages/teacher/prepayments/index.tsx"));
    list.push(() => import("@/pages/teacher/prepayments/prepayments.tsx"));
  }
  if (path.startsWith("/teacher/students")) {
    list.push(() => import("@/pages/teacher/students/index.tsx"));
    list.push(() => import("@/pages/teacher/students/students.tsx"));
    list.push(() => import("@/pages/teacher/students/add/create-student.tsx"));
    list.push(() => import("@/pages/teacher/students/edit/edit-student.tsx"));
    // Owing students pages can be warmed when their modules are available
    list.push(() => import("@/pages/teacher/students/view/view-student.tsx"));
  }
  if (path.startsWith("/teacher/settings")) {
    list.push(() => import("@/pages/teacher/settings/index.tsx"));
  }

  return list;
}
