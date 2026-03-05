import type { SocialLink } from "@/backend.d";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAdminAddSocialLink,
  useAdminDeleteSocialLink,
  useAdminUpdateSocialLink,
} from "@/hooks/useAdminQueries";
import { useGetSocialLinks } from "@/hooks/useQueries";
import {
  Edit3,
  Link as LinkIcon,
  Loader2,
  Plus,
  Save,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface SocialForm {
  platform: string;
  url: string;
  iconName: string;
}

const emptyForm: SocialForm = { platform: "", url: "", iconName: "" };

export default function AdminSocialTab() {
  const { data: socialLinks = [] } = useGetSocialLinks();
  const { mutateAsync: addSocialLink, isPending: isAdding } =
    useAdminAddSocialLink();
  const { mutateAsync: updateSocialLink, isPending: isUpdating } =
    useAdminUpdateSocialLink();
  const { mutateAsync: deleteSocialLink } = useAdminDeleteSocialLink();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [form, setForm] = useState<SocialForm>(emptyForm);

  const openAddDialog = () => {
    setEditingLink(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (link: SocialLink) => {
    setEditingLink(link);
    setForm({
      platform: link.platform,
      url: link.url,
      iconName: link.iconName,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await updateSocialLink({ ...form, id: editingLink.id });
        toast.success("Social link updated");
      } else {
        await addSocialLink(form);
        toast.success("Social link added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save social link");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteSocialLink(id);
      toast.success("Social link deleted");
    } catch {
      toast.error("Failed to delete social link");
    }
  };

  const isSaving = isAdding || isUpdating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
      data-ocid="admin.social.panel"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">
            Manage Social Links
          </h2>
          <p className="text-sm text-muted-foreground">
            {socialLinks.length} link{socialLinks.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          data-ocid="admin.social.add_button"
          className="bg-gradient-to-r from-violet to-emerald text-white border-0 hover:opacity-90 gap-2"
          size="sm"
        >
          <Plus size={15} />
          Add Link
        </Button>
      </div>

      {/* Links list */}
      {socialLinks.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Share2 size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No social links added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {socialLinks.map((link, idx) => (
              <motion.div
                key={link.id.toString()}
                data-ocid={`admin.social.item.${idx + 1}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="glass border border-violet/20">
                  <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex-shrink-0 bg-violet/10 border border-violet/20 flex items-center justify-center">
                        <Share2 size={15} className="text-violet" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{link.platform}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan hover:text-cyan/80 transition-colors flex items-center gap-1 truncate max-w-xs"
                        >
                          <LinkIcon size={10} />
                          {link.url}
                        </a>
                        {link.iconName && (
                          <p className="text-xs text-muted-foreground/60 font-mono">
                            icon: {link.iconName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(link)}
                        className="w-8 h-8 hover:bg-violet/10"
                      >
                        <Edit3 size={14} className="text-violet" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-ocid={`admin.social.delete_button.${idx + 1}`}
                            className="w-8 h-8 hover:bg-destructive/10"
                          >
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Social Link?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the "{link.platform}"
                              link.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(link.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass border border-border/50 max-w-md">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet to-emerald rounded-t-lg" />
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Share2 size={18} className="text-violet" />
              {editingLink ? "Edit Social Link" : "Add Social Link"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Platform Name *</Label>
              <Input
                value={form.platform}
                onChange={(e) =>
                  setForm((f) => ({ ...f, platform: e.target.value }))
                }
                placeholder="e.g. Instagram, Facebook, LinkedIn"
                required
                className="text-sm bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">URL *</Label>
              <Input
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://instagram.com/yourprofile"
                type="url"
                required
                className="text-sm bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Icon Name{" "}
                <span className="text-muted-foreground font-normal">
                  (react-icons/si name, e.g. instagram, facebook, linkedin)
                </span>
              </Label>
              <Input
                value={form.iconName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, iconName: e.target.value }))
                }
                placeholder="instagram"
                className="text-sm bg-background/50 font-mono"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  size="sm"
                  className="gap-1.5"
                >
                  <X size={14} />
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isSaving}
                size="sm"
                className="bg-gradient-to-r from-violet to-emerald text-white border-0 hover:opacity-90 gap-1.5"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSaving ? "Saving..." : editingLink ? "Update" : "Add Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
