import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminSetHeader } from "@/hooks/useAdminQueries";
import { useGetHeader } from "@/hooks/useQueries";
import { CheckCircle2, FileText, ImageIcon, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminHeaderTab() {
  const { data: header } = useGetHeader();
  const { mutateAsync: setHeader, isPending } = useAdminSetHeader();

  const [heroText, setHeroText] = useState("");
  const [subText, setSubText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (header) {
      setHeroText(header.heroText ?? "");
      setSubText(header.subText ?? "");
      setImageUrl(header.imageUrl ?? "");
    }
  }, [header]);

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
      <Card className="glass border border-border/50 max-w-2xl">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ImageIcon size={14} className="text-muted-foreground" />
                Background / Hero Image URL
              </Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/hero-image.jpg"
                type="url"
                className="bg-background/50 border-border/50 focus:border-cyan/50 text-sm"
              />
              {imageUrl && (
                <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border/50 mt-2">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
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
