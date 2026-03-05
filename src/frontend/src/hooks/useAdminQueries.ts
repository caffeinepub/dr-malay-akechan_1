/**
 * Admin-specific mutations that use useAdminActor instead of useActor.
 * These are identical to the mutations in useQueries.ts except they rely on
 * the Ed25519-authenticated actor that can pass the backend's admin check.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AboutContent, FooterContent, HeaderContent } from "../backend.d";
import { useAdminActor } from "./useAdminActor";

// ── Header ─────────────────────────────────────────────

export function useAdminSetHeader() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (header: HeaderContent) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.setHeader(header);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["header"] }),
  });
}

// ── About ──────────────────────────────────────────────

export function useAdminSetAbout() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (about: AboutContent) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.setAbout(about);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["about"] }),
  });
}

// ── Footer ─────────────────────────────────────────────

export function useAdminSetFooter() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (footer: FooterContent) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.setFooter(footer);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["footer"] }),
  });
}

// ── Clinics ────────────────────────────────────────────

export function useAdminAddClinic() {
  const { actor } = useAdminActor();
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
      return actor.addClinic(
        data.name,
        data.address,
        data.phone,
        data.hours,
        data.mapsUrl,
        data.bookingUrl,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

export function useAdminUpdateClinic() {
  const { actor } = useAdminActor();
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
      return actor.updateClinic(
        data.id,
        data.name,
        data.address,
        data.phone,
        data.hours,
        data.mapsUrl,
        data.bookingUrl,
        data.isVisible,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

export function useAdminDeleteClinic() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.deleteClinic(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clinics"] });
      qc.invalidateQueries({ queryKey: ["allClinics"] });
    },
  });
}

// ── Services ───────────────────────────────────────────

export function useAdminAddService() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.addService(data.title, data.description, data.iconName);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAdminUpdateService() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.updateService(
        data.id,
        data.title,
        data.description,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

export function useAdminDeleteService() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.deleteService(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

// ── Social Links ───────────────────────────────────────

export function useAdminAddSocialLink() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.addSocialLink(data.platform, data.url, data.iconName);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useAdminUpdateSocialLink() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      platform: string;
      url: string;
      iconName: string;
    }) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.updateSocialLink(
        data.id,
        data.platform,
        data.url,
        data.iconName,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}

export function useAdminDeleteSocialLink() {
  const { actor } = useAdminActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated as admin");
      return actor.deleteSocialLink(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["socialLinks"] }),
  });
}
