import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetSocialLinks } from "@/hooks/useQueries";
import { ExternalLink, Share2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { motion } from "motion/react";
import type { ElementType } from "react";
import type { IconType } from "react-icons";
import * as ReactIcons from "react-icons/si";

type SiIconName = keyof typeof ReactIcons;
type LucideIconName = keyof typeof LucideIcons;

function SocialIcon({
  iconName,
  size = 24,
}: { iconName: string; size?: number }) {
  // Try Si (react-icons) first
  const siKey =
    `Si${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}` as SiIconName;
  const SiIcon = ReactIcons[siKey] as IconType | undefined;
  if (SiIcon) return <SiIcon size={size} />;

  // Fall back to lucide
  const lucideKey = iconName as LucideIconName;
  const LucideIcon = LucideIcons[lucideKey] as
    | ElementType<LucideProps>
    | undefined;
  if (LucideIcon) return <LucideIcon size={size} />;

  return <Share2 size={size} />;
}

const platformColors: Record<
  string,
  { gradient: string; border: string; iconColor: string; bg: string }
> = {
  facebook: {
    gradient: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  twitter: {
    gradient: "from-sky-400/20 to-sky-400/5",
    border: "border-sky-400/20",
    iconColor: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  x: {
    gradient: "from-foreground/10 to-foreground/5",
    border: "border-foreground/20",
    iconColor: "text-foreground",
    bg: "bg-foreground/10",
  },
  instagram: {
    gradient: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/20",
    iconColor: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  linkedin: {
    gradient: "from-cyan/20 to-cyan/5",
    border: "border-cyan/20",
    iconColor: "text-cyan",
    bg: "bg-cyan/10",
  },
  youtube: {
    gradient: "from-red-500/20 to-red-500/5",
    border: "border-red-500/20",
    iconColor: "text-red-400",
    bg: "bg-red-500/10",
  },
  whatsapp: {
    gradient: "from-emerald/20 to-emerald/5",
    border: "border-emerald/20",
    iconColor: "text-emerald",
    bg: "bg-emerald/10",
  },
};

function getPlatformStyle(platform: string) {
  const key = platform.toLowerCase();
  return (
    platformColors[key] || {
      gradient: "from-violet/20 to-violet/5",
      border: "border-violet/20",
      iconColor: "text-violet",
      bg: "bg-violet/10",
    }
  );
}

export default function SocialPage() {
  const { data: socialLinks = [], isLoading } = useGetSocialLinks();

  if (isLoading) return null;
  if (socialLinks.length === 0) return null;

  return (
    <section
      data-ocid="social.section"
      className="relative min-h-[calc(100vh-4rem)] py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(var(--violet) / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--violet) / 0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet/30 text-xs font-mono text-violet mb-4">
            <Share2 size={12} />
            Social Media
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-violet">
            Connect With Us
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            Follow us on social media for health tips and updates.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-4xl mx-auto">
          {socialLinks.map((link, idx) => {
            const style = getPlatformStyle(link.platform);
            return (
              <motion.div
                key={link.id.toString()}
                data-ocid={`social.item.${idx + 1}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group"
              >
                <Card
                  className={`border ${style.border} bg-gradient-to-br ${style.gradient} glass transition-all duration-300 overflow-hidden`}
                >
                  <div className="h-0.5 bg-gradient-to-r from-cyan via-violet to-emerald w-full" />
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl ${style.bg} border ${style.border} flex items-center justify-center transition-all duration-300`}
                    >
                      <span
                        className={`${style.iconColor} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <SocialIcon
                          iconName={link.iconName || link.platform}
                          size={28}
                        />
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base">
                        {link.platform}
                      </h3>
                    </div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={`w-full text-xs border ${style.border} ${style.iconColor} hover:opacity-90 gap-1.5`}
                      >
                        <ExternalLink size={12} />
                        Follow
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
