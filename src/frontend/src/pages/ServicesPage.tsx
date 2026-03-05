import { Card, CardContent } from "@/components/ui/card";
import { useGetServices } from "@/hooks/useQueries";
import { Stethoscope } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { motion } from "motion/react";
import type { ElementType } from "react";

type IconName = keyof typeof LucideIcons;

function ServiceIcon({
  iconName,
  size = 20,
}: { iconName: string; size?: number }) {
  const Icon = LucideIcons[iconName as IconName] as
    | ElementType<LucideProps>
    | undefined;
  if (Icon) return <Icon size={size} />;
  return <Stethoscope size={size} />;
}

const accentCycles = [
  {
    gradient: "from-cyan/20 to-cyan/5",
    border: "border-cyan/20",
    iconBg: "bg-cyan/10",
    iconColor: "text-cyan",
    glow: "group-hover:glow-cyan",
    bar: "from-cyan to-violet",
  },
  {
    gradient: "from-violet/20 to-violet/5",
    border: "border-violet/20",
    iconBg: "bg-violet/10",
    iconColor: "text-violet",
    glow: "group-hover:glow-violet",
    bar: "from-violet to-emerald",
  },
  {
    gradient: "from-emerald/20 to-emerald/5",
    border: "border-emerald/20",
    iconBg: "bg-emerald/10",
    iconColor: "text-emerald",
    glow: "group-hover:glow-emerald",
    bar: "from-emerald to-cyan",
  },
  {
    gradient: "from-amber/20 to-amber/5",
    border: "border-amber/20",
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    glow: "group-hover:glow-amber",
    bar: "from-amber to-cyan",
  },
];

export default function ServicesPage() {
  const { data: services = [], isLoading } = useGetServices();

  if (isLoading) return null;
  if (services.length === 0) return null;

  return (
    <section
      data-ocid="services.section"
      className="relative min-h-[calc(100vh-4rem)] py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(var(--cyan) / 0.07) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--cyan) / 0.07) 1px, transparent 1px)",
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-cyan/30 text-xs font-mono text-cyan mb-4">
            <Stethoscope size={12} />
            Medical Services
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-cyan">
            Our Services
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            Comprehensive healthcare services tailored to your needs.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {services.map((service, idx) => {
            const accent = accentCycles[idx % accentCycles.length];
            return (
              <motion.div
                key={service.id.toString()}
                data-ocid={`services.item.${idx + 1}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card
                  className={`h-full border ${accent.border} bg-gradient-to-br ${accent.gradient} glass transition-all duration-300 overflow-hidden`}
                >
                  {/* Top accent bar */}
                  <div
                    className={`h-0.5 bg-gradient-to-r ${accent.bar} w-full`}
                  />

                  <CardContent className="p-5">
                    <div
                      className={`w-11 h-11 rounded-xl ${accent.iconBg} border ${accent.border} flex items-center justify-center mb-4 ${accent.glow} transition-all duration-300`}
                    >
                      <span className={accent.iconColor}>
                        <ServiceIcon iconName={service.iconName} size={20} />
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base mb-2 leading-tight">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    )}
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
