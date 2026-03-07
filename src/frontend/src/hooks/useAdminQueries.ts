/**
 * Admin-specific mutations that use useAdminActor instead of useActor.
 * These are identical to the mutations in useQueries.ts except they rely on
 * the Ed25519-authenticated actor that can pass the backend's admin check.
 *
 * Each mutation catches Unauthorized errors and triggers a reinitialize()
 * so the admin session can recover automatically.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AboutContent, FooterContent, HeaderContent } from "../backend.d";
import { useAdminActor } from "./useAdminActor";

/** Returns true if the error looks like an authorization failure */
function isUnauthorizedError(err: unknown): boolean {
  if (!err) return false;
  const msg = String(err).toLowerCase();
  return (
    msg.includes("unauthorized") ||
    msg.includes("not admin") ||
    msg.includes("access denied") ||
    msg.includes("caller is not")
  );
}

/** Handles a mutation error — shows specific toast for auth errors */
function handleMutationError(
  err: unknown,
  reinitialize: () => void,
  label: string,
) {
  if (isUnauthorizedError(err)) {
    toast.error("Save failed: admin session expired. Please reload the page.");
    reinitialize();
  } else {
    toast.error(`Failed to save ${label}`);
  }
  throw err;
}

// ── Header ─────────────────────────────────────────────

export function useAdminSetHeader() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (header: HeaderContent) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.setHeader(header);
      } catch (err) {
        return handleMutationError(err, reinitialize, "header");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["header"] }),
  });
}

// ── About ──────────────────────────────────────────────

export function useAdminSetAbout() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (about: AboutContent) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.setAbout(about);
      } catch (err) {
        return handleMutationError(err, reinitialize, "about section");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["about"] }),
  });
}

// ── Footer ─────────────────────────────────────────────

export function useAdminSetFooter() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (footer: FooterContent) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.setFooter(footer);
      } catch (err) {
        return handleMutationError(err, reinitialize, "footer");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["footer"] }),
  });
}

// ── Clinics ────────────────────────────────────────────

export function useAdminAddClinic() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
      phone: string;
      hours: string;
      mapsUrl: string;
      bookingUrl: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.addClinic(
          data.name,
          data.address,
          data.phone,
          data.hours,
          data.mapsUrl,
          data.bookingUrl,
        );
      } catch (err) {
        return handleMutationError(err, reinitialize, "clinic");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

export function useAdminUpdateClinic() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      address: string;
      phone: string;
      hours: string;
      mapsUrl: string;
      bookingUrl: string;
      isVisible: boolean;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.updateClinic(
          data.id,
          data.name,
          data.address,
          data.phone,
          data.hours,
          data.mapsUrl,
          data.bookingUrl,
          data.isVisible,
        );
      } catch (err) {
        return handleMutationError(err, reinitialize, "clinic");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

export function useAdminDeleteClinic() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.deleteClinic(id);
      } catch (err) {
        return handleMutationError(err, reinitialize, "clinic");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

// ── Services ───────────────────────────────────────────

export function useAdminAddService() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.addService(
          data.title,
          data.description,
          data.iconName,
        );
      } catch (err) {
        return handleMutationError(err, reinitialize, "service");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAdminUpdateService() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.updateService(
          data.id,
          data.title,
          data.description,
          data.iconName,
        );
      } catch (err) {
        return handleMutationError(err, reinitialize, "service");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAdminDeleteService() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.deleteService(id);
      } catch (err) {
        return handleMutationError(err, reinitialize, "service");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

// ── Social Links ───────────────────────────────────────

export function useAdminAddSocialLink() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.addSocialLink(
          data.platform,
          data.url,
          data.iconName,
        );
      } catch (err) {
        return handleMutationError(err, reinitialize, "social link");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useAdminUpdateSocialLink() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.updateSocialLink(
          data.id,
          data.platform,
          data.url,
          data.iconName,
        );
      } catch (err) {
        return handleMutationError(err, reinitialize, "social link");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useAdminDeleteSocialLink() {
  const { actor, reinitialize } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated as admin");
      try {
        return await actor.deleteSocialLink(id);
      } catch (err) {
        return handleMutationError(err, reinitialize, "social link");
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}
