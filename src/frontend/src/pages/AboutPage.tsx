import { Card, CardContent } from "@/components/ui/card";
import { useGetAbout } from "@/hooks/useQueries";
import { Award, BookOpen, Clock, User } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  const { data: about, isLoading } = useGetAbout();

  if (isLoading) return null;
  if (!about) return null;

  const infoCards = [
    {
      icon: BookOpen,
      label: "Qualifications",
      value: about.qualifications,
      color: "cyan",
      gradient: "from-cyan/20 to-cyan/5",
      border: "border-cyan/20",
      iconColor: "text-cyan",
    },
    {
      icon: Clock,
      label: "Experience",
      value: about.experience,
      color: "violet",
      gradient: "from-violet/20 to-violet/5",
      border: "border-violet/20",
      iconColor: "text-violet",
    },
  ].filter((c) => c.value);

  return (
    <section
      data-ocid="about.section"
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
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet/30 text-xs font-mono text-violet mb-4">
            <User size={12} />
            About the Doctor
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-violet">
            Dr. Malay Akechan
          </h1>
        </motion.div>

        <div
          data-ocid="about.card"
          className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start max-w-5xl mx-auto"
        >
          {/* Photo */}
          {about.photoUrl && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-cyan/30 via-violet/20 to-emerald/20 blur-xl opacity-50" />
                <div className="relative rounded-2xl overflow-hidden border border-border/50">
                  <img
                    src={about.photoUrl}
                    alt="Dr. Malay Akechan"
                    className="w-full aspect-[3/4] object-cover"
                    loading="lazy"
                  />
                  {/* Scan lines overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 0.04) 2px, oklch(0 0 0 / 0.04) 4px)",
                    }}
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 glass border border-cyan/30 rounded-xl px-4 py-2 shadow-card">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-cyan" />
                    <span className="text-xs font-semibold text-gradient-cyan">
                      General Physician
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={about.photoUrl ? "lg:col-span-3" : "lg:col-span-5"}
          >
            {/* Bio */}
            {about.bio && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-bold mb-4 text-foreground">
                  Biography
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {about.bio}
                </p>
              </div>
            )}

            {/* Info cards */}
            {infoCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infoCards.map((card, idx) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                  >
                    <Card
                      className={`border ${card.border} bg-gradient-to-br ${card.gradient} glass`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center flex-shrink-0`}
                          >
                            <card.icon size={16} className={card.iconColor} />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium mb-1">
                              {card.label}
                            </p>
                            <p className="text-sm font-semibold text-foreground leading-snug">
                              {card.value}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
