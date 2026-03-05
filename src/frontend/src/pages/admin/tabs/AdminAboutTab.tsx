import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSetAbout } from "@/hooks/useAdminQueries";
import { useGetAbout } from "@/hooks/useQueries";
import {
  CheckCircle2,
  ImageIcon,
  LayoutDashboard,
  Loader2,
  Save,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminAboutTab() {
  const { data: about } = useGetAbout();
  const { mutateAsync: setAbout, isPending } = useAdminSetAbout();

  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (about) {
      setBio(about.bio ?? "");
      setPhotoUrl(about.photoUrl ?? "");
      setQualifications(about.qualifications ?? "");
      setExperience(about.experience ?? "");
    }
  }, [about]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await setAbout({ bio, photoUrl, qualifications, experience });
      setSaved(true);
      toast.success("About section saved successfully");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save about section");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass border border-border/50 max-w-2xl">
        <div className="h-0.5 bg-gradient-to-r from-violet to-emerald rounded-t-lg" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <LayoutDashboard size={18} className="text-violet" />
            About Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon size={14} className="text-muted-foreground" />
                Doctor Photo URL
              </Label>
              <Input
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/doctor-photo.jpg"
                type="url"
                className="bg-background/50 border-border/50 focus:border-violet/50 text-sm"
              />
              {photoUrl && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-border/50">
                  <img
                    src={photoUrl}
                    alt="Doctor preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Biography</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a detailed biography of the doctor..."
                data-ocid="admin.about.textarea"
                rows={5}
                className="resize-none bg-background/50 border-border/50 focus:border-violet/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Qualifications</Label>
              <Textarea
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. MBBS, MD (Internal Medicine), FRCP..."
                rows={3}
                className="resize-none bg-background/50 border-border/50 focus:border-violet/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Experience</Label>
              <Input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 20+ years in General Practice"
                className="bg-background/50 border-border/50 focus:border-violet/50 text-sm"
              />
            </div>

            <Button
              type="submit"
              data-ocid="admin.about.save_button"
              disabled={isPending}
              className="bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90 gap-2"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saved ? (
                <CheckCircle2 size={15} />
              ) : (
                <Save size={15} />
              )}
              {isPending ? "Saving..." : saved ? "Saved!" : "Save About"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
