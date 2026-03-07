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
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

export default function AdminAboutTab() {
  const { data: about } = useGetAbout();
  const { mutateAsync: setAbout, isPending } = useAdminSetAbout();

  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (about) {
      setBio(about.bio ?? "");
      setPhotoUrl(about.photoUrl ?? "");
      setQualifications(about.qualifications ?? "");
      setExperience(about.experience ?? "");
    }
  }, [about]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      toast.warning(
        "Image is large and may slow down the site. Consider compressing it.",
      );
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Reset so same file can be re-selected if needed
    e.target.value = "";
  };

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
      <Card className="glass border border-border/50 max-w-2xl w-full">
        <div className="h-0.5 bg-gradient-to-r from-violet to-emerald rounded-t-lg" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <LayoutDashboard size={18} className="text-violet" />
            About Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Doctor Photo upload section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon size={14} className="text-muted-foreground" />
                Doctor Photo
              </Label>

              {/* Upload button */}
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="admin.about.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 border-violet/30 text-violet hover:bg-violet/10 hover:border-violet/50"
                >
                  <Upload size={14} />
                  Upload Photo
                </Button>
              </div>

              {/* URL fallback */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">
                  or paste photo URL:
                </span>
                <Input
                  value={photoUrl.startsWith("data:") ? "" : photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/doctor-photo.jpg"
                  type="url"
                  className="bg-background/50 border-border/50 focus:border-violet/50 text-sm"
                  disabled={photoUrl.startsWith("data:")}
                />
              </div>

              {/* Photo preview with remove button */}
              {photoUrl && (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-border/50 group">
                  <img
                    src={photoUrl}
                    alt="Doctor preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button
                    type="button"
                    data-ocid="admin.about.delete_button"
                    onClick={() => setPhotoUrl("")}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 hover:bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Remove photo"
                  >
                    <X size={12} />
                  </button>
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
