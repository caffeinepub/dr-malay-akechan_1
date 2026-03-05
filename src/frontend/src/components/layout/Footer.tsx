import { useGetFooter } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const { data: footer } = useGetFooter();

  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="relative border-t border-border/50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "var(--tw-bg-tech-grid, none)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display font-bold text-lg text-gradient-cyan mb-2">
              Dr. Malay Akechan
            </h3>
            <p className="text-sm text-muted-foreground">General Physician</p>
            {footer?.copyright && (
              <p className="text-xs text-muted-foreground mt-4">
                {footer.copyright}
              </p>
            )}
          </div>

          {/* Contact info */}
          {footer && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-foreground mb-3">
                Contact
              </h4>
              {footer.contactEmail && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="text-cyan flex-shrink-0" />
                  <a
                    href={`mailto:${footer.contactEmail}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {footer.contactEmail}
                  </a>
                </div>
              )}
              {footer.contactPhone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} className="text-emerald flex-shrink-0" />
                  <a
                    href={`tel:${footer.contactPhone}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {footer.contactPhone}
                  </a>
                </div>
              )}
              {footer.address && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin
                    size={14}
                    className="text-violet flex-shrink-0 mt-0.5"
                  />
                  <span>{footer.address}</span>
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">
              Navigate
            </h4>
            <div className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Clinics", to: "/clinics" },
                { label: "Services", to: "/services" },
                { label: "Social", to: "/social" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground text-center">
            © {currentYear}. Built with{" "}
            <Heart
              size={10}
              className="inline text-red-400 mx-0.5"
              fill="currentColor"
            />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:text-cyan/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <Link
            to="/admin"
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
