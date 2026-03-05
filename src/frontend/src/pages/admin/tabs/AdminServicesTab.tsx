import type { Service } from "@/backend.d";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminAddService,
  useAdminDeleteService,
  useAdminUpdateService,
} from "@/hooks/useAdminQueries";
import { useGetServices } from "@/hooks/useQueries";
import {
  Edit3,
  Loader2,
  Plus,
  Save,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface ServiceForm {
  title: string;
  description: string;
  iconName: string;
}

const emptyForm: ServiceForm = {
  title: "",
  description: "",
  iconName: "Stethoscope",
};

export default function AdminServicesTab() {
  const { data: services = [] } = useGetServices();
  const { mutateAsync: addService, isPending: isAdding } = useAdminAddService();
  const { mutateAsync: updateService, isPending: isUpdating } =
    useAdminUpdateService();
  const { mutateAsync: deleteService } = useAdminDeleteService();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const openAddDialog = () => {
    setEditingService(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setForm({
      title: service.title,
      description: service.description,
      iconName: service.iconName,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService({ ...form, id: editingService.id });
        toast.success("Service updated");
      } else {
        await addService(form);
        toast.success("Service added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteService(id);
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const isSaving = isAdding || isUpdating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
      data-ocid="admin.services.panel"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Manage Services</h2>
          <p className="text-sm text-muted-foreground">
            {services.length} service{services.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          data-ocid="admin.service.add_button"
          className="bg-gradient-to-r from-cyan to-violet text-white border-0 hover:opacity-90 gap-2"
          size="sm"
        >
          <Plus size={15} />
          Add Service
        </Button>
      </div>

      {/* Services list */}
      {services.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Stethoscope size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No services added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {services.map((service, idx) => (
              <motion.div
                key={service.id.toString()}
                data-ocid={`admin.service.item.${idx + 1}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="glass border border-cyan/20">
                  <CardContent className="p-4 flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl flex-shrink-0 bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                        <Stethoscope size={15} className="text-cyan" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{service.title}</p>
                        {service.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        {service.iconName && (
                          <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">
                            icon: {service.iconName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(service)}
                        className="w-8 h-8 hover:bg-cyan/10"
                      >
                        <Edit3 size={14} className="text-cyan" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-ocid={`admin.service.delete_button.${idx + 1}`}
                            className="w-8 h-8 hover:bg-destructive/10"
                          >
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{service.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(service.id)}
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
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan to-violet rounded-t-lg" />
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Stethoscope size={18} className="text-cyan" />
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Service Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. General Check-up"
                required
                className="text-sm bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description of the service..."
                rows={3}
                className="resize-none text-sm bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Icon Name{" "}
                <span className="text-muted-foreground font-normal">
                  (Lucide icon, e.g. Stethoscope, Heart, Activity)
                </span>
              </Label>
              <Input
                value={form.iconName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, iconName: e.target.value }))
                }
                placeholder="Stethoscope"
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
                className="bg-gradient-to-r from-cyan to-violet text-white border-0 hover:opacity-90 gap-1.5"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSaving
                  ? "Saving..."
                  : editingService
                    ? "Update"
                    : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
