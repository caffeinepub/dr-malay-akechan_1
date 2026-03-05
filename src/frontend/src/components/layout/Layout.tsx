import { useTheme } from "@/hooks/useTheme";
import { Outlet, useLocation } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children?: ReactNode;
  hideFooter?: boolean;
}

export function Layout({ hideFooter = false }: LayoutProps) {
  // Initialize theme on mount
  useTheme();
  const location = useLocation();

  // Scroll to top on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional pathname dep
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

// Layout without footer (for admin)
export function AdminLayout() {
  useTheme();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
