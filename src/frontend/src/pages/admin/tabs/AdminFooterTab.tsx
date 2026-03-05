import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSetFooter } from "@/hooks/useAdminQueries";
import { useGetFooter } from "@/hooks/useQueries";
import {
  AlignLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminFooterTab() {
  const { data: footer } = useGetFooter();
  const { mutateAsync: setFooter, isPending } = useAdminSetFooter();

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [copyright, setCopyright] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (footer) {
      setContactEmail(footer.contactEmail ?? "");
      setContactPhone(footer.contactPhone ?? "");
      setAddress(footer.address ?? "");
      setCopyright(footer.copyright ?? "");
    }
  }, [footer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await setFooter({ contactEmail, contactPhone, address, copyright });
      setSaved(true);
      toast.success("Footer saved successfully");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save footer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-ocid="admin.footer.panel"
    >
      <Card className="glass border border-border/50 max-w-2xl">
        <div className="h-0.5 bg-gradient-to-r from-amber to-cyan rounded-t-lg" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <AlignLeft size={18} className="text-amber" />
            Footer Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Mail size={13} className="text-cyan" /> Contact Email
              </Label>
              <Input
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="doctor@clinic.com"
                type="email"
                className="bg-background/50 border-border/50 focus:border-amber/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Phone size={13} className="text-emerald" /> Contact Phone
              </Label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                type="tel"
                className="bg-background/50 border-border/50 focus:border-amber/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={13} className="text-violet" /> Address
              </Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Medical Street, City, Country"
                className="bg-background/50 border-border/50 focus:border-amber/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Copyright Text</Label>
              <Input
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                placeholder={`© ${new Date().getFullYear()} Dr. Malay Akechan. All rights reserved.`}
                className="bg-background/50 border-border/50 focus:border-amber/50 text-sm"
              />
            </div>

            <Button
              type="submit"
              data-ocid="admin.footer.save_button"
              disabled={isPending}
              className="bg-gradient-to-r from-amber to-cyan text-white border-0 hover:opacity-90 gap-2"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saved ? (
                <CheckCircle2 size={15} />
              ) : (
                <Save size={15} />
              )}
              {isPending ? "Saving..." : saved ? "Saved!" : "Save Footer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
