import { AdminLayout, Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";
import AboutPage from "@/pages/AboutPage";
import ClinicsPage from "@/pages/ClinicsPage";
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import SocialPage from "@/pages/SocialPage";
import AdminPage from "@/pages/admin/AdminPage";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// ── Root route ──────────────────────────────────────────
const rootRoute = createRootRoute();

// ── Public layout route ─────────────────────────────────
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: Layout,
});

// ── Admin layout route ──────────────────────────────────
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
});

// ── Public page routes ──────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/about",
  component: AboutPage,
});

const clinicsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/clinics",
  component: ClinicsPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/services",
  component: ServicesPage,
});

const socialRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/social",
  component: SocialPage,
});

// ── Admin route ─────────────────────────────────────────
const adminRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminPage,
});

// ── Route tree ──────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    clinicsRoute,
    servicesRoute,
    socialRoute,
  ]),
  adminLayoutRoute.addChildren([adminRoute]),
]);

// ── Router ──────────────────────────────────────────────
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "glass border border-border/50",
            title: "text-foreground font-medium",
            description: "text-muted-foreground text-xs",
          },
        }}
      />
    </>
  );
}
