import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSetHeader } from "@/hooks/useAdminQueries";
import { useGetHeader } from "@/hooks/useQueries";
import {
  CheckCircle2,
  FileText,
  ImageIcon,
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

export default function AdminHeaderTab() {
  const { data: header } = useGetHeader();
  const { mutateAsync: setHeader, isPending } = useAdminSetHeader();

  const [heroText, setHeroText] = useState("");
  const [subText, setSubText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (header) {
      setHeroText(header.heroText ?? "");
      setSubText(header.subText ?? "");
      setImageUrl(header.imageUrl ?? "");
    }
  }, [header]);

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
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Reset so same file can be re-selected if needed
    e.target.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await setHeader({ heroText, subText, imageUrl });
      setSaved(true);
      toast.success("Header saved successfully");
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Failed to save header");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass border border-border/50 max-w-2xl w-full">
        <div className="h-0.5 bg-gradient-to-r from-cyan to-violet rounded-t-lg" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <FileText size={18} className="text-cyan" />
            Header Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Hero Text{" "}
                <span className="text-muted-foreground text-xs">
                  (main heading)
                </span>
              </Label>
              <Textarea
                value={heroText}
                onChange={(e) => setHeroText(e.target.value)}
                placeholder="e.g. Your Health, Our Priority"
                data-ocid="admin.header.textarea"
                rows={3}
                className="resize-none bg-background/50 border-border/50 focus:border-cyan/50 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Sub Text{" "}
                <span className="text-muted-foreground text-xs">
                  (subtitle / tagline)
                </span>
              </Label>
              <Input
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="e.g. Compassionate care for all ages"
                data-ocid="admin.header.input"
                className="bg-background/50 border-border/50 focus:border-cyan/50 text-sm"
              />
            </div>

            {/* Image upload section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon size={14} className="text-muted-foreground" />
                Background / Hero Image
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
                  data-ocid="admin.header.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 border-cyan/30 text-cyan hover:bg-cyan/10 hover:border-cyan/50"
                >
                  <Upload size={14} />
                  Upload Image
                </Button>
              </div>

              {/* URL fallback */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">
                  or paste image URL:
                </span>
                <Input
                  value={imageUrl.startsWith("data:") ? "" : imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/hero-image.jpg"
                  type="url"
                  className="bg-background/50 border-border/50 focus:border-cyan/50 text-sm"
                  disabled={imageUrl.startsWith("data:")}
                />
              </div>

              {/* Preview with remove button */}
              {imageUrl && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/50 group">
                  <img
                    src={imageUrl}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <button
                    type="button"
                    data-ocid="admin.header.delete_button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-white bg-black/60 rounded px-2 py-0.5">
                      {imageUrl.startsWith("data:")
                        ? "Uploaded image"
                        : "URL image"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              data-ocid="admin.header.save_button"
              disabled={isPending}
              className="bg-gradient-to-r from-cyan to-violet text-white border-0 hover:opacity-90 gap-2"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saved ? (
                <CheckCircle2 size={15} />
              ) : (
                <Save size={15} />
              )}
              {isPending ? "Saving..." : saved ? "Saved!" : "Save Header"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
