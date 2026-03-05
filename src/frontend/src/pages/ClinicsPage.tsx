import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetClinics } from "@/hooks/useQueries";
import {
  Building2,
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";

export default function ClinicsPage() {
  const { data: clinics = [], isLoading } = useGetClinics();

  if (isLoading) return null;

  const visibleClinics = clinics.filter((c) => c.isVisible);
  if (visibleClinics.length === 0) return null;

  return (
    <section
      data-ocid="clinics.section"
      className="relative min-h-[calc(100vh-4rem)] py-20 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(var(--emerald) / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--emerald) / 0.08) 1px, transparent 1px)",
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-emerald/30 text-xs font-mono text-emerald mb-4">
            <Building2 size={12} />
            Our Clinics
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-emerald">
            Find a Clinic
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            Visit us at one of our convenient locations.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {visibleClinics.map((clinic, idx) => (
            <motion.div
              key={clinic.id.toString()}
              data-ocid={`clinics.item.${idx + 1}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full glass border border-border/50 hover:border-emerald/30 transition-all duration-300 overflow-hidden group">
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-emerald via-cyan to-violet w-full" />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald/20 to-cyan/20 border border-emerald/20 flex items-center justify-center flex-shrink-0 group-hover:glow-emerald transition-all">
                        <Building2 size={18} className="text-emerald" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-display font-bold leading-tight">
                          {clinic.name}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs border-emerald/30 text-emerald"
                        >
                          Open
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {clinic.address && (
                    <div className="flex items-start gap-2.5 text-sm">
                      <MapPin
                        size={14}
                        className="text-violet flex-shrink-0 mt-0.5"
                      />
                      <span className="text-muted-foreground leading-snug">
                        {clinic.address}
                      </span>
                    </div>
                  )}
                  {clinic.phone && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone size={14} className="text-cyan flex-shrink-0" />
                      <a
                        href={`tel:${clinic.phone}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {clinic.phone}
                      </a>
                    </div>
                  )}
                  {clinic.hours && (
                    <div className="flex items-center gap-2.5 text-sm">
                      <Clock size={14} className="text-amber flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {clinic.hours}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {clinic.mapsUrl && (
                      <a
                        href={clinic.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid="clinics.map_marker"
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs border-emerald/30 hover:bg-emerald/10 hover:border-emerald/50 gap-1.5"
                        >
                          <MapPin size={12} />
                          View Map
                        </Button>
                      </a>
                    )}
                    {clinic.bookingUrl && (
                      <a
                        href={clinic.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ocid="clinics.button"
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          className="w-full text-xs bg-gradient-to-r from-cyan to-violet text-white hover:opacity-90 gap-1.5 border-0"
                        >
                          <CalendarDays size={12} />
                          Book Now
                        </Button>
                      </a>
                    )}
                    {!clinic.mapsUrl && !clinic.bookingUrl && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ExternalLink size={12} />
                        Contact for appointments
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
