import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Moon, ShieldCheck, Stethoscope, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Clinics", to: "/clinics" },
  { label: "Services", to: "/services" },
  { label: "Social", to: "/social" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional pathname dep
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border/50 shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center glow-cyan group-hover:scale-105 transition-transform duration-200">
            <Stethoscope className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-sm leading-tight text-gradient-cyan">
              Dr. Malay Akechan
            </p>
            <p className="text-xs text-muted-foreground leading-tight">
              General Physician
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(var(--cyan) / 0.15), oklch(var(--violet) / 0.15))",
                      border: "1px solid oklch(var(--cyan) / 0.3)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            data-ocid="nav.theme.toggle"
            className="rounded-xl w-9 h-9 hover:bg-cyan/10 transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? (
                  <Sun size={16} className="text-amber" />
                ) : (
                  <Moon size={16} className="text-violet" />
                )}
              </motion.span>
            </AnimatePresence>
          </Button>

          {/* Admin link */}
          <Link to="/admin" data-ocid="nav.admin.link">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl w-9 h-9 hover:bg-violet/10 transition-colors"
              aria-label="Admin panel"
            >
              <ShieldCheck
                size={16}
                className="text-muted-foreground hover:text-violet transition-colors"
              />
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl w-9 h-9"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border/50 glass"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-cyan/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
