import type { Clinic } from "@/backend.d";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useAdminAddClinic,
  useAdminDeleteClinic,
  useAdminUpdateClinic,
} from "@/hooks/useAdminQueries";
import { useGetAllClinics } from "@/hooks/useQueries";
import {
  Building2,
  Calendar,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface ClinicFormData {
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapsUrl: string;
  bookingUrl: string;
}

const emptyForm: ClinicFormData = {
  name: "",
  address: "",
  phone: "",
  hours: "",
  mapsUrl: "",
  bookingUrl: "",
};

export default function AdminClinicsTab() {
  const { data: clinics = [] } = useGetAllClinics();
  const { mutateAsync: addClinic, isPending: isAdding } = useAdminAddClinic();
  const { mutateAsync: updateClinic, isPending: isUpdating } =
    useAdminUpdateClinic();
  const { mutateAsync: deleteClinic } = useAdminDeleteClinic();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [form, setForm] = useState<ClinicFormData>(emptyForm);

  const openAddDialog = () => {
    setEditingClinic(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setForm({
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      hours: clinic.hours,
      mapsUrl: clinic.mapsUrl,
      bookingUrl: clinic.bookingUrl,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingClinic) {
        await updateClinic({
          ...form,
          id: editingClinic.id,
          isVisible: editingClinic.isVisible,
        });
        toast.success("Clinic updated");
      } else {
        await addClinic(form);
        toast.success("Clinic added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save clinic");
    }
  };

  const handleToggleVisibility = async (clinic: Clinic) => {
    try {
      await updateClinic({
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        hours: clinic.hours,
        mapsUrl: clinic.mapsUrl,
        bookingUrl: clinic.bookingUrl,
        isVisible: !clinic.isVisible,
      });
      toast.success(`Clinic ${!clinic.isVisible ? "shown" : "hidden"}`);
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteClinic(id);
      toast.success("Clinic deleted");
    } catch {
      toast.error("Failed to delete clinic");
    }
  };

  const isSaving = isAdding || isUpdating;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
      data-ocid="admin.clinics.panel"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Manage Clinics</h2>
          <p className="text-sm text-muted-foreground">
            {clinics.length} clinic{clinics.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          data-ocid="admin.clinic.add_button"
          className="bg-gradient-to-r from-emerald to-cyan text-white border-0 hover:opacity-90 gap-2"
          size="sm"
        >
          <Plus size={15} />
          Add Clinic
        </Button>
      </div>

      {/* Clinics list */}
      {clinics.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            No clinics added yet. Click "Add Clinic" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {clinics.map((clinic, idx) => (
              <motion.div
                key={clinic.id.toString()}
                data-ocid={`admin.clinic.item.${idx + 1}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Card
                  className={`glass border transition-all duration-200 ${
                    clinic.isVisible
                      ? "border-emerald/20"
                      : "border-border/30 opacity-70"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div
                          className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                            clinic.isVisible
                              ? "bg-emerald/10 border border-emerald/20"
                              : "bg-muted border border-border/50"
                          }`}
                        >
                          <Building2
                            size={16}
                            className={
                              clinic.isVisible
                                ? "text-emerald"
                                : "text-muted-foreground"
                            }
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm">
                              {clinic.name}
                            </h3>
                            <Badge
                              variant={
                                clinic.isVisible ? "default" : "secondary"
                              }
                              className={`text-xs ${clinic.isVisible ? "bg-emerald/20 text-emerald border-emerald/30" : ""}`}
                            >
                              {clinic.isVisible ? "Visible" : "Hidden"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                            {clinic.address && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin size={10} /> {clinic.address}
                              </span>
                            )}
                            {clinic.phone && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Phone size={10} /> {clinic.phone}
                              </span>
                            )}
                            {clinic.hours && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={10} /> {clinic.hours}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Toggle visibility */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleVisibility(clinic)}
                          data-ocid={`admin.clinic.toggle.${idx + 1}`}
                          className="w-8 h-8 hover:bg-muted"
                          title={clinic.isVisible ? "Hide" : "Show"}
                        >
                          {clinic.isVisible ? (
                            <Eye size={14} className="text-emerald" />
                          ) : (
                            <EyeOff
                              size={14}
                              className="text-muted-foreground"
                            />
                          )}
                        </Button>

                        {/* Edit */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(clinic)}
                          data-ocid={`admin.clinic.edit_button.${idx + 1}`}
                          className="w-8 h-8 hover:bg-cyan/10"
                          title="Edit"
                        >
                          <Edit3 size={14} className="text-cyan" />
                        </Button>

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              data-ocid={`admin.clinic.delete_button.${idx + 1}`}
                              className="w-8 h-8 hover:bg-destructive/10"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Clinic?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete "{clinic.name}".
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-ocid="admin.clinic.cancel_button">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(clinic.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                data-ocid="admin.clinic.confirm_button"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
        <DialogContent
          className="glass border border-border/50 max-w-lg"
          data-ocid="admin.clinic.dialog"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald to-cyan rounded-t-lg" />
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Building2 size={18} className="text-emerald" />
              {editingClinic ? "Edit Clinic" : "Add New Clinic"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fields grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-medium">Clinic Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="City Health Clinic"
                  required
                  className="text-sm bg-background/50"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <MapPin size={11} className="text-violet" /> Address
                </Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="123 Medical Street, City"
                  className="text-sm bg-background/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Phone size={11} className="text-cyan" /> Phone
                </Label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  className="text-sm bg-background/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Clock size={11} className="text-amber" /> Hours
                </Label>
                <Input
                  value={form.hours}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hours: e.target.value }))
                  }
                  placeholder="Mon–Fri 9AM–6PM"
                  className="text-sm bg-background/50"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <LinkIcon size={11} className="text-emerald" /> Google Maps
                  URL
                </Label>
                <Input
                  value={form.mapsUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, mapsUrl: e.target.value }))
                  }
                  placeholder="https://maps.google.com/..."
                  type="url"
                  className="text-sm bg-background/50"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Calendar size={11} className="text-violet" /> Booking URL
                </Label>
                <Input
                  value={form.bookingUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bookingUrl: e.target.value }))
                  }
                  placeholder="https://booking.example.com/..."
                  type="url"
                  className="text-sm bg-background/50"
                />
              </div>
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
                data-ocid="admin.clinic.save_button"
                disabled={isSaving}
                size="sm"
                className="bg-gradient-to-r from-emerald to-cyan text-white border-0 hover:opacity-90 gap-1.5"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {isSaving
                  ? "Saving..."
                  : editingClinic
                    ? "Update"
                    : "Add Clinic"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
