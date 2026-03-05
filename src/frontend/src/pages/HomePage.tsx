import { useGetHeader } from "@/hooks/useQueries";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

export default function HomePage() {
  const { data: header, isLoading } = useGetHeader();

  if (isLoading) return null;
  if (!header) return null;

  return (
    <section
      data-ocid="home.section"
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      {header.imageUrl && (
        <div className="absolute inset-0">
          <img
            src={header.imageUrl}
            alt="Hero background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
        </div>
      )}

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      {/* Tech grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(oklch(var(--cyan) / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--cyan) / 0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div
        data-ocid="home.hero.card"
        className="relative z-10 container mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          {/* Accent badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-cyan/30 text-xs font-mono text-cyan mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-glow" />
            General Physician · Dr. Malay Akechan
          </motion.div>

          {/* Hero title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-gradient-cyan">{header.heroText}</span>
          </motion.h1>

          {/* Sub text */}
          {header.subText && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              {header.subText}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/60"
      >
        <span className="text-xs font-mono">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
